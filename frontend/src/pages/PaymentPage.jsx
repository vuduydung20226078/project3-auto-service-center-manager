import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaArrowLeft, FaQrcode, FaCreditCard, FaLock, FaArrowRight } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

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
  max-width: 700px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
  color: white;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-bottom: 32px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
`;

const ItemsList = styled.div`
  margin-bottom: 24px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const ItemType = styled.span`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 12px;
  min-width: 70px;
  text-align: center;
  background: ${props => props.type === 'SERVICE' ? '#e3f2fd' : '#fff3e0'};
  color: ${props => props.type === 'SERVICE' ? '#1976d2' : '#f57c00'};
`;

const ItemDetails = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr;
  gap: 12px;
  align-items: center;
`;

const ItemName = styled.div`
  font-size: 14px;
  color: #333;
`;

const ItemQty = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  color: #666;
  text-align: right;
`;

const ItemTotal = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: right;
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 32px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
  
  span:last-child {
    font-size: 24px;
    font-weight: 700;
  }
`;

const PaymentMethodSection = styled.div`
  margin-bottom: 24px;
`;

const PaymentMethod = styled.div`
  border: 2px solid ${props => props.selected ? '#667eea' : '#e9ecef'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.selected ? '#f0f4ff' : 'white'};

  &:hover {
    border-color: #667eea;
  }
`;

const PaymentMethodLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PaymentIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.color || '#f8f9fa'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`;

const PaymentInfo = styled.div``;

const PaymentName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RecommendedBadge = styled.span`
  background: #ec4899;
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
`;

const PaymentDesc = styled.div`
  font-size: 13px;
  color: #999;
`;

const PaymentBadges = styled.div`
  display: flex;
  gap: 8px;
`;

const Badge = styled.div`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: ${props => props.color || '#667eea'};
  color: white;
`;

const RadioButton = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#ddd'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #667eea;
    display: ${props => props.selected ? 'block' : 'none'};
  }
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
`;

const ContinueButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecurityNote = styled.div`
  text-align: center;
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;
  
  svg {
    color: #10b981;
  }
`;

const BackButton = styled(Button)`
  background-color: transparent;
  color: #667eea;
  border: 2px solid #667eea;

  &:hover {
    background-color: #f0f4ff;
  }
`;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { invoice, workOrderDetails } = location.state || {};
  const [selectedPayment, setSelectedPayment] = useState('momo');

  const formatCurrency = (amount) => {
    return `${parseFloat(amount || 0).toFixed(0)} VND`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    navigate('/admin');
  };

  const handleContinuePayment = () => {
    if (selectedPayment === 'card') {
      navigate('/payment/credit-card', {
        state: { invoice, workOrderDetails }
      });
    } else {
      navigate('/payment/qr', {
        state: { 
          invoice, 
          workOrderDetails,
          paymentMethod: selectedPayment
        }
      });
    }
  };

  return (
    <PageContainer>
      <PaymentCard>
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        
        <Title>Invoice Created Successfully!</Title>
        <Subtitle>Invoice No: {invoice?.invoice_no || 'N/A'}</Subtitle>

        <InfoGrid>
          <InfoCard>
            <InfoLabel>Customer Name</InfoLabel>
            <InfoValue>{workOrderDetails?.Vehicle?.Customer?.name || '-'}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Phone</InfoLabel>
            <InfoValue>{workOrderDetails?.Vehicle?.Customer?.phone || '-'}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{workOrderDetails?.Vehicle?.Customer?.email || '-'}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Vehicle</InfoLabel>
            <InfoValue>
              {workOrderDetails?.Vehicle?.license_plate} - {workOrderDetails?.Vehicle?.model}
            </InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Work Order ID</InfoLabel>
            <InfoValue>#{workOrderDetails?.id}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Invoice Date</InfoLabel>
            <InfoValue>{formatDate(invoice?.created_at || new Date())}</InfoValue>
          </InfoCard>
        </InfoGrid>

        <Section>
          <SectionTitle>Services & Parts</SectionTitle>
          <ItemsList>
            {workOrderDetails?.WorkOrderItems?.map((item, index) => (
              <ItemRow key={index}>
                <ItemType type={item.item_type}>{item.item_type}</ItemType>
                <ItemDetails>
                  <ItemName>{item.details?.name || item.description}</ItemName>
                  <ItemQty>{item.quantity}</ItemQty>
                  <ItemPrice>{formatCurrency(item.unit_price)}</ItemPrice>
                  <ItemTotal>{formatCurrency(item.line_total)}</ItemTotal>
                </ItemDetails>
              </ItemRow>
            ))}
          </ItemsList>
        </Section>

        <TotalSection>
          <TotalRow>
            <span>Total Amount:</span>
            <span>{formatCurrency(invoice?.amount_due || 0)}</span>
          </TotalRow>
        </TotalSection>

        <PaymentMethodSection>
          <SectionTitle>Select Payment Method</SectionTitle>
          
          <PaymentMethod 
            selected={selectedPayment === 'momo'}
            onClick={() => setSelectedPayment('momo')}
          >
            <PaymentMethodLeft>
              <PaymentIcon color="linear-gradient(135deg, #ec4899 0%, #d946ef 100%)">
                <FaQrcode />
              </PaymentIcon>
              <PaymentInfo>
                <PaymentName>
                  MoMo
                  <RecommendedBadge>Recommended</RecommendedBadge>
                </PaymentName>
                <PaymentDesc>Scan QR code with MoMo app</PaymentDesc>
              </PaymentInfo>
            </PaymentMethodLeft>
            <PaymentBadges>
              <Badge color="#ec4899">MoMo</Badge>
            </PaymentBadges>
            <RadioButton selected={selectedPayment === 'momo'} />
          </PaymentMethod>

          <PaymentMethod 
            selected={selectedPayment === 'vnpay'}
            onClick={() => setSelectedPayment('vnpay')}
          >
            <PaymentMethodLeft>
              <PaymentIcon color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
                <FaQrcode />
              </PaymentIcon>
              <PaymentInfo>
                <PaymentName>VNPAY</PaymentName>
                <PaymentDesc>Scan QR code with banking app</PaymentDesc>
              </PaymentInfo>
            </PaymentMethodLeft>
            <PaymentBadges>
              <Badge color="#3b82f6">VNPAY</Badge>
            </PaymentBadges>
            <RadioButton selected={selectedPayment === 'vnpay'} />
          </PaymentMethod>

          <PaymentMethod 
            selected={selectedPayment === 'card'}
            onClick={() => setSelectedPayment('card')}
          >
            <PaymentMethodLeft>
              <PaymentIcon color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
                <FaCreditCard />
              </PaymentIcon>
              <PaymentInfo>
                <PaymentName>Credit Card</PaymentName>
                <PaymentDesc>Pay with international cards</PaymentDesc>
              </PaymentInfo>
            </PaymentMethodLeft>
            <PaymentBadges>
              <Badge color="#1976d2">VISA</Badge>
              <Badge color="#ff5722">MASTER</Badge>
            </PaymentBadges>
            <RadioButton selected={selectedPayment === 'card'} />
          </PaymentMethod>
        </PaymentMethodSection>

        <ContinueButton onClick={handleContinuePayment}>
          Continue to Payment <FaArrowRight />
        </ContinueButton>

        <SecurityNote>
          <FaLock /> Your payment information is secure and encrypted
        </SecurityNote>

        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
      </PaymentCard>
    </PageContainer>
  );
};

export default PaymentPage;
