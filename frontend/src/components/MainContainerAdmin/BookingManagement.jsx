import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEye, FaWrench, FaTrash, FaCalendar, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import BookingDetailModal from '../Booking/BookingDetailModal';
import CreateWorkOrderModal from '../Booking/CreateWorkOrderModal';
import * as bookingsApi from '../../api/bookingsApi';
import api from '../../api/api';

const PageContainer = styled.div`
  margin: 30px 280px;
  padding: 30px;
  min-height: 100vh;
  background-color: #f9f9f9;
  box-sizing: border-box;

  @media (max-width: 1300px) {
    margin: 20px;
    padding: 20px;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatInfo = styled.div``;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #333;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background-color: ${props => props.bgColor || '#e3f2fd'};
  color: ${props => props.color || '#2196f3'};
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const SearchBar = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
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
      case 'CONFIRMED': return '#d4edda';
      case 'PENDING': return '#fff3cd';
      case 'CANCELLED': return '#f8d7da';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'CONFIRMED': return '#155724';
      case 'PENDING': return '#856404';
      case 'CANCELLED': return '#721c24';
      default: return '#333';
    }
  }};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: ${props => props.color || '#2563eb'};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  span {
    font-size: 11px;
    font-weight: 600;
  }
`;

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateWOModal, setShowCreateWOModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load bookings from API
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsApi.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.Customer?.name || '';
    const licensePlate = booking.Vehicle?.license_plate || '';
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCreateWorkOrder = (booking) => {
    setSelectedBooking(booking);
    setShowCreateWOModal(true);
  };

  const handleConfirmCreateWorkOrder = async () => {
    if (!selectedBooking) return;
    
    try {
      // Call API to create work order from booking
      await api.post('/work-orders/from-booking', {
        booking_id: selectedBooking.id
      });
      
      alert(`Work order created successfully for booking #${selectedBooking.id}`);
      setShowCreateWOModal(false);
      setShowDetailModal(false);
      loadBookings(); // Reload to get updated data
    } catch (err) {
      console.error('Error creating work order:', err);
      alert('Failed to create work order. Please try again.');
    }
  };

  const handleConfirm = async (booking) => {
    if (window.confirm(`Confirm booking #${booking.id}?`)) {
      try {
        await bookingsApi.confirmBooking(booking.id);
        alert('Booking confirmed successfully');
        loadBookings(); // Reload bookings
      } catch (err) {
        console.error('Error confirming booking:', err);
        alert('Failed to confirm booking. Please try again.');
      }
    }
  };

  const handleCancel = async (booking) => {
    if (window.confirm(`Cancel booking #${booking.id}?`)) {
      try {
        await bookingsApi.cancelBooking(booking.id);
        alert('Booking cancelled successfully');
        loadBookings(); // Reload bookings
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleConfirmBookingFromModal = async () => {
    if (!selectedBooking) return;
    
    if (window.confirm(`Confirm booking #${selectedBooking.id}?`)) {
      try {
        await bookingsApi.confirmBooking(selectedBooking.id);
        alert('Booking confirmed successfully');
        setShowDetailModal(false);
        loadBookings(); // Reload bookings
      } catch (err) {
        console.error('Error confirming booking:', err);
        alert('Failed to confirm booking. Please try again.');
      }
    }
  };

  const handleCancelBookingFromModal = async () => {
    if (!selectedBooking) return;
    
    if (window.confirm(`Cancel booking #${selectedBooking.id}?`)) {
      try {
        await bookingsApi.cancelBooking(selectedBooking.id);
        alert('Booking cancelled successfully');
        setShowDetailModal(false);
        loadBookings(); // Reload bookings
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return <FaCheckCircle />;
      case 'PENDING': return <FaClock />;
      case 'CANCELLED': return <FaTimesCircle />;
      default: return null;
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Booking Management</Title>
        <Subtitle>Manage service bookings and create work orders</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatInfo>
            <StatLabel>Total Bookings</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatInfo>
          <StatIcon bgColor="#e3f2fd" color="#2196f3">
            <FaCalendar />
          </StatIcon>
        </StatCard>

        <StatCard>
          <StatInfo>
            <StatLabel>Confirmed</StatLabel>
            <StatValue>{stats.confirmed}</StatValue>
          </StatInfo>
          <StatIcon bgColor="#d4edda" color="#28a745">
            <FaCheckCircle />
          </StatIcon>
        </StatCard>

        <StatCard>
          <StatInfo>
            <StatLabel>Pending</StatLabel>
            <StatValue>{stats.pending}</StatValue>
          </StatInfo>
          <StatIcon bgColor="#fff3cd" color="#ffc107">
            <FaClock />
          </StatIcon>
        </StatCard>

        <StatCard>
          <StatInfo>
            <StatLabel>Cancelled</StatLabel>
            <StatValue>{stats.cancelled}</StatValue>
          </StatInfo>
          <StatIcon bgColor="#f8d7da" color="#dc3545">
            <FaTimesCircle />
          </StatIcon>
        </StatCard>
      </StatsGrid>

      <Controls>
        <SearchBar>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by customer name or license plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All Status</option>
          <option>CONFIRMED</option>
          <option>PENDING</option>
          <option>CANCELLED</option>
        </FilterSelect>
      </Controls>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          Loading bookings...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#dc3545' }}>
          {error}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          No bookings found
        </div>
      ) : (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Booking ID</Th>
                <Th>Customer</Th>
                <Th>Vehicle</Th>
                <Th>Scheduled At</Th>
                <Th>Status</Th>
                <Th>Notes</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBookings.map(booking => (
                <Tr key={booking.id}>
                  <Td>#{booking.id}</Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{booking.Customer?.name || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{booking.Customer?.phone || 'N/A'}</div>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{booking.Vehicle?.license_plate || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {booking.Vehicle?.year} {booking.Vehicle?.make} {booking.Vehicle?.model}
                    </div>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{formatDate(booking.scheduled_at)}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{formatTime(booking.scheduled_at)}</div>
                  </Td>
                  <Td>
                    <StatusBadge status={booking.status}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </StatusBadge>
                  </Td>
                  <Td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {booking.notes || '-'}
                  </Td>
                  <Td>
                    <Actions>
                      <ActionButton color="#2563eb" onClick={() => handleView(booking)}>
                        <FaEye />
                        <span>View</span>
                      </ActionButton>
                      {booking.status === 'PENDING' && (
                        <ActionButton color="#10b981" onClick={() => handleConfirm(booking)}>
                          <FaCheckCircle />
                          <span>Confirm</span>
                        </ActionButton>
                      )}
                      {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                        <ActionButton color="#f59e0b" onClick={() => handleCreateWorkOrder(booking)}>
                          <FaWrench />
                          <span>Work Order</span>
                        </ActionButton>
                      )}
                      {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                        <ActionButton color="#ef4444" onClick={() => handleCancel(booking)}>
                          <FaTrash />
                          <span>Cancel</span>
                        </ActionButton>
                      )}
                    </Actions>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {showDetailModal && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setShowDetailModal(false)}
          onCreateWorkOrder={() => {
            setShowDetailModal(false);
            setShowCreateWOModal(true);
          }}
          onConfirmBooking={handleConfirmBookingFromModal}
          onCancelBooking={handleCancelBookingFromModal}
        />
      )}

      {showCreateWOModal && (
        <CreateWorkOrderModal
          booking={selectedBooking}
          onClose={() => setShowCreateWOModal(false)}
          onConfirm={handleConfirmCreateWorkOrder}
          onCreateWorkOrder={() => {
            setShowDetailModal(false);
            setShowCreateWOModal(true);
          }}
          onCancelBooking={() => {
            handleCancel(selectedBooking);
            setShowDetailModal(false);
          }}
        />
      )}

      {showCreateWOModal && (
        <CreateWorkOrderModal
          booking={selectedBooking}
          onClose={() => setShowCreateWOModal(false)}
          onConfirm={() => {
            alert('Work order created (static demo)');
            setShowCreateWOModal(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default BookingManagement;
