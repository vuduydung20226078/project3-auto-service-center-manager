import React, { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  // Step 1: Service Selection
  const [selectedServices, setSelectedServices] = useState([]);

  // Step 2: Date & Time
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Step 3: Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    mileage: '',
    vin: ''
  });

  const [additionalNotes, setAdditionalNotes] = useState('');

  // Navigation state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Booking result
  const [bookingId, setBookingId] = useState(null);

  // Actions: Service Selection
  const selectService = useCallback((service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
  }, []);

  const deselectService = useCallback((serviceId) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  }, []);

  const clearServices = useCallback(() => {
    setSelectedServices([]);
  }, []);

  // Actions: Date & Time
  const setDateTime = useCallback((date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  }, []);

  // Actions: Customer Info
  const updateCustomerInfo = useCallback((field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateVehicleInfo = useCallback((field, value) => {
    setVehicleInfo(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Actions: Navigation
  const nextStep = useCallback(() => {
    setCompletedSteps(prev => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep];
      }
      return prev;
    });
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, [currentStep]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const completeStep = useCallback((step) => {
    setCompletedSteps(prev => {
      if (!prev.includes(step)) {
        return [...prev, step];
      }
      return prev;
    });
  }, []);

  // Action: Reset
  const resetBooking = useCallback(() => {
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    setVehicleInfo({
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      mileage: '',
      vin: ''
    });
    setAdditionalNotes('');
    setCurrentStep(1);
    setCompletedSteps([]);
    setBookingId(null);
  }, []);

  // Computed values
  const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + (service.duration || 0), 0);
  const isStepCompleted = useCallback((step) => completedSteps.includes(step), [completedSteps]);

  const value = {
    // State
    selectedServices,
    selectedDate,
    selectedTime,
    customerInfo,
    vehicleInfo,
    additionalNotes,
    currentStep,
    completedSteps,
    bookingId,

    // Actions
    selectService,
    deselectService,
    clearServices,
    setDateTime,
    updateCustomerInfo,
    updateVehicleInfo,
    setAdditionalNotes,
    nextStep,
    prevStep,
    goToStep,
    completeStep,
    resetBooking,
    setBookingId,

    // Computed
    totalPrice,
    totalDuration,
    isStepCompleted
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
