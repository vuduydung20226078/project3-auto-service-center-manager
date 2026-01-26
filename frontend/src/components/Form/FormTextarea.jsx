import React from 'react';
import styled from 'styled-components';

const TextareaWrapper = styled.div`
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

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => {
    if (props.$error) return '#c5192d';
    if (props.$success) return '#0f8419';
    return '#e0e0e0';
  }};
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  font-family: inherit;
  resize: ${props => props.$resize || 'vertical'};
  min-height: ${props => props.$minHeight || '120px'};
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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`;

const ErrorMessage = styled.div`
  font-size: 13px;
  color: #c5192d;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HelperText = styled.div`
  font-size: 13px;
  color: #666;
`;

const CharCounter = styled.div`
  font-size: 13px;
  color: ${props => props.$isOverLimit ? '#c5192d' : '#999'};
  font-weight: 500;
`;

const FormTextarea = ({ 
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  success,
  helperText,
  placeholder,
  required,
  disabled,
  rows,
  maxLength,
  showCharCount = false,
  resize = 'vertical',
  minHeight,
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

  const charCount = value ? value.length : 0;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <TextareaWrapper $fullWidth={fullWidth} $marginBottom={marginBottom} className={className}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </Label>
      )}
      <StyledTextarea
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        $error={!!error}
        $success={success && !error}
        $disabled={disabled}
        $resize={resize}
        $minHeight={minHeight}
      />
      <Footer>
        <div>
          {error && <ErrorMessage>⚠ {error}</ErrorMessage>}
          {!error && helperText && <HelperText>{helperText}</HelperText>}
        </div>
        {showCharCount && maxLength && (
          <CharCounter $isOverLimit={isOverLimit}>
            {charCount}/{maxLength}
          </CharCounter>
        )}
      </Footer>
    </TextareaWrapper>
  );
};

export default FormTextarea;
