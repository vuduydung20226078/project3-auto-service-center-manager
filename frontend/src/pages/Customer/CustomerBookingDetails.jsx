import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCar, FaUser, FaPhone, FaCalendar, FaClock, FaMapMarkerAlt, FaTools, FaCheckCircle } from 'react-icons/fa';
import api from '../../api/api';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
`;

const Header = styled.div`
  background: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #2563eb;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const Content = styled.div`
  padding: 20px;
`;

const BookingHeader = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const BookingIdRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const BookingId = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
`;

const StatusBadge = styled.div`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => {
    switch (props.status?.toUpperCase()) {
      case 'PENDING': return '#f59e0b';
      case 'CONFIRMED': return '#10b981';
      case 'IN_PROGRESS':
      case 'IN SERVICE': return '#2563eb';
      case 'COMPLETED': return '#6366f1';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const InfoCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const InfoTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-size: 18px;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
`;

const NotesSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const NotesLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
`;

const NotesText = styled.div`
  font-size: 14px;
  color: #1a1a1a;
  line-height: 1.5;
`;

const ProgressSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ProgressTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 10px;
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
`;

const ProgressLineActive = styled.div`
  position: absolute;
  top: 20px;
  left: 10%;
  width: ${props => props.progress}%;
  height: 2px;
  background: #10b981;
  z-index: 1;
  transition: width 0.3s ease;
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
`;

const ProgressDot = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? '#10b981' : '#e5e7eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  transition: all 0.3s ease;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#10b981' : '#666'};
  text-align: center;
  max-width: 70px;
`;

const WorkOrderSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const WorkOrderTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ServiceName = styled.div`
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
`;

const ServicePrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
`;

const SectionDivider = styled.div`
  margin: 16px 0;
  border-top: 1px solid #e5e7eb;
`;

const SubSectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
`;

const TechnicianInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
`;

const TechnicianAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const TechnicianDetails = styled.div`
  flex: 1;
`;

const TechnicianName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const TechnicianPhone = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: #666;
`;

const CustomerBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      navigate('/customer/bookings');
    } finally {
      setLoading(false);
    }
  };

  const getProgressStatus = (status) => {
    const statusMap = {
      'PENDING': 0,
      'CONFIRMED': 25,
      'IN_PROGRESS': 50,
      'COMPLETED': 100,
      'CLOSED': 100
    };
    return statusMap[status?.toUpperCase()] || 0;
  };

  const isStepActive = (step, status) => {
    const statusOrder = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(status?.toUpperCase());
    const stepIndex = statusOrder.indexOf(step);
    return stepIndex <= currentIndex;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0đ';
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
      'CLOSED': 'Closed'
    };
    return statusMap[status?.toUpperCase()] || status;
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/customer/bookings')}>
            <FaArrowLeft />
          </BackButton>
          <Title>Booking Details</Title>
        </Header>
        <LoadingState>Loading...</LoadingState>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/customer/bookings')}>
            <FaArrowLeft />
          </BackButton>
          <Title>Booking Details</Title>
        </Header>
        <EmptyState>Không tìm thấy booking</EmptyState>
      </Container>
    );
  }

  const workOrder = booking.WorkOrder;
  const vehicle = booking.Vehicle;
  const services = workOrder?.WorkOrderItems?.filter(item => item.item_type === 'SERVICE') || [];
  const parts = workOrder?.WorkOrderItems?.filter(item => item.item_type === 'PART') || [];
  const technician = workOrder?.Technician;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/customer/bookings')}>
          <FaArrowLeft />
        </BackButton>
        <Title>Booking Details</Title>
      </Header>

      <Content>
        <BookingHeader>
          <BookingIdRow>
            <BookingId>Booking #{booking.id}</BookingId>
            <StatusBadge status={booking.status}>
              {getStatusText(booking.status)}
            </StatusBadge>
          </BookingIdRow>
        </BookingHeader>

        <InfoCard>
          <InfoTitle>Booking Information</InfoTitle>
          
          <InfoRow>
            <InfoIcon>
              <FaCalendar />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Date & Time</InfoLabel>
              <InfoValue>
                {formatDate(booking.scheduled_at)} at {formatTime(booking.scheduled_at)}
              </InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon>
              <FaCar />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Vehicle</InfoLabel>
              <InfoValue>
                {vehicle?.license_plate} - {vehicle?.make} {vehicle?.model} ({vehicle?.year})
              </InfoValue>
            </InfoContent>
          </InfoRow>

          {booking.notes && (
            <NotesSection>
              <NotesLabel>Customer Notes</NotesLabel>
              <NotesText>{booking.notes}</NotesText>
            </NotesSection>
          )}
        </InfoCard>

        {booking.status !== 'CANCELLED' && booking.status !== 'PENDING' && (
          <ProgressSection>
            <ProgressTitle>Status Progress</ProgressTitle>
            <ProgressBar>
              <ProgressLine />
              <ProgressLineActive progress={getProgressStatus(booking.status)} />
              
              <ProgressStep>
                <ProgressDot active={isStepActive('PENDING', booking.status)}>
                  {isStepActive('PENDING', booking.status) && <FaCheckCircle />}
                </ProgressDot>
                <ProgressLabel active={isStepActive('PENDING', booking.status)}>
                  Booked
                </ProgressLabel>
              </ProgressStep>

              <ProgressStep>
                <ProgressDot active={isStepActive('CONFIRMED', booking.status)}>
                  {isStepActive('CONFIRMED', booking.status) && <FaCheckCircle />}
                </ProgressDot>
                <ProgressLabel active={isStepActive('CONFIRMED', booking.status)}>
                  Confirmed
                </ProgressLabel>
              </ProgressStep>

              <ProgressStep>
                <ProgressDot active={isStepActive('IN_PROGRESS', booking.status)}>
                  {isStepActive('IN_PROGRESS', booking.status) && <FaCheckCircle />}
                </ProgressDot>
                <ProgressLabel active={isStepActive('IN_PROGRESS', booking.status)}>
                  In Service
                </ProgressLabel>
              </ProgressStep>

              <ProgressStep>
                <ProgressDot active={isStepActive('COMPLETED', booking.status)}>
                  {isStepActive('COMPLETED', booking.status) && <FaCheckCircle />}
                </ProgressDot>
                <ProgressLabel active={isStepActive('COMPLETED', booking.status)}>
                  Done
                </ProgressLabel>
              </ProgressStep>
            </ProgressBar>
          </ProgressSection>
        )}

        {workOrder && (
          <WorkOrderSection>
            <WorkOrderTitle>Work Order Summary</WorkOrderTitle>

            {services.length > 0 && (
              <>
                <SubSectionTitle>Services</SubSectionTitle>
                {services.map((item, index) => {
                  const quantity = parseInt(item.quantity) || 1;
                  const unitPrice = parseFloat(item.unit_price) || 0;
                  const lineTotal = quantity * unitPrice;
                  
                  return (
                    <ServiceItem key={index}>
                      <ServiceName>
                        {item.service?.name || item.description || 'Service'}
                      </ServiceName>
                      <ServicePrice>
                        {formatCurrency(lineTotal)}
                      </ServicePrice>
                    </ServiceItem>
                  );
                })}
              </>
            )}

            {parts.length > 0 && (
              <>
                <SectionDivider />
                <SubSectionTitle>Parts Replaced</SubSectionTitle>
                {parts.map((item, index) => {
                  const quantity = parseInt(item.quantity) || 1;
                  const unitPrice = parseFloat(item.unit_price) || 0;
                  const lineTotal = quantity * unitPrice;
                  
                  return (
                    <ServiceItem key={index}>
                      <ServiceName>
                        {item.part?.name || item.description || 'Part'} (x{quantity})
                      </ServiceName>
                      <ServicePrice>
                        {formatCurrency(lineTotal)}
                      </ServicePrice>
                    </ServiceItem>
                  );
                })}
              </>
            )}

            {technician && (
              <>
                <SectionDivider />
                <SubSectionTitle>Assigned Technician</SubSectionTitle>
                <TechnicianInfo>
                  <TechnicianAvatar>
                    <FaTools />
                  </TechnicianAvatar>
                  <TechnicianDetails>
                    <TechnicianName>{technician.User?.full_name || 'N/A'}</TechnicianName>
                    <TechnicianPhone>
                      <FaPhone size={10} />
                      {technician.User?.phone || 'N/A'}
                    </TechnicianPhone>
                  </TechnicianDetails>
                </TechnicianInfo>
              </>
            )}
          </WorkOrderSection>
        )}
      </Content>
    </Container>
  );
};

export default CustomerBookingDetails;
