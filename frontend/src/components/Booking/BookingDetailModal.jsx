import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaCheckCircle, FaCalendar, FaUser } from 'react-icons/fa';

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
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
`;

const TitleSection = styled.div``;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #333;
  }
`;

const Body = styled.div`
  padding: 24px;
`;

const StatusSection = styled.div`
  background-color: #d4edda;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const StatusLabel = styled.div`
  font-size: 14px;
  color: #155724;
  margin-bottom: 8px;
  font-weight: 600;
`;

const StatusValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #155724;

  svg {
    font-size: 20px;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;

  svg {
    color: #2563eb;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e9ecef;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseBtn = styled(Button)`
  background-color: #e9ecef;
  color: #666;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

const CancelBtn = styled(Button)`
  background-color: #dc3545;
  color: white;
  
  &:hover {
    background-color: #c82333;
  }
`;

const ConfirmBtn = styled(Button)`
  background-color: #10b981;
  color: white;
  
  &:hover {
    background-color: #059669;
  }
`;

const CreateWOBtn = styled(Button)`
  background-color: #2563eb;
  color: white;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

const BookingDetailModal = ({ booking, onClose, onCreateWorkOrder, onConfirmBooking, onCancelBooking }) => {
  if (!booking) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return { bg: '#d4edda', color: '#155724' };
      case 'PENDING': return { bg: '#fff3cd', color: '#856404' };
      case 'CANCELLED': return { bg: '#f8d7da', color: '#721c24' };
      default: return { bg: '#e9ecef', color: '#495057' };
    }
  };

  const statusColors = getStatusColor(booking.status);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <TitleSection>
            <Title>Booking Details #{booking.id}</Title>
            <Subtitle>Created {formatDateTime(booking.created_at || booking.createdAt)}</Subtitle>
          </TitleSection>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Body>
          <StatusSection style={{ backgroundColor: statusColors.bg }}>
            <StatusLabel style={{ color: statusColors.color }}>Current Status</StatusLabel>
            <StatusValue style={{ color: statusColors.color }}>
              <FaCheckCircle />
              {booking.status}
            </StatusValue>
          </StatusSection>

          <Section>
            <SectionTitle>
              <FaCalendar />
              Booking Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Scheduled Date</InfoLabel>
                <InfoValue>{formatDate(booking.scheduled_at || booking.scheduledDate)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Scheduled Time</InfoLabel>
                <InfoValue>{formatTime(booking.scheduled_at || booking.scheduledTime)}</InfoValue>
              </InfoItem>
              <InfoItem style={{ gridColumn: '1 / -1' }}>
                <InfoLabel>Notes</InfoLabel>
                <InfoValue>{booking.notes || 'No notes'}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FaUser />
              Customer Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Name</InfoLabel>
                <InfoValue>{booking.Customer?.name || booking.customer?.name || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{booking.Customer?.phone || booking.customer?.phone || 'N/A'}</InfoValue>
              </InfoItem>
              {(booking.Customer?.email || booking.customer?.email) && (
                <InfoItem style={{ gridColumn: '1 / -1' }}>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{booking.Customer?.email || booking.customer?.email}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>

          <Section>
            <SectionTitle>
              🚗 Vehicle Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>License Plate</InfoLabel>
                <InfoValue>{booking.Vehicle?.license_plate || booking.vehicle?.plate || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Model</InfoLabel>
                <InfoValue>
                  {booking.Vehicle?.year || booking.vehicle?.year || ''} {booking.Vehicle?.make || ''} {booking.Vehicle?.model || booking.vehicle?.model || 'N/A'}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>
        </Body>

        <Footer>
          <CloseBtn onClick={onClose}>Close</CloseBtn>
          <div style={{ display: 'flex', gap: '12px' }}>
            {booking.status === 'PENDING' && (
              <ConfirmBtn onClick={onConfirmBooking}>
                ✓ Confirm Booking
              </ConfirmBtn>
            )}
            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
              <>
                <CancelBtn onClick={onCancelBooking}>
                  🗑️ Cancel Booking
                </CancelBtn>
                <CreateWOBtn onClick={onCreateWorkOrder}>
                  🔧 Create Work Order
                </CreateWOBtn>
              </>
            )}
          </div>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default BookingDetailModal;
