import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  animation: ${props => props.$closing ? slideOut : slideIn} 0.3s ease;
  border-left: 4px solid ${props => props.$color};

  @media (max-width: 768px) {
    min-width: 280px;
    max-width: calc(100vw - 48px);
    right: 12px;
    top: 12px;
  }
`;

const Icon = styled.div`
  font-size: 20px;
  color: ${props => props.$color};
  flex-shrink: 0;
`;

const Message = styled.div`
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
`;

const TYPE_CONFIG = {
  success: {
    icon: FaCheckCircle,
    color: '#52c41a'
  },
  error: {
    icon: FaExclamationCircle,
    color: '#ff4d4f'
  },
  warning: {
    icon: FaExclamationTriangle,
    color: '#faad14'
  },
  info: {
    icon: FaInfoCircle,
    color: '#1890ff'
  }
};

const Toast = ({ message, type = 'info', onClose }) => {
  const [closing, setClosing] = useState(false);
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const IconComponent = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastWrapper $closing={closing} $color={config.color}>
      <Icon $color={config.color}>
        <IconComponent />
      </Icon>
      <Message>{message}</Message>
    </ToastWrapper>
  );
};

export default Toast;
