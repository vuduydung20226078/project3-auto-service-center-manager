import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';
import WorkOrderCard from './WorkOrderCard';
import technicianAPI from '../../api/technicianAPI';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 20px;
`;

const Header = styled.div`
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const DateText = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const UserBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
  border-radius: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px 20px 0;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 2px solid ${props => {
    if (props.$type === 'total') return props.$active ? '#667eea' : '#c7d2fe';
    if (props.$type === 'inProgress') return props.$active ? '#3b82f6' : '#bfdbfe';
    if (props.$type === 'done') return props.$active ? '#10b981' : '#a7f3d0';
    return '#e5e7eb';
  }};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => {
      if (props.$type === 'total') return '#667eea';
      if (props.$type === 'inProgress') return '#3b82f6';
      if (props.$type === 'done') return '#10b981';
      return '#667eea';
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 20px 0;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${props => props.$active ? '#667eea' : 'white'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#5568d3' : '#f3f4f6'};
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const WorkOrdersList = styled.div`
  padding: 16px 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 15px;
`;

const TechnicianWorkOrders = ({ user, onLogout, onSelectWorkOrder }) => {
  const [activeTab, setActiveTab] = useState('Today');
  const [activeFilter, setActiveFilter] = useState('all');
  const [workOrders, setWorkOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkOrders();
    fetchStats();
  }, [activeTab]);

  const fetchWorkOrders = async () => {
    try {
      setIsLoading(true);
      let params = {};
      
      if (activeTab === 'Today') {
        // Get local date (YYYY-MM-DD) to avoid timezone issues
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        params.date = `${year}-${month}-${day}`;
      } else if (activeTab === 'In Progress') {
        params.status = 'IN_PROGRESS';
      } else if (activeTab === 'Done') {
        params.status = 'COMPLETED';
      }

      const data = await technicianAPI.getWorkOrders(params);
      
      // Transform data to match component format
      const transformedData = data.map(wo => ({
        id: `WO-${wo.id}`,
        workOrderId: wo.id,
        licensePlate: wo.Vehicle?.license_plate || 'N/A',
        customerName: wo.Vehicle?.Customer?.name || 'N/A',
        vehicleModel: `${wo.Vehicle?.make || ''} ${wo.Vehicle?.model || ''}`.trim() || 'N/A',
        status: wo.status,
        start_time: wo.start_time,
        tab: wo.status === 'COMPLETED' ? 'Done' : 'Today'
      }));

      setWorkOrders(transformedData);
      setError('');
    } catch (err) {
      setError('Failed to load work orders');
      console.error('Error fetching work orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await technicianAPI.getStats();
      setStats({
        total: statsData.total,
        inProgress: statsData.inProgress,
        completed: statsData.completed
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const filteredWorkOrders = workOrders.filter(wo => {
    if (activeTab === 'Today') {
      return wo.tab === 'Today';
    } else if (activeTab === 'In Progress') {
      return wo.status === 'IN_PROGRESS';
    } else if (activeTab === 'Done') {
      return wo.status === 'COMPLETED';
    }
    return true;
  });

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Container>
      <Header>
        <HeaderTop>
          <div>
            <Title>My Work Orders</Title>
            <DateText>{formatDate()}</DateText>
          </div>
          <LogoutButton onClick={onLogout}>
            <FaSignOutAlt />
          </LogoutButton>
        </HeaderTop>
        
        <UserBanner>
          Hello, {user?.username || user?.email || 'Technician'}
        </UserBanner>
      </Header>

      <StatsContainer>
        <StatCard $type="total" $active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total</StatLabel>
        </StatCard>
        <StatCard $type="inProgress" $active={activeFilter === 'inProgress'} onClick={() => setActiveFilter('inProgress')}>
          <StatValue>{stats.inProgress}</StatValue>
          <StatLabel>In Progress</StatLabel>
        </StatCard>
        <StatCard $type="done" $active={activeFilter === 'done'} onClick={() => setActiveFilter('done')}>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Done</StatLabel>
        </StatCard>
      </StatsContainer>

      <TabsContainer>
        <Tab $active={activeTab === 'Today'} onClick={() => setActiveTab('Today')}>
          Today
        </Tab>
        <Tab $active={activeTab === 'In Progress'} onClick={() => setActiveTab('In Progress')}>
          In Progress
        </Tab>
        <Tab $active={activeTab === 'Done'} onClick={() => setActiveTab('Done')}>
          Done
        </Tab>
      </TabsContainer>

      <WorkOrdersList>
        {isLoading ? (
          <EmptyState>Loading...</EmptyState>
        ) : error ? (
          <EmptyState style={{ color: '#ef4444' }}>{error}</EmptyState>
        ) : filteredWorkOrders.length > 0 ? (
          filteredWorkOrders.map(wo => (
            <WorkOrderCard 
              key={wo.id} 
              workOrder={wo}
              onClick={onSelectWorkOrder}
            />
          ))
        ) : (
          <EmptyState>No work orders found</EmptyState>
        )}
      </WorkOrdersList>
    </Container>
  );
};

export default TechnicianWorkOrders;
