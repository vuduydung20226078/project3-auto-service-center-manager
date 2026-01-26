import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader';
import SelectedServicesCard from '../common/SelectedServicesCard';
import AppointmentDetailsCard from '../common/AppointmentDetailsCard';
import ContactInfoCard from '../common/ContactInfoCard';
import VehicleInfoCard from '../common/VehicleInfoCard';
import TermsConfirmation from '../Form/TermsConfirmation';
import { useBooking } from '../../contexts/BookingContext';

const Container = styled.div`
  width: 100%;
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FullWidthSection = styled.div`
  grid-column: 1 / -1;
`;

const Step4BookingReview = () => {
  const {
    selectedServices,
    selectedDate,
    selectedTime,
    customerInfo,
    vehicleInfo
  } = useBooking();

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsError, setTermsError] = useState('');

  const handleTermsChange = (agreed) => {
    setTermsAgreed(agreed);
    if (agreed) {
      setTermsError('');
    }
  };

  // Expose validation for parent component
  React.useEffect(() => {
    // This can be used by navigation to check if ready to submit
    window.bookingReviewValid = termsAgreed;
  }, [termsAgreed]);

  return (
    <Container>
      <SectionHeader
        icon={<FaCheckCircle />}
        title="Review Your Booking"
        subtitle="Please review your appointment details before confirming"
      />

      <ReviewGrid>
        <FullWidthSection>
          <SelectedServicesCard services={selectedServices} />
        </FullWidthSection>

        <AppointmentDetailsCard 
          date={selectedDate} 
          time={selectedTime} 
        />

        <ContactInfoCard
          name={customerInfo.name}
          email={customerInfo.email}
          phone={customerInfo.phone}
        />

        <FullWidthSection>
          <VehicleInfoCard
            make={vehicleInfo.make}
            model={vehicleInfo.model}
            year={vehicleInfo.year}
            licensePlate={vehicleInfo.licensePlate}
            mileage={vehicleInfo.mileage ? parseInt(vehicleInfo.mileage) : null}
          />
        </FullWidthSection>

        <FullWidthSection>
          <TermsConfirmation
            agreed={termsAgreed}
            onChange={handleTermsChange}
            error={termsError}
          />
        </FullWidthSection>
      </ReviewGrid>
    </Container>
  );
};

export default Step4BookingReview;
