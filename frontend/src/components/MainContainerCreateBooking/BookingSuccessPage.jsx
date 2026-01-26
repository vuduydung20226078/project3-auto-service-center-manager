import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaCalendarPlus } from 'react-icons/fa';
import SuccessIcon from '../common/SuccessIcon';
import BookingSummaryCard from '../common/BookingSummaryCard';
import PromoCard from '../common/PromoCard';
import Button from '../common/Button';
import { useBooking } from '../../contexts/BookingContext';
import toast from '../../utils/toast';

const Container = styled.div`
  width: 100%;
  text-align: center;
`;

const SuccessMessage = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #10b981;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 8px 0;
`;

const BookingIdBox = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border: 2px solid #667eea30;
  border-radius: 8px;
  padding: 12px 24px;
  margin-bottom: 24px;

  span {
    font-size: 14px;
    color: #666;
    margin-right: 8px;
  }

  strong {
    font-size: 18px;
    color: #667eea;
    font-weight: 700;
  }
`;

const ConfirmationBox = styled.div`
  background: linear-gradient(135deg, #3b82f610 0%, #2563eb10 100%);
  border: 2px solid #3b82f630;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 32px;
  text-align: center;

  svg {
    color: #3b82f6;
    font-size: 24px;
    margin-bottom: 12px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.6;

    strong {
      color: #333;
      font-weight: 600;
    }
  }
`;

const SummarySection = styled.div`
  margin-bottom: 32px;
`;

const PromoSection = styled.div`
  margin: 32px 0;
`;

const ActionsSection = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BookingSuccessPage = () => {
  const {
    bookingId,
    selectedServices,
    selectedDate,
    selectedTime,
    customerInfo,
    vehicleInfo,
    resetBooking
  } = useBooking();

  const [showPromo, setShowPromo] = React.useState(true);

  const bookingData = {
    services: selectedServices,
    date: selectedDate,
    time: selectedTime,
    customerInfo,
    vehicleInfo
  };

  const handleBookAnother = () => {
    resetBooking();
    window.location.reload(); // or navigate to booking start
  };

  const handleViewBookings = () => {
    // Navigate to bookings page (customer login required)
    window.location.href = '/auth?tab=login&redirect=/my-bookings';
  };

  const handleClosePromo = () => {
    setShowPromo(false);
  };

  const handleRegister = () => {
    window.location.href = '/';
  };

  const handleLearnMore = () => {
    toast.info('Learn more about member benefits!');
  };

  return (
    <Container>
      <SuccessMessage>
        <SuccessIcon animated />
        <Title>Booking Confirmed!</Title>
        <Subtitle>Thank you for choosing our service! We've received your booking request.</Subtitle>
      </SuccessMessage>

      {bookingId && (
        <BookingIdBox>
          <span>Booking ID:</span>
          <strong>#{bookingId}</strong>
        </BookingIdBox>
      )}

      <ConfirmationBox>
        <FaCheckCircle />
        <p>
          📧 A confirmation email has been sent to <strong>{customerInfo.email}</strong>
          <br />
          📞 We'll contact you at <strong>{customerInfo.phone}</strong> if we need any additional information.
        </p>
      </ConfirmationBox>

      <SummarySection>
        <BookingSummaryCard bookingData={bookingData} />
      </SummarySection>

      {showPromo && (
        <PromoSection>
          <PromoCard
            onClose={handleClosePromo}
            onRegister={handleRegister}
            onLearnMore={handleLearnMore}
          />
        </PromoSection>
      )}

      <ActionsSection>
        <Button
          variant="primary"
          size="large"
          icon={<FaCalendarPlus />}
          onClick={handleBookAnother}
        >
          Book Another Appointment
        </Button>
        <Button
          variant="outline"
          size="large"
          onClick={handleViewBookings}
        >
          View My Bookings
        </Button>
      </ActionsSection>
    </Container>
  );
};

export default BookingSuccessPage;
