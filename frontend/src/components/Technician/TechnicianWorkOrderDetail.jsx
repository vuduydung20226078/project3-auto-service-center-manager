import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaCar, FaUser, FaPhone, FaTachometerAlt, FaPalette, FaCheckCircle, FaSave } from 'react-icons/fa';
import technicianAPI from '../../api/technicianAPI';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 80px;
`;

const Header = styled.div`
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #374151;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const WorkOrderId = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
  background-color: ${props => {
    switch(props.$status) {
      case 'WORKING': return '#dbeafe';
      case 'WAITING': return '#fef3c7';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'WORKING': return '#1e40af';
      case 'WAITING': return '#92400e';
      default: return '#374151';
    }
  }};
`;

const Content = styled.div`
  padding: 0 20px;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
`;

const SectionIcon = styled.div`
  color: #667eea;
  font-size: 18px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: ${props => props.$highlight ? '#667eea' : '#1f2937'};
  font-weight: ${props => props.$highlight ? '700' : '500'};
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  ${props => props.$variant === 'waiting' && `
    background-color: #fbbf24;
    color: white;
    &:hover {
      background-color: #f59e0b;
    }
  `}

  ${props => props.$variant === 'done' && `
    background-color: #10b981;
    color: white;
    &:hover {
      background-color: #059669;
    }
  `}
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TaskItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
`;

const TaskText = styled.span`
  flex: 1;
  font-size: 14px;
  color: #374151;
  text-decoration: ${props => props.$checked ? 'line-through' : 'none'};
  opacity: ${props => props.$checked ? '0.6' : '1'};
`;

const PartsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
`;

const PartName = styled.div`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const PartQuantity = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #374151;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SaveNotesButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #5568d3;
  }
`;

const TechnicianWorkOrderDetail = ({ workOrder, onBack, onStatusChange }) => {
  const [tasks, setTasks] = useState([]);
  const [parts, setParts] = useState([]);
  const [notes, setNotes] = useState('');
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (workOrder?.workOrderId) {
      fetchWorkOrderDetail();
    }
  }, [workOrder]);

  const fetchWorkOrderDetail = async () => {
    try {
      setIsLoading(true);
      const data = await technicianAPI.getWorkOrderDetail(workOrder.workOrderId);
      setDetail(data);
      setNotes(data.technician_notes || '');
      
      // Generate tasks from SERVICE items only
      const serviceItems = data.WorkOrderItems?.filter(item => item.item_type === 'SERVICE') || [];
      const generatedTasks = serviceItems.map((item, index) => ({
        id: index + 1,
        text: item.service.name || `Service #${item.item_id}`,
        checked: false
      }));
      const parts = data.WorkOrderItems?.filter(item => item.item_type === 'PART').map((item, index) => ({
        id: index + 1,
        name: item.part.name || `Part #${item.item_id}`,
        quantity: `x${item.quantity} ${item.part.unit || ''}`
      })) || [];

      setTasks(generatedTasks);
      setParts(parts);
    } catch (err) {
      console.error('Error fetching work order detail:', err);
      alert('Failed to load work order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskToggle = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, checked: !task.checked } : task
    ));
  };

  const handleSaveNotes = async () => {
    if (!workOrder?.workOrderId) return;
    
    try {
      setIsSavingNotes(true);
      await technicianAPI.updateTechnicianNotes(workOrder.workOrderId, notes);
      alert('Notes saved successfully!');
    } catch (err) {
      console.error('Error saving notes:', err);
      alert('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!workOrder?.workOrderId) return;
    
    try {
      setIsUpdatingStatus(true);
      await technicianAPI.updateWorkOrderStatus(workOrder.workOrderId, newStatus);
      alert(`Work order status updated to ${newStatus}`);
      onStatusChange?.(newStatus);
      onBack?.();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={onBack}>
            <FaArrowLeft />
          </BackButton>
          <HeaderContent>
            <WorkOrderId>Loading...</WorkOrderId>
          </HeaderContent>
        </Header>
        <Content>
          <Section>
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Loading work order details...
            </div>
          </Section>
        </Content>
      </Container>
    );
  }

  if (!detail) {
    return (
      <Container>
        <Header>
          <BackButton onClick={onBack}>
            <FaArrowLeft />
          </BackButton>
          <HeaderContent>
            <WorkOrderId>Error</WorkOrderId>
          </HeaderContent>
        </Header>
        <Content>
          <Section>
            <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
              Failed to load work order details
            </div>
          </Section>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          <FaArrowLeft />
        </BackButton>
        <HeaderContent>
          <WorkOrderId>WO-{detail.id}</WorkOrderId>
          <StatusBadge $status={detail.status}>
            {detail.status}
          </StatusBadge>
        </HeaderContent>
      </Header>

      <Content>
        {/* Vehicle Information */}
        <Section>
          <SectionHeader>
            <SectionIcon><FaCar /></SectionIcon>
            <SectionTitle>Vehicle Information</SectionTitle>
          </SectionHeader>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>License Plate</InfoLabel>
              <InfoValue $highlight>{detail.Vehicle?.license_plate || 'N/A'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Vehicle</InfoLabel>
              <InfoValue>{`${detail.Vehicle?.make || ''} ${detail.Vehicle?.model || ''}`.trim() || 'N/A'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Year</InfoLabel>
              <InfoValue>{detail.Vehicle?.year || 'N/A'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Color</InfoLabel>
              <InfoValue>{detail.Vehicle?.color || 'N/A'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Mileage</InfoLabel>
              <InfoValue>{detail.Vehicle?.mileage ? `${detail.Vehicle.mileage.toLocaleString()} km` : 'N/A'}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>

        {/* Customer Information */}
        <Section>
          <SectionHeader>
            <SectionIcon><FaUser /></SectionIcon>
            <SectionTitle>Customer Information</SectionTitle>
          </SectionHeader>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Name</InfoLabel>
              <InfoValue>{detail.Vehicle?.Customer?.name || 'N/A'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Phone</InfoLabel>
              <InfoValue $highlight>{detail.Vehicle?.Customer?.phone || 'N/A'}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>

        {/* Action Buttons */}
        <Section>
          <ActionButtons>
            {detail.status === 'OPEN' ? (
              <>
                <ActionButton 
                  $variant="start"
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                  disabled={isUpdatingStatus}
                  style={{ gridColumn: '1 / -1', background: '#10b981', color: 'white' }}
                >
                  <FaCheckCircle />
                  {isUpdatingStatus ? 'Starting...' : 'Start Work Order'}
                </ActionButton>
              </>
            ) : (
              <>
                <ActionButton 
                  $variant="waiting"
                  onClick={() => handleStatusChange('WAITING_PARTS')}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? 'Updating...' : 'Waiting for Parts'}
                </ActionButton>
                <ActionButton 
                  $variant="done"
                  onClick={() => handleStatusChange('COMPLETED')}
                  disabled={isUpdatingStatus}
                >
                  <FaCheckCircle />
                  {isUpdatingStatus ? 'Updating...' : 'Mark as Done'}
                </ActionButton>
              </>
            )}
          </ActionButtons>
        </Section>

        {/* Tasks */}
        <Section>
          <SectionHeader>
            <SectionIcon><FaCheckCircle /></SectionIcon>
            <SectionTitle>Tasks</SectionTitle>
          </SectionHeader>
          <TasksList>
            {tasks.map(task => (
              <TaskItem key={task.id}>
                <Checkbox
                  checked={task.checked}
                  onChange={() => handleTaskToggle(task.id)}
                />
                <TaskText $checked={task.checked}>{task.text}</TaskText>
              </TaskItem>
            ))}
          </TasksList>
        </Section>

        {/* Parts Used */}
        <Section>
          <SectionHeader>
            <SectionIcon><FaCar /></SectionIcon>
            <SectionTitle>Parts Used</SectionTitle>
          </SectionHeader>
          <PartsList>
            {parts.length > 0 ? (
              parts.map(part => (
                <PartItem key={part.id}>
                  <PartName>{part.name}</PartName>
                  <PartQuantity>{part.quantity}</PartQuantity>
                </PartItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                No parts assigned
              </div>
            )}
          </PartsList>
        </Section>

        {/* Technician Notes */}
        <Section>
          <SectionHeader>
            <SectionIcon><FaSave /></SectionIcon>
            <SectionTitle>Technician Notes</SectionTitle>
          </SectionHeader>
          <NotesTextarea
            placeholder="Add your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <SaveNotesButton onClick={handleSaveNotes} disabled={isSavingNotes}>
            <FaSave />
            {isSavingNotes ? 'Saving...' : 'Save Notes'}
          </SaveNotesButton>
        </Section>
      </Content>
    </Container>
  );
};

export default TechnicianWorkOrderDetail;
