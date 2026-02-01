import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCar, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { vehiclesApi } from '../../api/vehiclesApi';
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
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  padding: 8px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

const Content = styled.div`
  padding: 0;
`;

const VehicleHeader = styled.div`
  background: white;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const VehicleIconWrapper = styled.div`
  width: 72px;
  height: 72px;
  background: #dbeafe;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-size: 32px;
  flex-shrink: 0;
`;

const VehicleInfo = styled.div`
  flex: 1;
`;

const VehiclePlate = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const VehicleMake = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 4px;
`;

const VehicleYear = styled.div`
  font-size: 14px;
  color: #999;
`;

const DetailSection = styled.div`
  background: white;
  margin-top: 8px;
  padding: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const DetailValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: right;
`;

const StatsSection = styled.div`
  background: white;
  margin-top: 8px;
  padding: 20px;
  display: flex;
  gap: 20px;
`;

const StatBox = styled.div`
  flex: 1;
  text-align: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const SectionTitle = styled.div`
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f5f5f5;
`;

const ServiceHistoryItem = styled.div`
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  font-size: 18px;
  flex-shrink: 0;
`;

const ServiceInfo = styled.div`
  flex: 1;
`;

const ServiceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ServiceDate = styled.div`
  font-size: 12px;
  color: #999;
`;

const ServicePrice = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #2563eb;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #dcfce7;
  color: #16a34a;
`;

const ActionButton = styled.button`
  width: calc(100% - 40px);
  margin: 20px;
  padding: 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1d4ed8;
  }
`;

const SecondaryButton = styled.button`
  width: calc(100% - 40px);
  margin: 0 20px 20px;
  padding: 16px;
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f7ff;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
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
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$primary ? `
    background: #2563eb;
    color: white;
    
    &:hover {
      background: #1d4ed8;
    }
  ` : `
    background: #f3f4f6;
    color: #333;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const CustomerVehicleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    note: ''
  });

  useEffect(() => {
    fetchVehicleDetails();
    fetchServiceHistory();
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      const data = await vehiclesApi.getById(id);
      setVehicle(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      toast.error('Failed to load vehicle details');
      setLoading(false);
    }
  };

  const fetchServiceHistory = async () => {
    try {
      const data = await vehiclesApi.getServiceHistory(id);
      setServiceHistory(data);
    } catch (error) {
      console.error('Error fetching service history:', error);
      // Don't show error toast for service history, just log it
    }
  };

  const handleBookService = () => {
    toast.info('Book service feature coming soon!');
  };

  const handleUpdateVehicle = () => {
    setUpdateData({
      license_plate: vehicle.license_plate || '',
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      mileage: vehicle.mileage || '',
      note: vehicle.note || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateInputChange = (field, value) => {
    setUpdateData(prev => ({ ...prev, [field]: value }));
  };

  const submitUpdateVehicle = async () => {
    try {
      const vehicleData = {
        license_plate: updateData.license_plate.trim() || null,
        make: updateData.make.trim() || null,
        model: updateData.model.trim() || null,
        year: updateData.year ? parseInt(updateData.year) : null,
        mileage: updateData.mileage ? parseInt(updateData.mileage) : null,
        note: updateData.note.trim() || null
      };

      await vehiclesApi.update(id, vehicleData);
      toast.success('Vehicle updated successfully');
      setShowUpdateModal(false);
      fetchVehicleDetails();
    } catch (err) {
      console.error('Failed to update vehicle', err);
      toast.error(err.response?.data?.message || 'Failed to update vehicle');
    }
  };

  const cancelUpdateVehicle = () => {
    setShowUpdateModal(false);
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </BackButton>
          <Title>Vehicle Details</Title>
        </Header>
        <LoadingState>Loading...</LoadingState>
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </BackButton>
          <Title>Vehicle Details</Title>
        </Header>
        <LoadingState>Vehicle not found</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
        <Title>Vehicle Details</Title>
      </Header>

      <Content>
        <VehicleHeader>
          <VehicleIconWrapper>
            <FaCar />
          </VehicleIconWrapper>
          <VehicleInfo>
            <VehiclePlate>{vehicle.license_plate}</VehiclePlate>
            <VehicleMake>
              {vehicle.make || 'N/A'}
              <br />
              {vehicle.model || ''}
            </VehicleMake>
            <VehicleYear>{vehicle.year || 'N/A'}</VehicleYear>
          </VehicleInfo>
        </VehicleHeader>

        <DetailSection>
          <DetailRow>
            <DetailLabel>VIN</DetailLabel>
            <DetailValue>{vehicle.vin || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Mileage</DetailLabel>
            <DetailValue>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}</DetailValue>
          </DetailRow>
        </DetailSection>

        <StatsSection>
          <StatBox>
            <StatNumber>{serviceHistory.length}</StatNumber>
            <StatLabel>Services</StatLabel>
          </StatBox>
          <StatBox>
            <StatNumber>{serviceHistory.length}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </StatBox>
          <StatBox>
            <StatNumber>{vehicle.year || 'N/A'}</StatNumber>
            <StatLabel>Year</StatLabel>
          </StatBox>
        </StatsSection>

        <SectionTitle>Service History</SectionTitle>
        
        {serviceHistory.length === 0 ? (
          <ServiceHistoryItem>
            <ServiceInfo>
              <ServiceName>No service history found</ServiceName>
              <ServiceDate>This vehicle has no completed services yet</ServiceDate>
            </ServiceInfo>
          </ServiceHistoryItem>
        ) : (
          serviceHistory.map((service, index) => (
            <ServiceHistoryItem key={service.id || index}>
              <ServiceIcon>
                <FaCheckCircle />
              </ServiceIcon>
              <ServiceInfo>
                <ServiceName>{service.service_name}</ServiceName>
                <ServiceDate>
                  📅 {new Date(service.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • {' '}
                  <StatusBadge>Completed</StatusBadge>
                </ServiceDate>
              </ServiceInfo>
              <ServicePrice>{Number(service.price).toLocaleString('vi-VN')} VND</ServicePrice>
            </ServiceHistoryItem>
          ))
        )}

        <SecondaryButton onClick={handleUpdateVehicle}>
          Update Vehicle Info
        </SecondaryButton>
      </Content>

      {showUpdateModal && (
        <ModalOverlay onClick={cancelUpdateVehicle}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Update Vehicle Information</ModalTitle>
            
            <FormGroup>
              <Label>License Plate</Label>
              <Input
                type="text"
                placeholder="Enter license plate"
                value={updateData.license_plate}
                onChange={(e) => handleUpdateInputChange('license_plate', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Make</Label>
              <Input
                type="text"
                placeholder="e.g., Toyota, Honda"
                value={updateData.make}
                onChange={(e) => handleUpdateInputChange('make', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Model</Label>
              <Input
                type="text"
                placeholder="e.g., Camry, Civic"
                value={updateData.model}
                onChange={(e) => handleUpdateInputChange('model', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Year</Label>
              <Input
                type="number"
                placeholder="e.g., 2020"
                value={updateData.year}
                onChange={(e) => handleUpdateInputChange('year', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Mileage (km)</Label>
              <Input
                type="number"
                placeholder="Current mileage"
                value={updateData.mileage}
                onChange={(e) => handleUpdateInputChange('mileage', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Note</Label>
              <TextArea
                placeholder="Additional notes about the vehicle"
                value={updateData.note}
                onChange={(e) => handleUpdateInputChange('note', e.target.value)}
              />
            </FormGroup>
            
            <ModalButtons>
              <ModalButton onClick={cancelUpdateVehicle}>Cancel</ModalButton>
              <ModalButton $primary onClick={submitUpdateVehicle}>Update Vehicle</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CustomerVehicleDetails;
