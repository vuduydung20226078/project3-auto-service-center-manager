import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCar, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Step1ServiceSelection from '../../components/MainContainerCreateBooking/Step1ServiceSelection';
import Step2DateTimeSelection from '../../components/MainContainerCreateBooking/Step2DateTimeSelection';
import { BookingProvider, useBooking } from '../../contexts/BookingContext';
import { createBooking } from '../../api/bookingsApi';
import { vehiclesApi } from '../../api/vehiclesApi';
import api from '../../api/api';
import toast from '../../utils/toast';

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

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 16px;
    left: 50%;
    right: -50%;
    height: 2px;
    background: ${props => props.$completed ? '#2563eb' : '#e5e7eb'};
    z-index: 0;
  }
`;

const StepCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$active ? '#2563eb' : props.$completed ? '#10b981' : '#e5e7eb'};
  color: ${props => props.$active || props.$completed ? 'white' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  z-index: 1;
`;

const StepLabel = styled.div`
  font-size: 12px;
  color: ${props => props.$active ? '#2563eb' : '#666'};
  font-weight: ${props => props.$active ? 600 : 400};
  text-align: center;
`;

const StepContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
  
  &:disabled {
    background: #f9fafb;
    color: #666;
  }
`;

const VehicleCard = styled.div`
  background: ${props => props.$selected ? '#dbeafe' : '#f9fafb'};
  border: 2px solid ${props => props.$selected ? '#2563eb' : '#e5e7eb'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2563eb;
  }
`;

const VehiclePlate = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const VehicleDetails = styled.div`
  font-size: 14px;
  color: #666;
`;

const AddVehicleButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${props => props.$isActive ? '#2563eb' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#2563eb'};
  border: 2px solid #2563eb;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$variant === 'primary' ? `
    background: #2563eb;
    color: white;
    &:hover {
      background: #1d4ed8;
    }
    &:disabled {
      background: #93c5fd;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #666;
    border: 1px solid #e5e7eb;
    &:hover {
      background: #f9fafb;
    }
  `}
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #16a34a;
  font-size: 40px;
`;

const SuccessTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
`;

const SuccessMessage = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
`;

const CustomerCreateBookingContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedServices, selectedDate, selectedTime } = useBooking();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehicleMileage, setSelectedVehicleMileage] = useState('');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    vin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    if (currentStep === 3) {
      fetchCustomerInfo();
    }
    if (currentStep === 4) {
      fetchVehicles();
    }
  }, [currentStep]);

  const fetchCustomerInfo = async () => {
    try {
      const response = await api.get('/customers/me');
      setCustomerInfo({
        name: response.data.name || '',
        email: response.data.email || user.email || '',
        phone: response.data.phone || '',
        address: response.data.address || ''
      });
    } catch (error) {
      console.error('Error fetching customer info:', error);
      toast.error('Failed to load customer information');
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await vehiclesApi.getAll();
      setVehicles(data);
      if (data.length > 0) {
        setSelectedVehicle(data[0]);
        setSelectedVehicleMileage(data[0].mileage || '');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && (!selectedServices || selectedServices.length === 0)) {
      toast.warning('Please select at least one service');
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      toast.warning('Please select date and time');
      return;
    }
    if (currentStep === 3 && !customerInfo.phone) {
      toast.warning('Phone number is required');
      return;
    }
    if (currentStep === 4) {
      handleSubmit();
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVehicle && !showAddVehicle) {
      toast.warning('Please select a vehicle or add a new one');
      return;
    }

    // Validate scheduled time is in the future
    const scheduledDateTime = new Date(`${selectedDate}T${convertTo24Hour(selectedTime)}`);
    const now = new Date();
    if (scheduledDateTime <= now) {
      toast.error('Please select a future date and time for your booking');
      return;
    }

    setIsSubmitting(true);
    try {
      const notes = `Services: ${selectedServices.map(s => s.name).join(', ')}`;

      let vehicleData;
      if (showAddVehicle) {
        vehicleData = {
          license_plate: newVehicle.license_plate,
          make: newVehicle.make,
          model: newVehicle.model,
          year: parseInt(newVehicle.year) || null,
          mileage: parseInt(newVehicle.mileage) || null,
          vin: newVehicle.vin || null
        };
      } else {
        // Use existing vehicle; prefer the edited mileage if provided by the user
        vehicleData = {
          license_plate: selectedVehicle.license_plate,
          make: selectedVehicle.make,
          model: selectedVehicle.model,
          year: selectedVehicle.year,
          mileage: selectedVehicleMileage !== '' ? parseInt(selectedVehicleMileage, 10) : selectedVehicle.mileage || null,
          vin: selectedVehicle.vin
        };

        // If user edited mileage for an existing vehicle, persist it before creating booking
        if (selectedVehicle && selectedVehicleMileage !== '' && parseInt(selectedVehicleMileage, 10) !== selectedVehicle.mileage) {
          try {
            await vehiclesApi.update(selectedVehicle.id, { mileage: parseInt(selectedVehicleMileage, 10) });
          } catch (err) {
            console.warn('Failed to update vehicle mileage, continuing to create booking', err);
          }
        }
      }

      const response = await createBooking({
        vehicleData,
        scheduled_at: scheduledDateTime.toISOString(),
        notes
      });

      const booking = response.booking || response;
      setBookingId(booking.id);
      setBookingSuccess(true);
      toast.success('Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      // Extract error message from response (check both message and error fields)
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create booking';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    
    if (modifier === 'AM') {
      if (hours === 12) hours = 0; // 12 AM = 00:00
    } else if (modifier === 'PM') {
      if (hours !== 12) hours += 12; // 1 PM = 13:00, but 12 PM = 12:00
    }
    
    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  };

  const renderStep = () => {
    if (bookingSuccess) {
      return (
        <StepContent>
          <SuccessContainer>
            <SuccessIcon>
              <FaCheck />
            </SuccessIcon>
            <SuccessTitle>Booking Confirmed!</SuccessTitle>
            <SuccessMessage>
              Your booking has been successfully created. We'll contact you soon to confirm.
            </SuccessMessage>
            <Button $variant="primary" onClick={() => navigate('/customer/bookings')}>
              View My Bookings
            </Button>
          </SuccessContainer>
        </StepContent>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <Step1ServiceSelection />
          </StepContent>
        );
      case 2:
        return (
          <StepContent>
            <Step2DateTimeSelection />
          </StepContent>
        );
      case 3:
        return (
          <StepContent>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
              Confirm Your Information
            </h3>
            <FormGroup>
              <Label>Full Name *</Label>
              <Input
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="Enter your email"
              />
            </FormGroup>
            <FormGroup>
              <Label>Phone Number *</Label>
              <Input
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </FormGroup>
            <FormGroup>
              <Label>Address</Label>
              <Input
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                placeholder="Enter your address"
              />
            </FormGroup>
          </StepContent>
        );
      case 4:
        return (
          <StepContent>
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
              Select or Add Vehicle
            </h3>
            
            {!showAddVehicle && vehicles.length > 0 && (
              <>
                <Label>Your Vehicles</Label>
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    $selected={selectedVehicle?.id === vehicle.id}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setShowAddVehicle(false);
                      setSelectedVehicleMileage(vehicle.mileage || '');
                    }}
                  >
                    <VehiclePlate>{vehicle.license_plate}</VehiclePlate>
                    <VehicleDetails>
                      {vehicle.make} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                    </VehicleDetails>
                    {selectedVehicle?.id === vehicle.id && (
                      <div style={{ marginTop: 12 }}>
                        <Label>Current Mileage (km)</Label>
                        <Input
                          value={selectedVehicleMileage}
                          onChange={(e) => setSelectedVehicleMileage(e.target.value)}
                          placeholder="Enter current mileage"
                        />
                      </div>
                    )}
                  </VehicleCard>
                ))}
              </>
            )}
            
            <AddVehicleButton
              $isActive={showAddVehicle}
              onClick={() => setShowAddVehicle(!showAddVehicle)}
            >
              {showAddVehicle ? '- Cancel Add New Vehicle' : '+ Add New Vehicle'}
            </AddVehicleButton>

            {showAddVehicle && (
              <>
                <FormGroup>
                  <Label>License Plate *</Label>
                  <Input
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                    placeholder="e.g., 30A-12345"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Make *</Label>
                  <Input
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    placeholder="e.g., Toyota"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Model *</Label>
                  <Input
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    placeholder="e.g., Camry"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    placeholder="e.g., 2020"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mileage (km)</Label>
                  <Input
                    type="number"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
                    placeholder="Current mileage"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>VIN</Label>
                  <Input
                    value={newVehicle.vin}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                    placeholder="Vehicle Identification Number"
                  />
                </FormGroup>
              </>
            )}
          </StepContent>
        );
      default:
        return null;
    }
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
        {!bookingSuccess && (
          <ProgressBar>
            <ProgressStep $completed={currentStep > 1}>
              <StepCircle $active={currentStep === 1} $completed={currentStep > 1}>
                {currentStep > 1 ? <FaCheck /> : '1'}
              </StepCircle>
              <StepLabel $active={currentStep === 1}>Services</StepLabel>
            </ProgressStep>
            <ProgressStep $completed={currentStep > 2}>
              <StepCircle $active={currentStep === 2} $completed={currentStep > 2}>
                {currentStep > 2 ? <FaCheck /> : '2'}
              </StepCircle>
              <StepLabel $active={currentStep === 2}>Date & Time</StepLabel>
            </ProgressStep>
            <ProgressStep $completed={currentStep > 3}>
              <StepCircle $active={currentStep === 3} $completed={currentStep > 3}>
                {currentStep > 3 ? <FaCheck /> : '3'}
              </StepCircle>
              <StepLabel $active={currentStep === 3}>Your Info</StepLabel>
            </ProgressStep>
            <ProgressStep>
              <StepCircle $active={currentStep === 4}>
                4
              </StepCircle>
              <StepLabel $active={currentStep === 4}>Vehicle</StepLabel>
            </ProgressStep>
          </ProgressBar>
        )}

        {renderStep()}

        {!bookingSuccess && (
          <ButtonGroup>
            {currentStep > 1 && (
              <Button onClick={handleBack}>
                Back
              </Button>
            )}
            <Button 
              $variant="primary" 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : currentStep === 4 ? 'Confirm Booking' : 'Next'}
            </Button>
          </ButtonGroup>
        )}
      </Content>
    </Container>
  );
};

const CustomerCreateBooking = () => {
  return (
    <BookingProvider>
      <CustomerCreateBookingContent />
    </BookingProvider>
  );
};

export default CustomerCreateBooking;
