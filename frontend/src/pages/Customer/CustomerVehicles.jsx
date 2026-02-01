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

const CustomerVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

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
    toast.info('Add vehicle feature coming soon!');
  };

  const handleViewHistory = (vehicleId) => {
    toast.info('Service history coming soon!');
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
              <VehicleCard key={vehicle.vehicle_id}>
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
                  <HistoryLink onClick={() => handleViewHistory(vehicle.vehicle_id)}>
                    4 services
                  </HistoryLink>
                </ServiceHistory>
              </VehicleCard>
            ))}
          </VehiclesList>
        )}
      </Content>
    </Container>
  );
};

export default CustomerVehicles;
