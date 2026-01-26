import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaCar, FaUser, FaPhone, FaCalendar, FaArrowRight } from 'react-icons/fa';
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
  max-width: 900px;
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
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
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

const LoadingState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
`;

const WorkOrderList = styled.div`
  display: grid;
  gap: 16px;
`;

const WorkOrderCard = styled.div`
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
`;

const WorkOrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const WorkOrderId = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

const WorkOrderDate = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const WorkOrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;

  svg {
    color: #667eea;
    font-size: 16px;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

const SelectButton = styled.button`
  margin-top: 16px;
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const SelectWorkOrderModal = ({ onClose, onSelect }) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletedWorkOrders();
  }, []);

  const loadCompletedWorkOrders = async () => {
    try {
      setLoading(true);
      const data = await invoicesApi.getCompletedWorkOrders();
      setWorkOrders(data);
    } catch (error) {
      console.error('Error loading completed work orders:', error);
      toast.error('Failed to load work orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkOrder = (workOrder) => {
    onSelect(workOrder);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Select Work Order for Invoice</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Body>
          {loading ? (
            <LoadingState>Loading completed work orders...</LoadingState>
          ) : workOrders.length > 0 ? (
            <WorkOrderList>
              {workOrders.map((wo) => (
                <WorkOrderCard key={wo.id}>
                  <WorkOrderHeader>
                    <WorkOrderId>Work Order #{wo.id}</WorkOrderId>
                    <WorkOrderDate>
                      <FaCalendar />
                      {formatDate(wo.updated_at)}
                    </WorkOrderDate>
                  </WorkOrderHeader>

                  <WorkOrderInfo>
                    <InfoItem>
                      <FaCar />
                      <InfoLabel>Vehicle:</InfoLabel>
                      {wo.Vehicle?.license_plate} - {wo.Vehicle?.model}
                    </InfoItem>
                    <InfoItem>
                      <FaUser />
                      <InfoLabel>Customer:</InfoLabel>
                      {wo.Vehicle?.Customer?.name}
                    </InfoItem>
                    <InfoItem>
                      <FaPhone />
                      <InfoLabel>Phone:</InfoLabel>
                      {wo.Vehicle?.Customer?.phone}
                    </InfoItem>
                  </WorkOrderInfo>

                  <SelectButton onClick={() => handleSelectWorkOrder(wo)}>
                    Select This Work Order <FaArrowRight />
                  </SelectButton>
                </WorkOrderCard>
              ))}
            </WorkOrderList>
          ) : (
            <EmptyState>No completed work orders available for invoicing</EmptyState>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
};

export default SelectWorkOrderModal;
