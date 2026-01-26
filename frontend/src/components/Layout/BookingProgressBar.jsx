import React from 'react';
import styled from 'styled-components';
import { FaCheck } from 'react-icons/fa';

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 0 20px;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 10px;
    margin-bottom: 30px;
  }
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 20px;
  left: 60px;
  right: 60px;
  height: 3px;
  background: #e0e0e0;
  z-index: 0;

  @media (max-width: 768px) {
    left: 40px;
    right: 40px;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.4s ease;
  width: ${props => props.$width}%;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: transform 0.2s;

  &:hover {
    transform: ${props => props.$clickable ? 'scale(1.05)' : 'none'};
  }

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: ${props => {
    if (props.$completed) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (props.$active) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    return 'white';
  }};
  background: ${props => {
    if (props.$completed) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (props.$active) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    return 'white';
  }};
  color: ${props => {
    if (props.$completed || props.$active) return 'white';
    return '#999';
  }};
  border: 3px solid ${props => {
    if (props.$completed) return '#10b981';
    if (props.$active) return '#667eea';
    return '#e0e0e0';
  }};
  box-shadow: ${props => {
    if (props.$completed || props.$active) return '0 4px 12px rgba(0, 0, 0, 0.15)';
    return 'none';
  }};

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

const StepLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => {
    if (props.$completed || props.$active) return '#333';
    return '#999';
  }};
  text-align: center;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 11px;
    max-width: 80px;
    white-space: normal;
    line-height: 1.2;
  }
`;

const BookingProgressBar = ({ 
  currentStep = 1, 
  completedSteps = [],
  onStepClick 
}) => {
  const steps = [
    { number: 1, label: 'Select Services' },
    { number: 2, label: 'Choose Date & Time' },
    { number: 3, label: 'Your Information' },
    { number: 4, label: 'Review & Confirm' }
  ];

  const getProgressWidth = () => {
    const maxStep = Math.max(currentStep, ...completedSteps, 0);
    return ((maxStep - 1) / (steps.length - 1)) * 100;
  };

  const isStepClickable = (stepNumber) => {
    return stepNumber <= currentStep || completedSteps.includes(stepNumber);
  };

  const handleStepClick = (stepNumber) => {
    if (isStepClickable(stepNumber) && onStepClick) {
      onStepClick(stepNumber);
    }
  };

  return (
    <ProgressContainer>
      <ProgressLine>
        <ProgressFill $width={getProgressWidth()} />
      </ProgressLine>

      {steps.map((step) => {
        const isCompleted = completedSteps.includes(step.number);
        const isActive = currentStep === step.number;
        const isClickable = isStepClickable(step.number);

        return (
          <StepItem
            key={step.number}
            $clickable={isClickable}
            onClick={() => handleStepClick(step.number)}
          >
            <StepCircle
              $completed={isCompleted}
              $active={isActive}
            >
              {isCompleted ? <FaCheck /> : step.number}
            </StepCircle>
            <StepLabel $completed={isCompleted} $active={isActive}>
              {step.label}
            </StepLabel>
          </StepItem>
        );
      })}
    </ProgressContainer>
  );
};

export default BookingProgressBar;
