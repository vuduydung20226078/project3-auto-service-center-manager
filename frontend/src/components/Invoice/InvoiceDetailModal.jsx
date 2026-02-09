import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaDollarSign, FaFileInvoice, FaCar, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import { invoicesApi } from '../../api/invoicesApi';
import toast from '../../utils/toast';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #f3f4f6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 0;
  opacity: 0.9;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Body = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 500;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status) {
      case 'PAID': return '#d4edda';
      case 'PARTIALLY_PAID': return '#fff3cd';
      case 'UNPAID': return '#f8d7da';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'PAID': return '#155724';
      case 'PARTIALLY_PAID': return '#856404';
      case 'UNPAID': return '#721c24';
      default: return '#333';
    }
  }};
`;

const AmountCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  color: white;
  text-align: center;
`;

const AmountLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
`;

const AmountValue = styled.div`
  font-size: 36px;
  font-weight: 700;
`;

const PaymentsTable = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
`;

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const PaymentInfo = styled.div`
  flex: 1;
`;

const PaymentDate = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
`;

const PaymentAmount = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const EmptyPayments = styled.div`
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 2px solid #f3f4f6;
  background-color: #f8f9fa;
  border-radius: 0 0 16px 16px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
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

const MarkPaidButton = styled(Button)`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CloseBtn = styled(Button)`
  background-color: #e9ecef;
  color: #666;

  &:hover {
    background-color: #dee2e6;
  }
`;

const InvoiceDetailModal = ({ invoice, onClose, onUpdate }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoice?.id) {
      loadPayments();
    }
  }, [invoice]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await invoicesApi.getPayments(invoice.id);
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (window.confirm('Mark this invoice as PAID?')) {
      try {
        await invoicesApi.updateStatus(invoice.id, 'PAID');
        toast.success('Invoice marked as paid');
        onUpdate?.();
        onClose();
      } catch (error) {
        console.error('Error updating invoice:', error);
        toast.error('Failed to update invoice');
      }
    }
  };

  const formatCurrency = (amount) => {
    return `${parseFloat(amount || 0).toFixed(0)} VND`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!invoice) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FaFileInvoice />
            Invoice Details
          </Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Body>
          {/* Invoice Information */}
          <Section>
            <SectionTitle>
              <FaFileInvoice />
              Invoice Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Invoice Number</InfoLabel>
                <InfoValue>{invoice.invoice_no}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <StatusBadge status={invoice.status}>
                  {invoice.status.replace('_', ' ')}
                </StatusBadge>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Work Order ID</InfoLabel>
                <InfoValue>WO-{invoice.work_order_id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Created Date</InfoLabel>
                <InfoValue>{formatDate(invoice.createdAt)}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* Vehicle Information */}
          {invoice.WorkOrder?.Vehicle && (
            <Section>
              <SectionTitle>
                <FaCar />
                Vehicle Information
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>License Plate</InfoLabel>
                  <InfoValue>{invoice.WorkOrder.Vehicle.license_plate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Model</InfoLabel>
                  <InfoValue>{invoice.WorkOrder.Vehicle.model}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </Section>
          )}

          {/* Amount */}
          <Section>
            <AmountCard>
              <AmountLabel>Total Amount Due</AmountLabel>
              <AmountValue>{formatCurrency(invoice.amount_due)}</AmountValue>
            </AmountCard>
          </Section>

          {/* Payments */}
          <Section>
            <SectionTitle>
              <FaDollarSign />
              Payment History
            </SectionTitle>
            <PaymentsTable>
              {loading ? (
                <EmptyPayments>Loading payments...</EmptyPayments>
              ) : payments.length > 0 ? (
                payments.map((payment, index) => (
                  <PaymentRow key={index}>
                    <PaymentInfo>
                      <PaymentDate>{formatDate(payment.payment_date)}</PaymentDate>
                      <PaymentAmount>{formatCurrency(payment.amount)}</PaymentAmount>
                    </PaymentInfo>
                  </PaymentRow>
                ))
              ) : (
                <EmptyPayments>No payments recorded yet</EmptyPayments>
              )}
            </PaymentsTable>
          </Section>
        </Body>

        <Footer>
          <CloseBtn onClick={onClose}>Close</CloseBtn>
          {invoice.status !== 'PAID' && (
            <MarkPaidButton onClick={handleMarkAsPaid}>
              <FaCheckCircle />
              Mark as Paid
            </MarkPaidButton>
          )}
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default InvoiceDetailModal;
