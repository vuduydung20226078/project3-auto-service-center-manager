import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaUser, FaClock, FaCar, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { techniciansApi } from '../../api/techniciansApi';
import toast from '../../utils/toast';

const PageContainer = styled.div`
  margin-left: 280px;
  padding: 30px;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
`;

const ContentWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
`;

const DateRangeGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const DateInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TechnicianGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
  gap: 24px;
`;

const TechnicianCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const TechnicianHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
`;

const TechnicianInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TechnicianAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 700;
`;

const TechnicianDetails = styled.div``;

const TechnicianName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

const TechnicianSpecialty = styled.div`
  font-size: 14px;
  color: #666;
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status?.toLowerCase()) {
      case 'available': return '#e8f5e9';
      case 'busy': return '#fff3e0';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status?.toLowerCase()) {
      case 'available': return '#2e7d32';
      case 'busy': return '#ef6c00';
      default: return '#666';
    }
  }};
`;

const ScheduleTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WorkOrderBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%);
  border-left: 4px solid ${props => {
    switch (props.status?.toLowerCase()) {
      case 'open': return '#2196f3';
      case 'in_progress': return '#ff9800';
      case 'waiting_parts': return '#f44336';
      default: return '#9e9e9e';
    }
  }};
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TimeInfo = styled.div`
  min-width: 120px;
`;

const TimeLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Duration = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const WorkOrderInfo = styled.div`
  flex: 1;
`;

const WorkOrderId = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
`;

const VehicleInfo = styled.div`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  color: #667eea;
  font-size: 18px;
  gap: 12px;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const TechnicianSchedule = () => {
  const [technicians, setTechnicians] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Default to today and next 7 days
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const [fromDate, setFromDate] = useState(today.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(nextWeek.toISOString().split('T')[0]);

  useEffect(() => {
    loadTechnicians();
  }, []);

  useEffect(() => {
    if (technicians.length > 0) {
      loadSchedules();
    }
  }, [fromDate, toDate, technicians]);

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      const data = await techniciansApi.getAll();
      setTechnicians(data || []);
    } catch (err) {
      console.error('Error loading technicians:', err);
      toast.error('Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async () => {
    try {
      const scheduleData = {};
      
      for (const tech of technicians) {
        const schedule = await techniciansApi.getSchedule(tech.id, fromDate, toDate);
        scheduleData[tech.id] = schedule || [];
      }
      
      setSchedules(scheduleData);
    } catch (err) {
      console.error('Error loading schedules:', err);
      toast.error('Failed to load schedules');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const minutes = Math.round((endDate - startDate) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading && technicians.length === 0) {
    return (
      <PageContainer>
        <LoadingState>
          <FaSpinner /> Loading technicians...
        </LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>
          <FaCalendarAlt /> Technician Schedule
        </Title>
        <Subtitle>View and manage technician work schedules</Subtitle>
      </Header>

      <ContentWrapper>
        <Controls>
        <DateRangeGroup>
          <Label>From:</Label>
          <DateInput 
            type="date" 
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </DateRangeGroup>
        
        <DateRangeGroup>
          <Label>To:</Label>
          <DateInput 
            type="date" 
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </DateRangeGroup>
      </Controls>

      <TechnicianGrid>
        {technicians.map(tech => {
          const techSchedule = schedules[tech.id] || [];
          const initials = (tech.User?.full_name || tech.User?.username || 'T')
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <TechnicianCard key={tech.id}>
              <TechnicianHeader>
                <TechnicianInfo>
                  <TechnicianAvatar>{initials}</TechnicianAvatar>
                  <TechnicianDetails>
                    <TechnicianName>
                      {tech.User?.full_name || tech.User?.username || `Technician #${tech.id}`}
                    </TechnicianName>
                    <TechnicianSpecialty>
                      {tech.specialty || 'General Technician'}
                    </TechnicianSpecialty>
                  </TechnicianDetails>
                </TechnicianInfo>
                <StatusBadge status={tech.status}>
                  {tech.status || 'Unknown'}
                </StatusBadge>
              </TechnicianHeader>

              <ScheduleTimeline>
                {techSchedule.length === 0 ? (
                  <EmptyState>
                    <FaCheckCircle style={{ fontSize: '32px', marginBottom: '8px' }} />
                    <div>No work orders scheduled</div>
                  </EmptyState>
                ) : (
                  techSchedule.map(wo => (
                    <WorkOrderBlock key={wo.id} status={wo.status}>
                      <TimeInfo>
                        <TimeLabel>
                          <FaClock />
                          {formatTime(wo.start_time)}
                        </TimeLabel>
                        <Duration>
                          {wo.start_time && wo.end_time 
                            ? calculateDuration(wo.start_time, wo.end_time)
                            : 'N/A'}
                        </Duration>
                      </TimeInfo>
                      
                      <WorkOrderInfo>
                        <WorkOrderId>Work Order #{wo.id}</WorkOrderId>
                        <VehicleInfo>
                          <FaCar />
                          {wo.Vehicle?.license_plate || 'N/A'} - {wo.Vehicle?.make} {wo.Vehicle?.model}
                        </VehicleInfo>
                      </WorkOrderInfo>
                      
                      <StatusBadge status={wo.status}>
                        {wo.status?.replace('_', ' ')}
                      </StatusBadge>
                    </WorkOrderBlock>
                  ))
                )}
              </ScheduleTimeline>
            </TechnicianCard>
          );
        })}
      </TechnicianGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default TechnicianSchedule;
