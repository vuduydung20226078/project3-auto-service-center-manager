import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 30px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  color: ${props => props.status === 'success' ? '#10b981' : props.status === 'failed' ? '#ef4444' : '#3b82f6'};
  
  ${props => props.status === 'processing' && `
    animation: spin 1s linear infinite;
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.status === 'success' ? '#10b981' : props.status === 'failed' ? '#ef4444' : '#3b82f6'};
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const DetailsSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 600;
  text-align: right;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PaymentResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Extract all query params from URL
        const params = new URLSearchParams(location.search);
        const paymentData = Object.fromEntries(params);

        console.log('🔄 Processing VNPay return params:', paymentData);

        // Check if we have VNPay params
        if (!paymentData.vnp_TxnRef) {
          setStatus('failed');
          setErrorMessage('Invalid payment data');
          return;
        }

        // POST to backend to process payment
        const response = await fetch('http://localhost:3000/api/payment/vnpay/return', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        });

        const result = await response.json();
        console.log('✅ Backend response:', result);

        if (result.success && result.payment) {
          setPaymentDetails({
            status: result.payment.status,
            amount: result.payment.amount,
            transactionRef: result.payment.transaction_ref,
            invoiceNo: paymentData.vnp_TxnRef,
            invoiceStatus: result.invoice?.status,
            payDate: paymentData.vnp_PayDate,
            bankCode: paymentData.vnp_BankCode,
            cardType: paymentData.vnp_CardType
          });

          if (result.payment.status === 'SUCCESS') {
            setStatus('success');
          } else {
            setStatus('failed');
            setErrorMessage('Payment was not successful');
          }
        } else {
          setStatus('failed');
          setErrorMessage(result.error || 'Payment processing failed');
        }
      } catch (error) {
        console.error('❌ Error processing payment:', error);
        setStatus('failed');
        setErrorMessage('Failed to process payment. Please contact support.');
      }
    };

    processPayment();
  }, [location.search]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(parseFloat(amount || 0));
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    // Format: yyyyMMddHHmmss
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  const handleBackToDashboard = () => {
    navigate('/admin', { 
      state: { 
        message: status === 'success' ? 'Payment completed successfully!' : 'Payment failed',
        type: status === 'success' ? 'success' : 'error'
      } 
    });
  };

  return (
    <PageContainer>
      <ResultCard>
        <IconWrapper status={status}>
          {status === 'processing' && <FaSpinner />}
          {status === 'success' && <FaCheckCircle />}
          {status === 'failed' && <FaTimesCircle />}
        </IconWrapper>

        <Title status={status}>
          {status === 'processing' && 'Processing Payment...'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'failed' && 'Payment Failed'}
        </Title>

        <Message>
          {status === 'processing' && 'Please wait while we confirm your payment with the bank.'}
          {status === 'success' && 'Your payment has been processed successfully. Invoice has been marked as paid.'}
          {status === 'failed' && (errorMessage || 'Your payment could not be processed. Please try again or contact support.')}
        </Message>

        {paymentDetails && (
          <DetailsSection>
            <DetailRow>
              <DetailLabel>Invoice Number</DetailLabel>
              <DetailValue>{paymentDetails.invoiceNo}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Invoice Status</DetailLabel>
              <DetailValue style={{ color: paymentDetails.invoiceStatus === 'PAID' ? '#10b981' : '#f59e0b' }}>
                {paymentDetails.invoiceStatus || 'UNKNOWN'}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Amount</DetailLabel>
              <DetailValue>{formatCurrency(paymentDetails.amount)} VND</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Transaction Ref</DetailLabel>
              <DetailValue>{paymentDetails.transactionRef}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Payment Method</DetailLabel>
              <DetailValue>VNPAY {paymentDetails.cardType ? `(${paymentDetails.cardType})` : ''}</DetailValue>
            </DetailRow>
            {paymentDetails.bankCode && (
              <DetailRow>
                <DetailLabel>Bank</DetailLabel>
                <DetailValue>{paymentDetails.bankCode}</DetailValue>
              </DetailRow>
            )}
            <DetailRow>
              <DetailLabel>Payment Date</DetailLabel>
              <DetailValue>{formatDateTime(paymentDetails.payDate)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Payment Status</DetailLabel>
              <DetailValue style={{ color: paymentDetails.status === 'SUCCESS' ? '#10b981' : '#ef4444' }}>
                {paymentDetails.status}
              </DetailValue>
            </DetailRow>
          </DetailsSection>
        )}

        <Button onClick={handleBackToDashboard} disabled={status === 'processing'}>
          {status === 'processing' ? 'Processing...' : 'Back to Dashboard'}
        </Button>
      </ResultCard>
    </PageContainer>
  );
};

export default PaymentResultPage;
