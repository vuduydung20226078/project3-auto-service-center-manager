import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaWrench, FaClipboardList, FaDollarSign, FaPlus, FaSearch } from 'react-icons/fa';
import StatCard from '../common/StatCard';
import { workOrdersApi } from '../../api/workOrdersApi';
import WorkOrderForm from '../WorkOrder/WorkOrderForm';
import WorkOrderDetail from '../WorkOrder/WorkOrderDetail';

const Container = styled.div`
  margin-left: 280px;
  padding: 30px;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const ContentWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ActionsBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const SearchBox = styled.div`
  flex: 1;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4c00b4;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const StatusSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4c00b4;
  }
`;

const NewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #e9ecef;
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e9ecef;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
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

const PriorityBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    switch(props.$priority) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#388e3c';
      default: return '#666';
    }
  }};
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  background: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #999;
`;

const WorkOrderManagement = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [stats, setStats] = useState({
    activeOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const [ordersData, statsData] = await Promise.all([
        workOrdersApi.getAll(params),
        workOrdersApi.getStats()
      ]);
      setWorkOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setShowDetail(true);
  };

  const handleEdit = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setShowForm(true);
  };

  const handleComplete = async (workOrder) => {
    if (window.confirm('Mark this work order as completed?')) {
      try {
        await workOrdersApi.updateStatus(workOrder.id, 'COMPLETED');
        fetchData();
      } catch (error) {
        alert('Error updating status');
      }
    }
  };

  const handleStart = async (workOrder) => {
    try {
      await workOrdersApi.updateStatus(workOrder.id, 'IN_PROGRESS');
      fetchData();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const filteredOrders = workOrders.filter(wo => {
    const query = searchQuery.toLowerCase();
    return (
      wo.id?.toString().includes(query) ||
      wo.customer?.toLowerCase().includes(query) ||
      wo.vehicle?.toLowerCase().includes(query)
    );
  });

  return (
    <Container>
      <Header>
        <Title>Work Order Management</Title>
        <Subtitle>Track and manage service work orders</Subtitle>
      </Header>

      <ContentWrapper>
        <StatsGrid>
        <StatCard
          label="Active Orders"
          value={stats.activeOrders}
          icon={<FaWrench />}
          bgColor="#e3f2fd"
          borderColor="#2563eb"
          valueColor="#2563eb"
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon={<FaClipboardList />}
          bgColor="#fff3e0"
          borderColor="#f59e0b"
          valueColor="#f59e0b"
        />
        <StatCard
          label="Total Revenue"
          value={`${Number(stats.totalRevenue || 0).toFixed(0)} VND`}
          icon={<FaDollarSign />}
          bgColor="#e8f5e9"
          borderColor="#10b981"
          valueColor="#10b981"
        />
      </StatsGrid>

      <ActionsBar>
        <SearchBox>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search by order #, customer, or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
        <StatusSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="WAITING_PARTS">Waiting Parts</option>
          <option value="COMPLETED">Completed</option>
        </StatusSelect>
        <NewButton onClick={() => setShowForm(true)}>
          <FaPlus /> New Work Order
        </NewButton>
      </ActionsBar>

      <TableContainer>
        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : filteredOrders.length === 0 ? (
          <EmptyState>No work orders found</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order #</Th>
                <Th>Customer</Th>
                <Th>Vehicle</Th>
                <Th>Technician</Th>
                <Th>Created Date</Th>
                <Th>Est. Cost</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((wo) => (
                <tr key={wo.id}>
                  <Td>#{wo.id}</Td>
                  <Td>{wo.customer || 'N/A'}</Td>
                  <Td>{wo.vehicle || 'N/A'}</Td>
                  <Td>{wo.technician || 'Unassigned'}</Td>
                  <Td>
                    {wo.created_at 
                      ? new Date(wo.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        })
                      : 'N/A'}
                  </Td>
                  <Td>{parseFloat(wo.total_amount || 0).toFixed(0)} VND</Td>
                  <Td>
                    <StatusBadge $status={wo.status?.toLowerCase().replace('_', '-')}>
                      {wo.status?.replace('_', ' ')}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <ActionButton onClick={() => handleView(wo)}>View</ActionButton>
                    <ActionButton onClick={() => handleEdit(wo)}>Edit</ActionButton>
                    {wo.status === 'OPEN' && (
                      <ActionButton onClick={() => handleStart(wo)}>Start</ActionButton>
                    )}
                    {wo.status === 'IN_PROGRESS' && (
                      <ActionButton onClick={() => handleComplete(wo)}>Complete</ActionButton>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>

      {showForm && (
        <WorkOrderForm
          workOrder={selectedWorkOrder}
          onClose={() => {
            setShowForm(false);
            setSelectedWorkOrder(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedWorkOrder(null);
            fetchData();
          }}
        />
      )}

      {showDetail && (
        <WorkOrderDetail
          workOrder={selectedWorkOrder}
          onClose={() => {
            setShowDetail(false);
            setSelectedWorkOrder(null);
          }}
          onRefresh={fetchData}
        />
      )}
      </ContentWrapper>
    </Container>
  );
};

export default WorkOrderManagement;
