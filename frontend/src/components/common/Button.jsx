import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${props => props.$size === 'small' ? '8px 16px' : props.$size === 'large' ? '14px 28px' : '12px 24px'};
  background-color: ${props => {
    if (props.$variant === 'primary') return props.$color || '#4c00b4';
    if (props.$variant === 'danger') return '#c5192d';
    if (props.$variant === 'success') return '#0f8419';
    if (props.$variant === 'warning') return '#f57c00';
    return '#f0f0f0';
  }};
  color: ${props => props.$variant === 'secondary' ? '#666' : 'white'};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: ${props => props.$size === 'small' ? '13px' : '14px'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: ${props => props.$fullWidth ? '100%' : 'auto'};

  &:hover:not(:disabled) {
    background-color: ${props => {
      if (props.$variant === 'primary') return '#3c009d';
      if (props.$variant === 'danger') return '#a01525';
      if (props.$variant === 'success') return '#0a6812';
      if (props.$variant === 'warning') return '#d66900';
      return '#e0e0e0';
    }};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    font-size: ${props => props.$size === 'small' ? '14px' : '16px'};
  }
`;

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  color,
  fullWidth,
  icon,
  onClick,
  disabled,
  type = 'button',
  className,
  style 
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $color={color}
      $fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      style={style}
    >
      {icon}
      {children}
    </StyledButton>
  );
};

export default Button;
