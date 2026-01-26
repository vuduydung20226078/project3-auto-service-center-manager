import React from 'react';
import styled from 'styled-components';
import { FaCalendarAlt } from 'react-icons/fa';

const PickerWrapper = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;

  svg {
    color: #667eea;
    font-size: 16px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  padding-left: 44px;
  border: 2px solid ${props => props.$error ? '#c5192d' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 18px;
  pointer-events: none;
`;

const ErrorMessage = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #c5192d;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HelperText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #666;
`;

const DatePicker = ({ 
  label = 'Select Date',
  value,
  onChange,
  error,
  helperText,
  minDate,
  maxDate,
  disabledDates = []
}) => {
  const today = new Date().toISOString().split('T')[0];
  const min = minDate || today;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const isDateDisabled = (date) => {
    return disabledDates.some(disabled => 
      disabled.toISOString().split('T')[0] === date
    );
  };

  return (
    <PickerWrapper>
      <Label>
        <FaCalendarAlt />
        {label}
      </Label>
      <InputContainer>
        <IconWrapper>
          <FaCalendarAlt />
        </IconWrapper>
        <StyledInput
          type="date"
          value={value}
          onChange={handleChange}
          min={min}
          max={maxDate}
          $error={!!error}
        />
      </InputContainer>
      {error && <ErrorMessage>⚠ {error}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </PickerWrapper>
  );
};

export default DatePicker;
