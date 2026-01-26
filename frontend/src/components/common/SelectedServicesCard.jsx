import React from 'react';
import styled from 'styled-components';
import { FaClock } from 'react-icons/fa';

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

const ServicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  gap: 12px;
`;

const ServiceLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const ServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.$bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const ServiceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ServiceName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ServiceDuration = styled.div`
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 11px;
  }
`;

const ServicePrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
  white-space: nowrap;
`;

const TotalBar = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-top: 16px;
`;

const TotalLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
`;

const TotalPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const SelectedServicesCard = ({ services = [] }) => {
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const totalPrice = services.reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <CardContainer>
      <CardTitle>Selected Services</CardTitle>
      <ServicesList>
        {services.map((service) => (
          <ServiceItem key={service.id}>
            <ServiceLeft>
              <ServiceIcon $bgColor={service.iconBgColor}>
                {service.icon || '🔧'}
              </ServiceIcon>
              <ServiceInfo>
                <ServiceName>{service.name}</ServiceName>
                <ServiceDuration>
                  <FaClock />
                  {formatDuration(service.duration)}
                </ServiceDuration>
              </ServiceInfo>
            </ServiceLeft>
            <ServicePrice>{service.price.toFixed(0)} VND</ServicePrice>
          </ServiceItem>
        ))}
      </ServicesList>
      <TotalBar>
        <TotalLabel>Estimated Total:</TotalLabel>
        <TotalPrice>{totalPrice.toFixed(0)} VND</TotalPrice>
      </TotalBar>
    </CardContainer>
  );
};

export default SelectedServicesCard;
