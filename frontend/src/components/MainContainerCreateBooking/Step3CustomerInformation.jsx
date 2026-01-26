import React from 'react';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader';
import ContactInformationForm from '../Form/ContactInformationForm';
import VehicleInformationForm from '../Form/VehicleInformationForm';
import AdditionalNotesSection from '../Form/AdditionalNotesSection';
import useBookingForm from '../../hooks/useBookingForm';
import { useBooking } from '../../contexts/BookingContext';

const Container = styled.div`
  width: 100%;
`;

const Step3CustomerInformation = () => {
  const { 
    customerInfo, 
    vehicleInfo, 
    additionalNotes,
    updateCustomerInfo,
    updateVehicleInfo,
    setAdditionalNotes
  } = useBooking();

  const contactForm = useBookingForm(customerInfo);
  const vehicleForm = useBookingForm(vehicleInfo);

  // Validation rules
  const contactValidationRules = {
    name: {
      required: true,
      requiredMessage: 'Full name is required',
      minLength: 2
    },
    email: {
      required: false,
      email: true
    },
    phone: {
      required: false,
      phone: true
    }
  };

  const vehicleValidationRules = {
    make: {
      required: true,
      requiredMessage: 'Vehicle make is required'
    },
    model: {
      required: true,
      requiredMessage: 'Vehicle model is required'
    },
    year: {
      required: true,
      requiredMessage: 'Vehicle year is required'
    },
    licensePlate: {
      required: true,
      requiredMessage: 'License plate is required',
      minLength: 3
    }
  };

  // Update context when form values change
  React.useEffect(() => {
    Object.keys(contactForm.values).forEach(key => {
      if (contactForm.values[key] !== customerInfo[key]) {
        updateCustomerInfo(key, contactForm.values[key]);
      }
    });
  }, [contactForm.values]);

  React.useEffect(() => {
    Object.keys(vehicleForm.values).forEach(key => {
      if (vehicleForm.values[key] !== vehicleInfo[key]) {
        updateVehicleInfo(key, vehicleForm.values[key]);
      }
    });
  }, [vehicleForm.values]);

  return (
    <Container>
      <SectionHeader
        icon={<FaUser />}
        title="Your Information"
        subtitle="Please provide your contact and vehicle details"
      />

      <ContactInformationForm
        values={contactForm.values}
        errors={contactForm.errors}
        touched={contactForm.touched}
        onChange={contactForm.handleChange}
        onBlur={contactForm.handleBlur}
      />

      <VehicleInformationForm
        values={vehicleForm.values}
        errors={vehicleForm.errors}
        touched={vehicleForm.touched}
        onChange={vehicleForm.handleChange}
        onBlur={vehicleForm.handleBlur}
      />

      <AdditionalNotesSection
        value={additionalNotes}
        onChange={(name, value) => setAdditionalNotes(value)}
      />
    </Container>
  );
};

export default Step3CustomerInformation;
