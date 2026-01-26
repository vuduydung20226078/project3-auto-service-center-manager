import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaUser, FaCar, FaTools, FaClipboardList } from 'react-icons/fa';
import { workOrdersApi } from '../../api/workOrdersApi';
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
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
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

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const OrderNumber = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${props => {
    switch(props.$status) {
      case 'open': return '#e3f2fd';
      case 'in-progress': return '#fff3e0';
      case 'completed': return '#e8f5e9';
      case 'waiting-parts': return '#fce4ec';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'open': return '#1976d2';
      case 'in-progress': return '#f57c00';
      case 'completed': return '#388e3c';
      case 'waiting-parts': return '#c2185b';
      default: return '#666';
    }
  }};
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

const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid #e9ecef;
  padding: 0 24px;
`;

const Tab = styled.button`
  padding: 16px 24px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$active ? '#2563eb' : '#666'};
  border-bottom: 3px solid ${props => props.$active ? '#2563eb' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #2563eb;
  }
`;

const Body = styled.div`
  padding: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const InfoCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
`;

const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #e9ecef;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e9ecef;
`;

const TotalRow = styled.tr`
  background-color: #f8f9fa;
  font-weight: 700;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
`;

const WorkOrderDetail = ({ workOrder, onClose, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workOrder?.id) {
      fetchDetails();
    }
  }, [workOrder]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await workOrdersApi.getById(workOrder.id);
      setDetailData(data);
    } catch (error) {
      console.error('Error fetching work order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTech = async () => {
    const techId = prompt('Enter Technician ID:');
    if (!techId) return;
    
    try {
      await workOrdersApi.assignTechnician(workOrder.id, techId);
      fetchDetails();
      onRefresh();
    } catch (error) {
      toast.error('Error assigning technician');
    }
  };

  const handleChangeStatus = async () => {
    const statuses = ['OPEN', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CLOSED'];
    const newStatus = prompt(`Enter new status:\n${statuses.join(', ')}`);
    if (!newStatus || !statuses.includes(newStatus.toUpperCase())) return;
    
    try {
      await workOrdersApi.updateStatus(workOrder.id, newStatus.toUpperCase());
      fetchDetails();
      onRefresh();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  if (loading) {
    return (
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <EmptyState>Loading...</EmptyState>
        </Modal>
      </Overlay>
    );
  }

  const data = detailData || workOrder;
  console.log(data);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <div>
              <Title>Work Order Details</Title>
              <OrderNumber>Order #{data.id}</OrderNumber>
            </div>
            <StatusBadge $status={data.status?.toLowerCase().replace('_', '-')}>
              {data.status?.replace('_', ' ')}
            </StatusBadge>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Tabs>
          <Tab $active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
            <FaClipboardList /> Information
          </Tab>
          <Tab $active={activeTab === 'items'} onClick={() => setActiveTab('items')}>
            <FaTools /> Services & Parts
          </Tab>
        </Tabs>

        <Body>
          {activeTab === 'info' && (
            <>
              <InfoGrid>
                <InfoCard>
                  <InfoLabel>
                    <FaUser /> Customer
                  </InfoLabel>
                  <InfoValue>{data.customer || 'N/A'}</InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>
                    <FaCar /> Vehicle
                  </InfoLabel>
                  <InfoValue>{data.vehicle || 'N/A'}</InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>
                    <FaTools /> Technician
                  </InfoLabel>
                  <InfoValue>{data.technician || 'Unassigned'}</InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>
                    <FaClipboardList /> Booking ID
                  </InfoLabel>
                  <InfoValue>
                    {data.booking_id ? `#${data.booking_id}` : 'No prior booking'}
                  </InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>
                    Created Date
                  </InfoLabel>
                  <InfoValue>
                    {data.created_at 
                      ? new Date(data.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        })
                      : 'N/A'}
                  </InfoValue>
                </InfoCard>

                <InfoCard>
                  <InfoLabel>
                    Total Amount
                  </InfoLabel>
                  <InfoValue style={{ color: '#2563eb' }}>
                    {parseFloat(data.total_amount || 0).toFixed(0)} VND
                  </InfoValue>
                </InfoCard>
              </InfoGrid>

              <ActionBar>
                <PrimaryButton onClick={handleAssignTech}>
                  Assign Technician
                </PrimaryButton>
                <Button onClick={handleChangeStatus}>
                  Change Status
                </Button>
              </ActionBar>
            </>
          )}

          {activeTab === 'items' && (
            <>
              {data.items && data.items.length > 0 ? (
                <ItemsTable>
                  <thead>
                    <tr>
                      <Th>Type</Th>
                      <Th>Item</Th>
                      <Th>Quantity</Th>
                      <Th>Unit Price</Th>
                      <Th>Subtotal</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, index) => (
                      <tr key={index}>
                        <Td>{item.item_type}</Td>
                        <Td>{item.name || item.description || 'N/A'}</Td>
                        <Td>{item.quantity}</Td>
                        <Td>{parseFloat(item.unit_price || 0).toFixed(0)} VND</Td>
                        <Td>{parseFloat(item.line_total || 0).toFixed(0)} VND</Td>
                      </tr>
                    ))}
                    <TotalRow>
                      <Td colSpan="4" style={{ textAlign: 'right' }}>Total:</Td>
                      <Td>{parseFloat(data.total_amount || 0).toFixed(0)} VND</Td>
                    </TotalRow>
                  </tbody>
                </ItemsTable>
              ) : (
                <EmptyState>No items added yet</EmptyState>
              )}
            </>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
};

export default WorkOrderDetail;
