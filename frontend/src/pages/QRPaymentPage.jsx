import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';

const PageContainer = styled.div`
  padding: 30px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaymentCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  transition: all 0.2s;

  &:hover {
    color: #333;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
  margin-top: 20px;
`;

const PaymentBrand = styled.span`
  color: ${props => props.brand === 'momo' ? '#ec4899' : '#3b82f6'};
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 13px;
  color: #999;
  margin-bottom: 32px;
`;

const AmountSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
`;

const AmountLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
`;

const AmountValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
`;

const AmountNote = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const QRSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const QRLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const QRContainer = styled.div`
  display: inline-block;
  padding: 24px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const PaymentMethodBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  background: ${props => props.brand === 'momo' ? 
    'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)' : 
    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
`;

const ExpiryNotice = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #856404;

  svg {
    color: #ffc107;
    flex-shrink: 0;
  }
`;

const CountdownTimer = styled.span`
  font-weight: 700;
  color: #dc3545;
`;

const DetailsSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const DetailsSectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  font-size: 13px;
  color: #666;
`;

const DetailValue = styled.div`
  font-size: 13px;
  color: #333;
  font-weight: 600;
  text-align: right;
`;

const StatusSection = styled.div`
  background: ${props => props.status === 'success' ? '#d1fae5' : '#fff3e0'};
  border: 2px solid ${props => props.status === 'success' ? '#10b981' : '#f59e0b'};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusIcon = styled.div`
  font-size: 24px;
  color: ${props => props.status === 'success' ? '#10b981' : '#f59e0b'};
  animation: ${props => props.status === 'pending' ? 'spin 2s linear infinite' : 'none'};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatusContent = styled.div`
  flex: 1;
`;

const StatusTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.status === 'success' ? '#065f46' : '#92400e'};
  margin-bottom: 4px;
`;

const StatusDesc = styled.div`
  font-size: 12px;
  color: ${props => props.status === 'success' ? '#047857' : '#b45309'};
`;

const StatusBadge = styled.div`
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => props.status === 'success' ? '#10b981' : '#f59e0b'};
  color: white;
`;

const WaitingIndicator = styled.div`
  text-align: center;
  padding: 16px;
  margin-bottom: 24px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const WaitingText = styled.div`
  font-size: 14px;
  color: #666;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const ConfirmButton = styled(Button)`
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;

  &:hover {
    background: #f0f4ff;
  }
`;

const SecurityNote = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const LockIcon = styled.div`
  color: #10b981;
`;

const QRPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { invoice, workOrderDetails, paymentMethod } = location.state || {};
  
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payment URL on mount
  useEffect(() => {
    const createPayment = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoiceNo: invoice?.invoice_no || `INV-${Date.now()}`,
            amount: invoice?.amount_due || 100000,
            orderInfo: `Payment for invoice ${invoice?.invoice_no || 'test'}`,
            ipAddr: '127.0.0.1'
          })
        });

        const data = await response.json();
        
        if (data.success && data.paymentUrl) {
          setPaymentUrl(data.paymentUrl);
        } else {
          setError(data.message || 'Failed to create payment');
        }
      } catch (err) {
        console.error('Error creating payment:', err);
        setError('Failed to create payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    createPayment();
  }, [invoice]);

  // Countdown timer
  useEffect(() => {
    if (paymentStatus === 'pending' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStatus, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(parseFloat(amount || 0));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirmManually = () => {
    // Simulate payment confirmation
    setPaymentStatus('success');
    setTimeout(() => {
      navigate('/admin', { 
        state: { 
          message: 'Payment completed successfully!',
          type: 'success' 
        } 
      });
    }, 2000);
  };

  const brandName = paymentMethod === 'momo' ? 'MoMo' : 'VNPAY';
  const brandColor = paymentMethod === 'momo' ? 'momo' : 'vnpay';

  return (
    <PageContainer>
      <PaymentCard>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to invoice
        </BackButton>

        <Title>
          Scan to Pay with <PaymentBrand brand={brandColor}>{brandName}</PaymentBrand>
        </Title>
        <Subtitle>Invoice: {invoice?.invoice_no || 'INV-240127-0489'}</Subtitle>

        <AmountSection>
          <AmountLabel>Total Amount</AmountLabel>
          <AmountValue>{formatCurrency(invoice?.amount_due || 0)} VND</AmountValue>
          <AmountNote>Please complete payment to continue</AmountNote>
        </AmountSection>

        {loading ? (
          <WaitingIndicator>
            <Spinner />
            <WaitingText>Generating payment QR code...</WaitingText>
          </WaitingIndicator>
        ) : error ? (
          <StatusSection status="pending">
            <StatusIcon status="pending">
              <FaClock />
            </StatusIcon>
            <StatusContent>
              <StatusTitle status="pending">Error</StatusTitle>
              <StatusDesc status="pending">{error}</StatusDesc>
            </StatusContent>
          </StatusSection>
        ) : (
          <QRSection>
            <QRLabel>Scan with {brandName} app or click QR to open payment page</QRLabel>
            <QRContainer onClick={() => window.open(paymentUrl, '_blank')} style={{ cursor: 'pointer' }}>
              <QRCode 
                value={paymentUrl} 
                size={200}
                level="M"
              />
            </QRContainer>
            <PaymentMethodBadge brand={brandColor}>
              {brandName}
            </PaymentMethodBadge>
          </QRSection>
        )}

        {paymentStatus === 'pending' && (
          <ExpiryNotice>
            <FaClock />
            <div>
              QR code expires in <CountdownTimer>{formatTime(timeLeft)}</CountdownTimer>
            </div>
          </ExpiryNotice>
        )}

        <DetailsSection>
          <DetailsSectionTitle>Payment Details</DetailsSectionTitle>
          <DetailRow>
            <DetailLabel>Payment Method</DetailLabel>
            <DetailValue>{brandName} {paymentMethod === 'momo' ? 'E-Wallet' : 'QR'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Recipient</DetailLabel>
            <DetailValue>Auto Service Center</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Name</DetailLabel>
            <DetailValue>Amount</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Transfer Content</DetailLabel>
            <DetailValue>{invoice?.invoice_no || 'INV-240127-0489'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Amount</DetailLabel>
            <DetailValue>{formatCurrency(invoice?.amount_due || 0)} VND</DetailValue>
          </DetailRow>
        </DetailsSection>

        {paymentStatus === 'pending' ? (
          <>
            <StatusSection status="pending">
              <StatusIcon status="pending">
                <FaClock />
              </StatusIcon>
              <StatusContent>
                <StatusTitle status="pending">Waiting for Payment</StatusTitle>
                <StatusDesc status="pending">Payment will be confirmed automatically</StatusDesc>
              </StatusContent>
              <StatusBadge status="pending">PENDING</StatusBadge>
            </StatusSection>

            <WaitingIndicator>
              <Spinner />
              <WaitingText>Waiting for Payment...</WaitingText>
            </WaitingIndicator>

            <ConfirmButton onClick={handleConfirmManually}>
              Confirm Payment Manually
            </ConfirmButton>
          </>
        ) : (
          <StatusSection status="success">
            <StatusIcon status="success">
              <FaCheckCircle />
            </StatusIcon>
            <StatusContent>
              <StatusTitle status="success">Payment Successful!</StatusTitle>
              <StatusDesc status="success">Redirecting to dashboard...</StatusDesc>
            </StatusContent>
            <StatusBadge status="success">SUCCESS</StatusBadge>
          </StatusSection>
        )}

        <SecurityNote>
          <LockIcon>🔒</LockIcon>
          Payment is secure and encrypted
        </SecurityNote>
      </PaymentCard>
    </PageContainer>
  );
};

export default QRPaymentPage;
