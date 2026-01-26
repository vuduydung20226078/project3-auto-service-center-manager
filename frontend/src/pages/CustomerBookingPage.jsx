import React, { useState } from 'react';
import BookingLayout from '../components/Layout/BookingLayout';
import BookingProgressBar from '../components/Layout/BookingProgressBar';
import NavigationButtons from '../components/Layout/NavigationButtons';
import Step1ServiceSelection from '../components/MainContainerCreateBooking/Step1ServiceSelection';
import Step2DateTimeSelection from '../components/MainContainerCreateBooking/Step2DateTimeSelection';
import Step3CustomerInformation from '../components/MainContainerCreateBooking/Step3CustomerInformation';
import Step4BookingReview from '../components/MainContainerCreateBooking/Step4BookingReview';
import BookingSuccessPage from '../components/MainContainerCreateBooking/BookingSuccessPage';
import { BookingProvider, useBooking } from '../contexts/BookingContext';
import useBookingNavigation from '../hooks/useBookingNavigation';
import { createCustomerBooking } from '../api/bookingsApi';
import toast from '../utils/toast';

const CustomerBookingPageContent = () => {
  const { 
    currentStep,
    selectedServices,
    selectedDate,
    selectedTime,
    customerInfo,
    vehicleInfo,
    additionalNotes,
    setBookingId,
    goToStep
  } = useBooking();

  const {
    nextStep,
    prevStep,
    canProceedToStep2,
    canProceedToStep3,
    canProceedToStep4,
    canSubmitBooking
  } = useBookingNavigation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleNext = async () => {
    if (currentStep === 4) {
      // Submit booking
      await handleSubmitBooking();
    } else {
      const canProceed = nextStep();
      if (!canProceed) {
        // Specific error message for step 3 (contact info)
        if (currentStep === 3) {
          const hasContactMethod = customerInfo.email || customerInfo.phone;
          if (!hasContactMethod) {
            toast.warning('Please provide at least an email address or phone number to continue.');
          } else {
            toast.warning('Please complete all required fields before continuing.');
          }
        } else {
          toast.warning('Please complete all required fields before continuing.');
        }
      }
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const handleSubmitBooking = async () => {
    if (!canSubmitBooking()) {
      // Check specifically for contact method
      const hasContactMethod = customerInfo.email || customerInfo.phone;
      if (!hasContactMethod) {
        toast.error('Please provide at least an email address or phone number.');
        return;
      }
      toast.warning('Please complete all required fields.');
      return;
    }

    // Check terms agreement
    if (!window.bookingReviewValid) {
      toast.warning('Please agree to the terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare customer data
      const customerData = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address || null
      };

      // Prepare vehicle data
      const vehicleData = {
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: parseInt(vehicleInfo.year),
        license_plate: vehicleInfo.licensePlate,
        mileage: vehicleInfo.mileage ? parseInt(vehicleInfo.mileage) : null,
        vin: vehicleInfo.vin || null,
        note: additionalNotes || null
      };

      // Prepare booking data
      const scheduledDateTime = new Date(`${selectedDate}T${convertTo24Hour(selectedTime)}`);
      const notes = `Services: ${selectedServices.map(s => s.name).join(', ')}. ${additionalNotes || ''}`;

      // Call smart endpoint - it will find or create customer & vehicle
      const response = await createCustomerBooking({
        customerData,
        vehicleData,
        scheduled_at: scheduledDateTime.toISOString(),
        notes,
        selectedServices: selectedServices.map(s => ({ id: s.id, name: s.name, price: s.price }))
      });

      // Set booking ID and show success
      setBookingId(response.booking.id);
      setBookingComplete(true);

    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError(error.response?.data?.message || 'Failed to create booking. Please try again.');
      toast.error(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}:00`;
  };

  const getContinueText = () => {
    if (currentStep === 4) return 'Confirm Booking';
    if (currentStep === 3) return 'Review Booking';
    if (currentStep === 2) return 'Continue to Your Information';
    return 'Continue to Date & Time';
  };

  const getContinueDisabled = () => {
    if (isSubmitting) return true;
    if (currentStep === 1) return !canProceedToStep2();
    if (currentStep === 2) return !canProceedToStep3();
    if (currentStep === 3) return !canProceedToStep4();
    return false;
  };

  const handleStepClick = (step) => {
    goToStep(step);
  };

  const renderStep = () => {
    if (bookingComplete) {
      return <BookingSuccessPage />;
    }

    switch (currentStep) {
      case 1:
        return <Step1ServiceSelection />;
      case 2:
        return <Step2DateTimeSelection />;
      case 3:
        return <Step3CustomerInformation />;
      case 4:
        return <Step4BookingReview />;
      default:
        return <Step1ServiceSelection />;
    }
  };

  return (
    <BookingLayout>
      {!bookingComplete && (
        <BookingProgressBar 
          currentStep={currentStep}
          completedSteps={[]}
          onStepClick={handleStepClick}
        />
      )}

      {renderStep()}

      {!bookingComplete && (
        <NavigationButtons
          onBack={handleBack}
          onContinue={handleNext}
          continueText={getContinueText()}
          showBack={currentStep > 1}
          continueDisabled={getContinueDisabled()}
          loading={isSubmitting}
        />
      )}

      {submitError && (
        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          background: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c00',
          textAlign: 'center'
        }}>
          {submitError}
        </div>
      )}
    </BookingLayout>
  );
};

const CustomerBookingPage = () => {
  return (
    <BookingProvider>
      <CustomerBookingPageContent />
    </BookingProvider>
  );
};

export default CustomerBookingPage;
