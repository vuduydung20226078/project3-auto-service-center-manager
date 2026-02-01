import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBell, FaCar, FaCalendarAlt, FaBox } from 'react-icons/fa';
import { getAllBookings } from '../../api/bookingsApi';
import { vehiclesApi } from '../../api/vehiclesApi';

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
  padding: 20px;
`;

const Greeting = styled.div`
  margin-bottom: 24px;
`;

const GreetingTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const GreetingSubtitle = styled.p`
  font-size: 14px;
  color: #666;
`;

const NextBookingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const BookingInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const BookingIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: #dbeafe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-size: 20px;
  flex-shrink: 0;
`;

const BookingDetails = styled.div`
  flex: 1;
`;

const BookingDate = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const BookingTime = styled.div`
  font-size: 14px;
  color: #666;
`;

const BookingVehicle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const VehicleIcon = styled.div`
  color: #666;
  font-size: 16px;
`;

const VehicleInfo = styled.div`
  font-size: 14px;
  color: #666;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background: ${props => props.$status === 'Confirmed' ? '#dcfce7' : '#dbeafe'};
  color: ${props => props.$status === 'Confirmed' ? '#16a34a' : '#2563eb'};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.$bgColor};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  font-size: 18px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const CustomerHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nextBooking, setNextBooking] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    vehiclesOwned: 0,
    servicesDone: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const bookingsData = await getAllBookings();
      
      // Get next upcoming confirmed booking
      const now = new Date();
      const upcomingBookings = bookingsData
        .filter(b => {
          const bookingDate = new Date(b.scheduled_time);
          return bookingDate > now && (b.status === 'Confirmed' || b.status === 'In Service');
        })
        .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));
      
      if (upcomingBookings.length > 0) {
        setNextBooking(upcomingBookings[0]);
      }

      // Fetch vehicles
      const vehiclesData = await vehiclesApi.getAll();

      // Calculate stats
      const completedBookings = bookingsData.filter(b => b.status === 'Completed').length;
      
      setStats({
        totalBookings: bookingsData.length,
        vehiclesOwned: vehiclesData.length,
        servicesDone: completedBookings
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Hello';
    if (hour < 18) return 'Hello';
    return 'Hello';
  };

  const getUserName = () => {
    if (user?.username) {
      return user.username.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'User';
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Logo>
            <LogoIcon><FaCar /></LogoIcon>
            AutoCare
          </Logo>
        </Header>
        <Content>
          <EmptyState>Loading...</EmptyState>
        </Content>
      </Container>
    );
  }

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
        <Greeting>
          <GreetingTitle>{getGreeting()}, {getUserName()}</GreetingTitle>
          <GreetingSubtitle>back to AutoCare</GreetingSubtitle>
        </Greeting>

        <NextBookingCard>
          <SectionTitle>Next Booking</SectionTitle>
          {nextBooking ? (
            <>
              <BookingInfo>
                <BookingIconWrapper>
                  <FaCalendarAlt />
                </BookingIconWrapper>
                <BookingDetails>
                  <BookingDate>{formatDate(nextBooking.scheduled_time)}</BookingDate>
                  <BookingTime>{formatTime(nextBooking.scheduled_time)}</BookingTime>
                </BookingDetails>
              </BookingInfo>

              <BookingVehicle>
                <VehicleIcon><FaCar /></VehicleIcon>
                <VehicleInfo>
                  {nextBooking.vehicle?.license_plate || 'N/A'}
                  <br />
                  {nextBooking.vehicle?.make || ''} {nextBooking.vehicle?.model || ''}
                </VehicleInfo>
              </BookingVehicle>

              <StatusBadge $status={nextBooking.status}>{nextBooking.status}</StatusBadge>
            </>
          ) : (
            <EmptyState>No upcoming bookings</EmptyState>
          )}
        </NextBookingCard>

        <StatsGrid>
          <StatCard>
            <StatIconWrapper $bgColor="#dbeafe" $color="#2563eb">
              <FaCalendarAlt />
            </StatIconWrapper>
            <StatValue>{stats.totalBookings}</StatValue>
            <StatLabel>Total Bookings</StatLabel>
          </StatCard>

          <StatCard>
            <StatIconWrapper $bgColor="#e0e7ff" $color="#6366f1">
              <FaCar />
            </StatIconWrapper>
            <StatValue>{stats.vehiclesOwned}</StatValue>
            <StatLabel>Vehicles Owned</StatLabel>
          </StatCard>

          <StatCard>
            <StatIconWrapper $bgColor="#dcfce7" $color="#16a34a">
              <FaBox />
            </StatIconWrapper>
            <StatValue>{stats.servicesDone}</StatValue>
            <StatLabel>Services Done</StatLabel>
          </StatCard>
        </StatsGrid>
      </Content>
    </Container>
  );
};

export default CustomerHome;
