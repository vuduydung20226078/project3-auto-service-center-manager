import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCar, FaTachometerAlt, FaPlus } from 'react-icons/fa';
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

const AddButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1d4ed8;
  }
`;

const VehiclesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const VehicleCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const VehicleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const VehicleIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background: #dbeafe;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-size: 24px;
  flex-shrink: 0;
`;

const VehicleInfo = styled.div`
  flex: 1;
`;

const VehiclePlate = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const VehicleMake = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 2px;
`;

const VehicleColor = styled.div`
  font-size: 12px;
  color: #999;
`;

const VehicleStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
`;

const StatIcon = styled.div`
  color: #666;
  font-size: 16px;
`;

const StatText = styled.div`
  font-size: 14px;
  color: #666;
`;

const ServiceHistory = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const HistoryLink = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
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

const CustomerVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    mileage: '',
    note: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehiclesApi.getAll();
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setShowAddModal(true);
  };

  const handleVehicleInputChange = (field, value) => {
    setNewVehicle(prev => ({ ...prev, [field]: value }));
  };

  const submitAddVehicle = async () => {
    try {
      if (!newVehicle.license_plate || !newVehicle.license_plate.trim()) {
        toast.error('License plate is required');
        return;
      }

      const vehicleData = {
        license_plate: newVehicle.license_plate.trim(),
        make: newVehicle.make.trim() || null,
        model: newVehicle.model.trim() || null,
        year: newVehicle.year ? parseInt(newVehicle.year) : null,
        vin: newVehicle.vin.trim() || null,
        mileage: newVehicle.mileage ? parseInt(newVehicle.mileage) : null,
        note: newVehicle.note.trim() || null
      };

      await vehiclesApi.create(vehicleData);
      toast.success('Vehicle added successfully');
      setShowAddModal(false);
      setNewVehicle({
        license_plate: '',
        make: '',
        model: '',
        year: '',
        vin: '',
        mileage: '',
        note: ''
      });
      fetchVehicles();
    } catch (err) {
      console.error('Failed to add vehicle', err);
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const cancelAddVehicle = () => {
    setShowAddModal(false);
    setNewVehicle({
      license_plate: '',
      make: '',
      model: '',
      year: '',
      vin: '',
      mileage: '',
      note: ''
    });
  };

  const handleViewHistory = (vehicleId) => {
    navigate(`/customer/vehicles/${vehicleId}`);
  };

  const formatMileage = (mileage) => {
    if (!mileage) return 'N/A';
    return `${mileage.toLocaleString()} km`;
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
        <AddButton onClick={handleAddVehicle}>
          <FaPlus /> Add Vehicle
        </AddButton>

        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : vehicles.length === 0 ? (
          <EmptyState>No vehicles found. Add your first vehicle!</EmptyState>
        ) : (
          <VehiclesList>
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} onClick={() => navigate(`/customer/vehicles/${vehicle.id}`)} style={{ cursor: 'pointer' }}>
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
                    <VehicleColor>{vehicle.year || 'N/A'}</VehicleColor>
                  </VehicleInfo>
                </VehicleHeader>

                <VehicleStats>
                  <StatIcon><FaTachometerAlt /></StatIcon>
                  <StatText>
                    Mileage<br />
                    {formatMileage(vehicle.mileage)}
                  </StatText>
                </VehicleStats>

                <ServiceHistory>
                  <HistoryLabel>Service History</HistoryLabel>
                  <HistoryLink onClick={(e) => { e.stopPropagation(); handleViewHistory(vehicle.id); }}>
                    4 services
                  </HistoryLink>
                </ServiceHistory>
              </VehicleCard>
            ))}
          </VehiclesList>
        )}
      </Content>

      {showAddModal && (
        <ModalOverlay onClick={cancelAddVehicle}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Add New Vehicle</ModalTitle>
            
            <FormGroup>
              <Label>License Plate *</Label>
              <Input
                type="text"
                placeholder="Enter license plate"
                value={newVehicle.license_plate}
                onChange={(e) => handleVehicleInputChange('license_plate', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Make</Label>
              <Input
                type="text"
                placeholder="e.g., Toyota, Honda"
                value={newVehicle.make}
                onChange={(e) => handleVehicleInputChange('make', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Model</Label>
              <Input
                type="text"
                placeholder="e.g., Camry, Civic"
                value={newVehicle.model}
                onChange={(e) => handleVehicleInputChange('model', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Year</Label>
              <Input
                type="number"
                placeholder="e.g., 2020"
                value={newVehicle.year}
                onChange={(e) => handleVehicleInputChange('year', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>VIN</Label>
              <Input
                type="text"
                placeholder="Vehicle Identification Number"
                value={newVehicle.vin}
                onChange={(e) => handleVehicleInputChange('vin', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Mileage (km)</Label>
              <Input
                type="number"
                placeholder="Current mileage"
                value={newVehicle.mileage}
                onChange={(e) => handleVehicleInputChange('mileage', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Note</Label>
              <TextArea
                placeholder="Additional notes about the vehicle"
                value={newVehicle.note}
                onChange={(e) => handleVehicleInputChange('note', e.target.value)}
              />
            </FormGroup>
            
            <ModalButtons>
              <ModalButton onClick={cancelAddVehicle}>Cancel</ModalButton>
              <ModalButton $primary onClick={submitAddVehicle}>Add Vehicle</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CustomerVehicles;
