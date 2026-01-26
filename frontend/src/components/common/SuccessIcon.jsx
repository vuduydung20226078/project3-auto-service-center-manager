import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';

const checkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const circleAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.$marginBottom || '24px'};
`;

const IconWrapper = styled.div`
  width: ${props => props.$size || '120px'};
  height: ${props => props.$size || '120px'};
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.$iconSize || '60px'};
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
  animation: ${props => props.$animated ? circleAnimation : 'none'} 0.5s ease-out;

  svg {
    animation: ${props => props.$animated ? checkAnimation : 'none'} 0.6s ease-out 0.3s both;
  }
`;

const SuccessIcon = ({ 
  size = '120px',
  iconSize = '60px',
  marginBottom = '24px',
  animated = true
}) => {
  return (
    <IconContainer $marginBottom={marginBottom}>
      <IconWrapper 
        $size={size} 
        $iconSize={iconSize}
        $animated={animated}
      >
        <FaCheckCircle />
      </IconWrapper>
    </IconContainer>
  );
};

export default SuccessIcon;
