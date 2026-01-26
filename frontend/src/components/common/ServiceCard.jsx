import React from 'react';
import styled from 'styled-components';
import { FaCheck, FaClock } from 'react-icons/fa';

const CardContainer = styled.div`
  background: white;
  border: 2px solid ${props => props.$selected ? '#667eea' : '#e0e0e0'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  gap: 16px;
  align-items: flex-start;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  ${props => props.$selected && `
    background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  `}
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: ${props => props.$bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
`;

const ServiceName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
  white-space: nowrap;
`;

const Description = styled.p`
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #999;
`;

const DurationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #f5f5f5;
  border-radius: 20px;
  font-weight: 600;
  color: #666;

  svg {
    font-size: 12px;
  }
`;

const CheckmarkIcon = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.5});
  transition: all 0.3s ease;
`;

const ServiceCard = ({ 
  service,
  isSelected,
  onSelect
}) => {
  const {
    id,
    name,
    description,
    price,
    duration,
    icon,
    iconBgColor
  } = service;

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <CardContainer
      $selected={isSelected}
      onClick={() => onSelect(service)}
    >
      <IconWrapper $bgColor={iconBgColor}>
        {icon || '🔧'}
      </IconWrapper>

      <ContentWrapper>
        <Header>
          <ServiceName>{name}</ServiceName>
          <Price>{price.toFixed(0)} VND</Price>
        </Header>

        {description && (
          <Description>{description}</Description>
        )}

        <Footer>
          <DurationBadge>
            <FaClock />
            {formatDuration(duration)}
          </DurationBadge>
        </Footer>
      </ContentWrapper>

      <CheckmarkIcon $visible={isSelected}>
        <FaCheck />
      </CheckmarkIcon>
    </CardContainer>
  );
};

export default ServiceCard;
