import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaArrowLeft, FaPrint, FaDownload } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const PageContainer = styled.div`
  margin-left: 280px;
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
  max-width: 800px;
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
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
`;

const InvoiceInfo = styled.div`
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #666;
`;

const InfoValue = styled.span`
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const Thead = styled.thead`
  background-color: #f8f9fa;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e9ecef;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e9ecef;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #333;
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 28px;
  font-weight: 700;
`;

const QRSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const QRCode = styled.div`
  width: 200px;
  height: 200px;
  background: white;
  border: 4px solid #667eea;
  border-radius: 12px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  background-image: 
    repeating-linear-gradient(0deg, #667eea 0px, #667eea 10px, white 10px, white 20px),
    repeating-linear-gradient(90deg, #667eea 0px, #667eea 10px, white 10px, white 20px);
`;

const QRText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 8px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const BackButton = styled(Button)`
  background-color: #e9ecef;
  color: #666;

  &:hover {
    background-color: #dee2e6;
  }
`;

const PrintButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { invoice, workOrderDetails } = location.state || {};

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer>
      <PaymentCard>
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        
        <Title>Invoice Created Successfully!</Title>
        <Subtitle>Invoice #{invoice?.invoice_no || 'N/A'}</Subtitle>

        <InvoiceInfo>
          <InfoRow>
            <InfoLabel>Customer Name:</InfoLabel>
            <InfoValue>{workOrderDetails?.Vehicle?.Customer?.name || '-'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Phone:</InfoLabel>
            <InfoValue>{workOrderDetails?.Vehicle?.Customer?.phone || '-'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{workOrderDetails?.Vehicle?.Customer?.email || '-'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Vehicle:</InfoLabel>
            <InfoValue>
              {workOrderDetails?.Vehicle?.license_plate} - {workOrderDetails?.Vehicle?.model}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Work Order:</InfoLabel>
            <InfoValue>#{workOrderDetails?.id}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Invoice Date:</InfoLabel>
            <InfoValue>{formatDate(invoice?.created_at || new Date())}</InfoValue>
          </InfoRow>
        </InvoiceInfo>

        <Section>
          <SectionTitle>Services & Parts</SectionTitle>
          <ItemsTable>
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Description</Th>
                <Th>Qty</Th>
                <Th>Unit Price</Th>
                <Th style={{ textAlign: 'right' }}>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {workOrderDetails?.WorkOrderItems?.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.item_type}</Td>
                  <Td>{item.details?.name || item.description}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{formatCurrency(item.unit_price)}</Td>
                  <Td style={{ textAlign: 'right' }}>{formatCurrency(item.line_total)}</Td>
                </Tr>
              ))}
            </Tbody>
          </ItemsTable>
        </Section>

        <TotalSection>
          <TotalRow>
            <span>Total Amount:</span>
            <span>{formatCurrency(invoice?.amount_due || 0)}</span>
          </TotalRow>
        </TotalSection>

        <QRSection>
          <SectionTitle>Scan to Pay (Mock QR Code)</SectionTitle>
          <QRCode>
            [QR Code Pattern]
          </QRCode>
          <QRText>Bank: VietComBank</QRText>
          <QRText>Account: 1234567890</QRText>
          <QRText>Amount: {formatCurrency(invoice?.amount_due || 0)}</QRText>
          <QRText>Content: {invoice?.invoice_no || 'N/A'}</QRText>
        </QRSection>

        <ButtonGroup>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back to Dashboard
          </BackButton>
          <PrintButton onClick={handlePrint}>
            <FaPrint /> Print Invoice
          </PrintButton>
        </ButtonGroup>
      </PaymentCard>
    </PageContainer>
  );
};

export default PaymentPage;
