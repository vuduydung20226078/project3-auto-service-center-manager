import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaBoxOpen, 
  FaExclamationTriangle, 
  FaDollarSign, 
  FaTools,
  FaFileInvoiceDollar,
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import Card from '../common/Card';
import StatCard from '../common/StatCard';
import { dashboardApi } from '../../api/dashboardApi';

const PageContainer = styled.div`
  /* Keep equal space on both sides to balance with the left sidebar */
  margin: 30px 280px;
  padding: 30px;
  min-height: 100vh;
  width: calc(100% - 560px);
  background-color: #f9f9f9;
  box-sizing: border-box;
  align-items: center;
  padding-left: 100px;
`;

const Header = styled.div`
  margin-bottom: 30px;
 
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    background-color: #f5f5f5;
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #666;
    border-bottom: 2px solid #e0e0e0;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${props => {
    if (props.$type === 'IN') return '#e8f5e9';
    if (props.$type === 'OUT') return '#ffebee';
    return '#f5f5f5';
  }};
  color: ${props => {
    if (props.$type === 'IN') return '#0f8419';
    if (props.$type === 'OUT') return '#c5192d';
    return '#666';
  }};
`;

const QtyBadge = styled.span`
  font-weight: 700;
  color: ${props => {
    if (props.$qty === 0) return '#c5192d';
    if (props.$qty <= 5) return '#f57c00';
    return '#0f8419';
  }};
`;

const LoadingMsg = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

const ErrorMsg = styled.div`
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  color: #c5192d;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [stockStats, setStockStats] = useState(null);
  const [stockMovement, setStockMovement] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryData, stockStatsData, movementData, lowStockData, entriesData] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getStockStats(),
        dashboardApi.getStockMovement(),
        dashboardApi.getTopLowStock(10),
        dashboardApi.getRecentEntries(10)
      ]);

      setSummary(summaryData);
      setStockStats(stockStatsData);
      setStockMovement(processMovementData(movementData));
      setLowStock(lowStockData);
      setRecentEntries(entriesData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processMovementData = (data) => {
    // Group by date and aggregate IN/OUT
    const grouped = {};
    data.forEach(item => {
      const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!grouped[date]) {
        grouped[date] = { date, IN: 0, OUT: 0 };
      }
      grouped[date][item.type] = parseInt(item.quantity);
    });
    return Object.values(grouped).reverse();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Overview of your auto service center</Subtitle>
        </Header>
        <LoadingMsg>Loading dashboard...</LoadingMsg>
      </PageContainer>
    );
  }

  return (
    
    <PageContainer>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Overview of your auto service center</Subtitle>
      </Header>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <StatsGrid>
        <StatCard
          label="Revenue Today"
          value={formatCurrency(summary?.revenue_today || 0)}
          icon={<FaDollarSign />}
          bgColor="#e8f5e9"
          borderColor="#0f8419"
          valueColor="#0f8419"
          valueSize="24px"
        />
        <StatCard
          label="Revenue This Month"
          value={formatCurrency(summary?.revenue_month || 0)}
          icon={<FaDollarSign />}
          bgColor="#e3f2fd"
          borderColor="#1976d2"
          valueColor="#1976d2"
          valueSize="24px"
        />
        <StatCard
          label="Open Work Orders"
          value={summary?.work_orders_open || 0}
          icon={<FaTools />}
          bgColor="#fff3e0"
          borderColor="#f57c00"
          valueColor="#f57c00"
        />
        <StatCard
          label="Unpaid Invoices"
          value={summary?.invoices_unpaid || 0}
          icon={<FaFileInvoiceDollar />}
          bgColor="#ffebee"
          borderColor="#c5192d"
          valueColor="#c5192d"
        />
      </StatsGrid>

      <StatsGrid>
        <StatCard
          label="Total Parts"
          value={stockStats?.total_parts || 0}
          icon={<FaBoxOpen />}
          bgColor="#f3e5f5"
          borderColor="#7b1fa2"
          valueColor="#7b1fa2"
        />
        <StatCard
          label="Total Quantity"
          value={stockStats?.total_quantity || 0}
          icon={<FaChartLine />}
          bgColor="#e0f2f1"
          borderColor="#00796b"
          valueColor="#00796b"
        />
        <StatCard
          label="Low Stock Items"
          value={stockStats?.low_stock || 0}
          icon={<FaExclamationTriangle />}
          bgColor="#fff3e0"
          borderColor="#f57c00"
          valueColor="#f57c00"
        />
        <StatCard
          label="Out of Stock"
          value={stockStats?.out_of_stock || 0}
          icon={<FaExclamationTriangle />}
          bgColor="#ffebee"
          borderColor="#c5192d"
          valueColor="#c5192d"
        />
      </StatsGrid>

      <ChartsGrid>
        <Card title="Stock Movement (Last 7 Days)" subtitle="IN vs OUT transactions">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockMovement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="IN" fill="#0f8419" name="Stock IN" />
              <Bar dataKey="OUT" fill="#c5192d" name="Stock OUT" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Low Stock Items" subtitle="Items requiring attention">
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Part Name</th>
                  <th>Location</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#999' }}>
                      No low stock items
                    </td>
                  </tr>
                ) : (
                  lowStock.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sku}</td>
                      <td>{item.name}</td>
                      <td>{item.location}</td>
                      <td>
                        <QtyBadge $qty={item.qty}>{item.qty}</QtyBadge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
      </ChartsGrid>

      <Card title="Recent Stock Entries" subtitle="Latest inventory transactions">
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>SKU</th>
                <th>Part Name</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Reference</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#999' }}>
                    No recent entries
                  </td>
                </tr>
              ) : (
                recentEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{formatDateTime(entry.created_at)}</td>
                    <td>{entry.sku}</td>
                    <td>{entry.part_name}</td>
                    <td>
                      <Badge $type={entry.type}>{entry.type}</Badge>
                    </td>
                    <td>{entry.qty}</td>
                    <td>{entry.ref_type}</td>
                    <td>{entry.created_by || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
