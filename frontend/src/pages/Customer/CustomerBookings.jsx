import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCar, FaClock, FaPlus } from 'react-icons/fa';
import { getAllBookings } from '../../api/bookingsApi';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
`;

const Header = styled.div`
  background: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`;

const NotificationIcon = styled.button`
  position: relative;
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
  }
`;

const Content = styled.div`
  padding: 0;
`;

const TabsContainer = styled.div`
  background: white;
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button`
  flex: 1;
  padding: 16px;
  background: ${props => props.$active ? '#2563eb' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: ${props => props.$active ? '20px 20px 0 0' : '0'};
  
  &:hover {
    background: ${props => props.$active ? '#2563eb' : '#f3f4f6'};
  }
`;

const BookingsList = styled.div`
  padding: 16px;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const BookingId = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const BookingIdValue = styled.span`
  font-weight: 600;
  color: #333;
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    const status = props.$status?.toUpperCase();
    switch (status) {
      case 'PENDING': return '#fef3c7';
      case 'CONFIRMED': return '#dcfce7';
      case 'IN_PROGRESS':
      case 'IN SERVICE': return '#dbeafe';
      case 'COMPLETED': return '#e0e7ff';
      case 'CANCELLED': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    const status = props.$status?.toUpperCase();
    switch (status) {
      case 'PENDING': return '#d97706';
      case 'CONFIRMED': return '#16a34a';
      case 'IN_PROGRESS':
      case 'IN SERVICE': return '#2563eb';
      case 'COMPLETED': return '#6366f1';
      case 'CANCELLED': return '#ef4444';
      default: return '#666';
    }
  }};
`;

const VehicleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const VehicleIcon = styled.div`
  color: #666;
  font-size: 16px;
`;

const VehicleDetails = styled.div`
  flex: 1;
`;

const VehiclePlate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const VehicleModel = styled.div`
  font-size: 12px;
  color: #666;
`;

const BookingDateTime = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeIcon = styled.div`
  color: #666;
  font-size: 14px;
`;

const DateTime = styled.div`
  font-size: 14px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const NewBookingButton = styled.button`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 100;
  
  &:hover {
    background: #1d4ed8;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const CustomerBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const filterBookings = () => {
    switch (activeTab) {
      case 'Upcoming':
        return bookings.filter(b => {
          return b.status === 'Pending' || b.status === 'PENDING' || b.status === 'Confirmed' || b.status === 'CONFIRMED';
        });
      case 'Completed':
        return bookings.filter(b => b.status === 'Completed' || b.status === 'COMPLETED');
      case 'Cancelled':
        return bookings.filter(b => b.status === 'Cancelled' || b.status === 'CANCELLED');
      default:
        return bookings;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredBookings = filterBookings();

  const handleNewBooking = () => {
    navigate('/customer/bookings/new');
  };

  return (
    <Container>
      <Header>
        <Logo>
          <LogoIcon><FaCar /></LogoIcon>
          AutoCare
        </Logo>
        <NotificationIcon>
          <FaBell />
        </NotificationIcon>
      </Header>

      <Content>
        <TabsContainer>
          <Tab 
            $active={activeTab === 'All'} 
            onClick={() => setActiveTab('All')}
          >
            All
          </Tab>
          <Tab 
            $active={activeTab === 'Upcoming'} 
            onClick={() => setActiveTab('Upcoming')}
          >
            Upcoming
          </Tab>
          <Tab 
            $active={activeTab === 'Completed'} 
            onClick={() => setActiveTab('Completed')}
          >
            Completed
          </Tab>
          <Tab 
            $active={activeTab === 'Cancelled'} 
            onClick={() => setActiveTab('Cancelled')}
          >
            Cancelled
          </Tab>
        </TabsContainer>

        <BookingsList>
          {loading ? (
            <EmptyState>Loading...</EmptyState>
          ) : filteredBookings.length === 0 ? (
            <EmptyState>No bookings found</EmptyState>
          ) : (
            filteredBookings.map(booking => (
              <BookingCard 
                key={booking.booking_id}
                onClick={() => navigate(`/customer/bookings/${booking.id || booking.booking_id}`)}
              >
                <BookingHeader>
                  <div>
                    <BookingId>
                      Booking ID: #
                      <BookingIdValue>{booking.booking_id}</BookingIdValue>
                    </BookingId>
                  </div>
                  <StatusBadge $status={booking.status}>
                    {booking.status}
                  </StatusBadge>
                </BookingHeader>

                <VehicleInfo>
                  <VehicleIcon><FaCar /></VehicleIcon>
                  <VehicleDetails>
                    <VehiclePlate>{booking.vehicle?.license_plate || 'N/A'}</VehiclePlate>
                    <VehicleModel>
                      {booking.vehicle?.make || ''} {booking.vehicle?.model || ''}
                    </VehicleModel>
                  </VehicleDetails>
                </VehicleInfo>

                <BookingDateTime>
                  <TimeIcon><FaClock /></TimeIcon>
                  <DateTime>
                    {formatDate(booking.scheduled_at || booking.scheduled_time)}
                    <br />
                    {formatTime(booking.scheduled_at || booking.scheduled_time)}
                  </DateTime>
                </BookingDateTime>
              </BookingCard>
            ))
          )}
        </BookingsList>
      </Content>

      <NewBookingButton onClick={handleNewBooking}>
        <FaPlus />
      </NewBookingButton>
    </Container>
  );
};

export default CustomerBookings;
