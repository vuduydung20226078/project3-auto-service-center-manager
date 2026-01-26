import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaDollarSign, FaCheckCircle, FaClock } from 'react-icons/fa';
import { invoicesApi } from '../../api/invoicesApi';
import InvoiceDetailModal from '../Invoice/InvoiceDetailModal';
import SelectWorkOrderModal from '../Invoice/SelectWorkOrderModal';
import CreateInvoiceModal from '../Invoice/CreateInvoiceModal';
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 2px solid #e0e0e0;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background-color: ${props => props.$bgColor || '#e3f2fd'};
  color: ${props => props.$color || '#1976d2'};
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: #f8f9fa;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status) {
      case 'PAID': return '#d4edda';
      case 'PARTIALLY_PAID': return '#fff3cd';
      case 'UNPAID': return '#f8d7da';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'PAID': return '#155724';
      case 'PARTIALLY_PAID': return '#856404';
      case 'UNPAID': return '#721c24';
      default: return '#333';
    }
  }};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  background-color: ${props => props.variant === 'view' ? '#e3f2fd' : props.variant === 'edit' ? '#fff3cd' : '#ffebee'};
  color: ${props => props.variant === 'view' ? '#1976d2' : props.variant === 'edit' ? '#f57c00' : '#c62828'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 15px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 15px;
`;

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSelectWorkOrderModal, setShowSelectWorkOrderModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    totalRevenue: 0,
    paid: 0,
    unpaid: 0
  });

  useEffect(() => {
    loadInvoices();
  }, [statusFilter]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await invoicesApi.getAll(params);
      const invoiceData = response.data || [];
      setInvoices(invoiceData);
      calculateStats(invoiceData);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkOrder = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setShowSelectWorkOrderModal(false);
    setShowCreateInvoiceModal(true);
  };

  const handleInvoiceSuccess = (invoice, workOrderDetails) => {
    setShowCreateInvoiceModal(false);
    loadInvoices();
    // Navigate to payment page
    navigate('/payment', { state: { invoice, workOrderDetails } });
  };

  const calculateStats = (data) => {
    if (!Array.isArray(data)) {
      data = [];
    }
    const total = data.length;
    const totalRevenue = data.reduce((sum, inv) => sum + parseFloat(inv.amount_due || 0), 0);
    const paid = data.filter(inv => inv.status === 'PAID').length;
    const unpaid = data.filter(inv => inv.status === 'UNPAID').length;
    
    setStats({ total, totalRevenue, paid, unpaid });
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const handleDeleteInvoice = async (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoice_no}?`)) {
      try {
        await invoicesApi.delete(invoice.id);
        toast.success('Invoice deleted successfully');
        loadInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        toast.error('Failed to delete invoice');
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const query = searchQuery.toLowerCase();
    return (
      invoice.invoice_no?.toLowerCase().includes(query) ||
      invoice.WorkOrder?.Vehicle?.license_plate?.toLowerCase().includes(query)
    );
  });

  const formatCurrency = (amount) => {
    return `${parseFloat(amount || 0).toFixed(0)} VND`;
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
    <PageContainer>
      <Header>
        <Title>Invoice Management</Title>
        <Subtitle>Manage and track all invoices</Subtitle>
      </Header>

      <ContentWrapper>
        <StatsGrid>
          <StatCard>
            <StatIcon $bgColor="#e3f2fd" $color="#1976d2">
              <FaFileInvoiceDollar />
            </StatIcon>
            <StatInfo>
              <StatLabel>Total Invoices</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon $bgColor="#e8f5e9" $color="#2e7d32">
              <FaDollarSign />
            </StatIcon>
            <StatInfo>
              <StatLabel>Total Revenue</StatLabel>
              <StatValue>{formatCurrency(stats.totalRevenue)}</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon $bgColor="#d4edda" $color="#155724">
              <FaCheckCircle />
            </StatIcon>
            <StatInfo>
              <StatLabel>Paid</StatLabel>
              <StatValue>{stats.paid}</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon $bgColor="#f8d7da" $color="#721c24">
              <FaClock />
            </StatIcon>
            <StatInfo>
              <StatLabel>Unpaid</StatLabel>
              <StatValue>{stats.unpaid}</StatValue>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        <Controls>
          <SearchBar>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search by invoice number or license plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="UNPAID">Unpaid</option>
          </FilterSelect>
          <AddButton onClick={() => setShowSelectWorkOrderModal(true)}>
            <FaPlus /> New Invoice
          </AddButton>
        </Controls>

        {loading ? (
          <LoadingState>Loading invoices...</LoadingState>
        ) : filteredInvoices.length > 0 ? (
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Invoice No</Th>
                  <Th>Work Order</Th>
                  <Th>Vehicle</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredInvoices.map((invoice) => (
                  <Tr key={invoice.id}>
                    <Td>{invoice.invoice_no}</Td>
                    <Td>WO-{invoice.work_order_id}</Td>
                    <Td>{invoice.WorkOrder?.Vehicle?.license_plate || '-'}</Td>
                    <Td>{formatCurrency(invoice.amount_due)}</Td>
                    <Td>
                      <StatusBadge status={invoice.status}>
                        {invoice.status.replace('_', ' ')}
                      </StatusBadge>
                    </Td>
                    <Td>{formatDate(invoice.created_at)}</Td>
                    <Td>
                      <Actions>
                        <ActionButton variant="view" onClick={() => handleViewInvoice(invoice)}>
                          <FaEye /> View
                        </ActionButton>
                        <ActionButton variant="delete" onClick={() => handleDeleteInvoice(invoice)}>
                          <FaTrash /> Delete
                        </ActionButton>
                      </Actions>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState>No invoices found</EmptyState>
        )}
      </ContentWrapper>

      {showDetailModal && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInvoice(null);
          }}
          onUpdate={loadInvoices}
        />
      )}

      {showSelectWorkOrderModal && (
        <SelectWorkOrderModal
          onClose={() => setShowSelectWorkOrderModal(false)}
          onSelect={handleSelectWorkOrder}
        />
      )}

      {showCreateInvoiceModal && selectedWorkOrder && (
        <CreateInvoiceModal
          workOrder={selectedWorkOrder}
          onClose={() => {
            setShowCreateInvoiceModal(false);
            setSelectedWorkOrder(null);
          }}
          onSuccess={handleInvoiceSuccess}
        />
      )}
    </PageContainer>
  );
};

export default InvoiceManagement;
