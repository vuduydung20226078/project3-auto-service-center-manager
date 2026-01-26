import React from 'react';
import styled from 'styled-components';
import SelectedServicesCard from './SelectedServicesCard';
import AppointmentDetailsCard from './AppointmentDetailsCard';
import ContactInfoCard from './ContactInfoCard';
import VehicleInfoCard from './VehicleInfoCard';

const SummaryContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 2px solid #e0e0e0;
`;

const SummaryTitle = styled.h3`
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FullWidthSection = styled.div`
  grid-column: 1 / -1;
`;

const BookingSummaryCard = ({ 
  bookingData 
}) => {
  const {
    services,
    date,
    time,
    customerInfo,
    vehicleInfo
  } = bookingData;

  return (
    <SummaryContainer>
      <SummaryTitle>Booking Summary</SummaryTitle>

      <SummaryGrid>
        <FullWidthSection>
          <SelectedServicesCard services={services} />
        </FullWidthSection>

        <AppointmentDetailsCard 
          date={date} 
          time={time} 
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
      </SummaryGrid>
    </SummaryContainer>
  );
};

export default BookingSummaryCard;
