import React from 'react';
import styled from 'styled-components';

const StatCardContainer = styled.div`
  padding: 24px;
  background: ${props => props.$bgColor || '#f5f5f5'};
  border-radius: 12px;
  border-left: 5px solid ${props => props.$borderColor || '#4c00b4'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};

  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$clickable ? '0 4px 12px rgba(0, 0, 0, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: ${props => props.$size || '32px'};
  font-weight: 700;
  color: ${props => props.$color || '#333'};
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    font-size: 28px;
    opacity: 0.9;
  }
`;

const StatChange = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: ${props => props.$isPositive ? '#0f8419' : '#c5192d'};
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '${props => props.$isPositive ? '↑' : '↓'}';
    font-weight: 700;
  }
`;

const StatCard = ({ 
  label, 
  value, 
  icon, 
  bgColor, 
  borderColor, 
  valueColor,
  valueSize,
  change,
  changeIsPositive,
  onClick,
  style 
}) => {
  return (
    <StatCardContainer 
      $bgColor={bgColor} 
      $borderColor={borderColor}
      $clickable={!!onClick}
      onClick={onClick}
      style={style}
    >
      <StatLabel>
        {label}
      </StatLabel>
      <StatValue $color={valueColor} $size={valueSize}>
        {icon}
        {value}
      </StatValue>
      {change !== undefined && (
        <StatChange $isPositive={changeIsPositive}>
          {Math.abs(change)}% vs last period
        </StatChange>
      )}
    </StatCardContainer>
  );
};

export default StatCard;
