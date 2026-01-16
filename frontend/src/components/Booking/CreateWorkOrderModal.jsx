import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaWrench } from 'react-icons/fa';

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
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
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

const InfoBox = styled.div`
  background-color: #e3f2fd;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const InfoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1565c0;
  margin-bottom: 8px;

  svg {
    font-size: 18px;
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #1565c0;
  margin: 0;
  line-height: 1.5;
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  gap: 8px;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #333;
  min-width: 120px;
`;

const DetailValue = styled.span`
  color: #666;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
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

const CancelButton = styled(Button)`
  background-color: #e9ecef;
  color: #666;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #2563eb;
  color: white;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

const CreateWorkOrderModal = ({ booking, onClose, onConfirm }) => {
  if (!booking) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const customerName = booking.Customer?.name || booking.customer?.name || 'N/A';
  const vehiclePlate = booking.Vehicle?.license_plate || booking.vehicle?.plate || 'N/A';
  const vehicleYear = booking.Vehicle?.year || booking.vehicle?.year || '';
  const vehicleMake = booking.Vehicle?.make || '';
  const vehicleModel = booking.Vehicle?.model || booking.vehicle?.model || 'N/A';

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Create Work Order</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Body>
          <InfoBox>
            <InfoTitle>
              <FaWrench />
              Create a new work order from this booking?
            </InfoTitle>
            <InfoText>
              A work order will be created for <strong>{customerName}</strong> with 
              the vehicle <strong>{vehiclePlate}</strong>. You can add services and parts 
              after creation.
            </InfoText>
          </InfoBox>

          <DetailsList>
            <DetailItem>
              <DetailLabel>Booking ID:</DetailLabel>
              <DetailValue>#{booking.id}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Scheduled for:</DetailLabel>
              <DetailValue>
                {formatDate(booking.scheduled_at || booking.scheduledDate)} at {formatTime(booking.scheduled_at || booking.scheduledTime)}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Vehicle:</DetailLabel>
              <DetailValue>{vehicleYear} {vehicleMake} {vehicleModel}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Customer:</DetailLabel>
              <DetailValue>{customerName}</DetailValue>
            </DetailItem>
          </DetailsList>
        </Body>

        <Footer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm}>
            <FaWrench />
            Create Work Order
          </ConfirmButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default CreateWorkOrderModal;
