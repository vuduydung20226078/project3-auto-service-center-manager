import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${props => props.$size === 'small' ? '8px 16px' : props.$size === 'large' ? '14px 28px' : '12px 24px'};
  background-color: ${props => {
    if (props.$variant === 'primary') return props.$color || '#5b67f1';
    if (props.$variant === 'secondary') return 'transparent';
    if (props.$variant === 'outline') return 'transparent';
    if (props.$variant === 'danger') return '#c5192d';
    if (props.$variant === 'success') return '#0f8419';
    if (props.$variant === 'warning') return '#f57c00';
    if (props.$variant === 'ghost') return 'transparent';
    return '#f0f0f0';
  }};
  color: ${props => {
    if (props.$variant === 'secondary') return '#666';
    if (props.$variant === 'outline') return props.$color || '#5b67f1';
    if (props.$variant === 'ghost') return '#666';
    return 'white';
  }};
  border: ${props => {
    if (props.$variant === 'outline') return `2px solid ${props.$color || '#5b67f1'}`;
    if (props.$variant === 'secondary') return '2px solid #ddd';
    return 'none';
  }};
  border-radius: ${props => props.$rounded ? '50px' : '8px'};
  cursor: pointer;
  font-weight: 600;
  font-size: ${props => props.$size === 'small' ? '13px' : '14px'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: ${props => props.$fullWidth ? '100%' : 'auto'};
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: ${props => {
      if (props.$variant === 'primary') return '#4a56d9';
      if (props.$variant === 'secondary') return '#f5f5f5';
      if (props.$variant === 'outline') return props.$color ? `${props.$color}10` : '#5b67f110';
      if (props.$variant === 'danger') return '#a01525';
      if (props.$variant === 'success') return '#0a6812';
      if (props.$variant === 'warning') return '#d66900';
      if (props.$variant === 'ghost') return '#f5f5f5';
      return '#e0e0e0';
    }};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${props => props.$variant === 'outline' || props.$variant === 'ghost' ? 'transparent' : '#ccc'};
    color: #999;
    border-color: ${props => props.$variant === 'outline' ? '#ddd' : 'none'};
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
  rounded,
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
      $rounded={rounded}
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
