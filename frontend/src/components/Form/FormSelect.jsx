import React from 'react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  margin-bottom: ${props => props.$marginBottom || '20px'};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;

  span.required {
    color: #c5192d;
    margin-left: 4px;
  }
`;

const SelectContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 2px solid ${props => {
    if (props.$error) return '#c5192d';
    if (props.$success) return '#0f8419';
    return '#e0e0e0';
  }};
  border-radius: 8px;
  font-size: 14px;
  color: ${props => props.value ? '#333' : '#999'};
  transition: all 0.3s ease;
  background-color: ${props => props.$disabled ? '#f5f5f5' : 'white'};
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#c5192d' : '#5b67f1'};
    box-shadow: 0 0 0 3px ${props => props.$error ? '#c5192d15' : '#5b67f115'};
  }

  &:disabled {
    cursor: not-allowed;
    color: #999;
  }

  option {
    color: #333;
  }
`;

const ArrowIcon = styled.div`
  position: absolute;
  right: 14px;
  pointer-events: none;
  color: #666;
  font-size: 12px;
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

const FormSelect = ({ 
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  success,
  helperText,
  placeholder = 'Select an option',
  required,
  disabled,
  options = [],
  fullWidth = true,
  marginBottom,
  className
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(name);
    }
  };

  return (
    <SelectWrapper $fullWidth={fullWidth} $marginBottom={marginBottom} className={className}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </Label>
      )}
      <SelectContainer>
        <StyledSelect
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          $error={!!error}
          $success={success && !error}
          $disabled={disabled}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option, index) => (
            <option 
              key={option.value || index} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </StyledSelect>
        <ArrowIcon>▼</ArrowIcon>
      </SelectContainer>
      {error && <ErrorMessage>⚠ {error}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </SelectWrapper>
  );
};

export default FormSelect;
