import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
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

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: ${props => props.$hasIcon ? '44px' : '16px'};
  border: 2px solid ${props => {
    if (props.$error) return '#c5192d';
    if (props.$success) return '#0f8419';
    return '#e0e0e0';
  }};
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  background-color: ${props => props.$disabled ? '#f5f5f5' : 'white'};

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#c5192d' : '#5b67f1'};
    box-shadow: 0 0 0 3px ${props => props.$error ? '#c5192d15' : '#5b67f115'};
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    cursor: not-allowed;
    color: #999;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    if (props.$error) return '#c5192d';
    if (props.$success) return '#0f8419';
    return '#999';
  }};
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

const FormInput = ({ 
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  success,
  helperText,
  placeholder,
  type = 'text',
  required,
  disabled,
  icon,
  successIcon,
  fullWidth = true,
  marginBottom,
  className,
  autoComplete
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

  const showIcon = icon || (success && successIcon);

  return (
    <InputWrapper $fullWidth={fullWidth} $marginBottom={marginBottom} className={className}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </Label>
      )}
      <InputContainer>
        <StyledInput
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          $error={!!error}
          $success={success && !error}
          $hasIcon={!!showIcon}
          $disabled={disabled}
          autoComplete={autoComplete}
        />
        {showIcon && (
          <IconWrapper $error={!!error} $success={success && !error}>
            {error ? icon : success ? successIcon : icon}
          </IconWrapper>
        )}
      </InputContainer>
      {error && <ErrorMessage>⚠ {error}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
};

export default FormInput;
