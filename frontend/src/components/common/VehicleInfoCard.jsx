import React from 'react';
import styled from 'styled-components';
import { FaCar, FaIdCard, FaTachometerAlt } from 'react-icons/fa';
import InfoRow from './InfoRow';

const CardContainer = styled.div`
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

const VehicleTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const VehicleTitleIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
`;

const VehicleTitleText = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

const VehicleInfoCard = ({ make, model, year, licensePlate, mileage }) => {
  const vehicleName = `${year} ${make} ${model}`;

  return (
    <CardContainer>
      <CardTitle>Vehicle Information</CardTitle>
      
      <VehicleTitle>
        <VehicleTitleIcon>
          <FaCar />
        </VehicleTitleIcon>
        <VehicleTitleText>{vehicleName}</VehicleTitleText>
      </VehicleTitle>

      <InfoRow
        icon={<FaIdCard />}
        label="License Plate"
        value={licensePlate}
        iconBgColor="#f59e0b15"
        iconColor="#f59e0b"
      />
      
      {mileage && (
        <InfoRow
          icon={<FaTachometerAlt />}
          label="Mileage"
          value={`${mileage.toLocaleString()} miles`}
          iconBgColor="#f59e0b15"
          iconColor="#f59e0b"
          noBorder
        />
      )}
    </CardContainer>
  );
};

export default VehicleInfoCard;
