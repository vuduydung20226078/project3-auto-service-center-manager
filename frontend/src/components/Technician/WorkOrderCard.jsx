import React from 'react';
import styled from 'styled-components';
import { FaClock, FaCircle } from 'react-icons/fa';

const Card = styled.div`
  background: ${props => {
    switch(props.$status) {
      case 'WORKING': return 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)';
      case 'WAITING': return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      case 'NEW': return 'white';
      case 'DONE': return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
      default: return 'white';
    }
  }};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid ${props => {
    switch(props.$status) {
      case 'WORKING': return '#3b82f6';
      case 'WAITING': return '#f59e0b';
      case 'NEW': return '#6b7280';
      case 'DONE': return '#10b981';
      default: return '#e5e7eb';
    }
  }};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const WorkOrderId = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => {
    switch(props.$status) {
      case 'WORKING': return '#dbeafe';
      case 'WAITING': return '#fef3c7';
      case 'NEW': return '#f3f4f6';
      case 'DONE': return '#d1fae5';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'WORKING': return '#1e40af';
      case 'WAITING': return '#92400e';
      case 'NEW': return '#374151';
      case 'DONE': return '#065f46';
      default: return '#6b7280';
    }
  }};
`;

const StatusDot = styled(FaCircle)`
  font-size: 8px;
`;

const LicensePlate = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const CustomerName = styled.div`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 2px;
`;

const VehicleModel = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
`;

const TimeIcon = styled(FaClock)`
  font-size: 14px;
`;

const WorkOrderCard = ({ workOrder, onClick }) => {
  const getStatusLabel = (status) => {
    const labels = {
      'WORKING': 'WORKING',
      'WAITING': 'WAITING',
      'NEW': 'NEW',
      'DONE': 'DONE'
    };
    return labels[status] || status;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  return (
    <Card $status={workOrder.status} onClick={() => onClick?.(workOrder)}>
      <Header>
        <WorkOrderId>{workOrder.id}</WorkOrderId>
        <StatusBadge $status={workOrder.status}>
          <StatusDot />
          {getStatusLabel(workOrder.status)}
        </StatusBadge>
      </Header>

      <LicensePlate>{workOrder.licensePlate}</LicensePlate>
      <CustomerName>{workOrder.customerName}</CustomerName>
      <VehicleModel>{workOrder.vehicleModel}</VehicleModel>

      <TimeInfo>
        <TimeIcon />
        {workOrder.timeType === 'Started' && `Started: ${formatTime(workOrder.time)}`}
        {workOrder.timeType === 'Scheduled' && `Scheduled: ${formatTime(workOrder.time)}`}
      </TimeInfo>
    </Card>
  );
};

export default WorkOrderCard;
