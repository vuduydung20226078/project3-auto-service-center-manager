import React from 'react';
import styled from 'styled-components';

const CheckboxWrapper = styled.div`
  margin-bottom: ${props => props.$marginBottom || '16px'};
  display: flex;
  align-items: ${props => props.$alignTop ? 'flex-start' : 'center'};
  gap: 10px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.6 : 1};
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => {
    if (props.$error) return '#c5192d';
    if (props.$checked) return '#5b67f1';
    return '#ddd';
  }};
  border-radius: 4px;
  background-color: ${props => props.$checked ? '#5b67f1' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: ${props => props.$alignTop ? '2px' : '0'};

  &:hover {
    border-color: ${props => props.$disabled ? '#ddd' : '#5b67f1'};
  }

  svg {
    color: white;
    font-size: 14px;
    opacity: ${props => props.$checked ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path 
      d="M11.6666 3.5L5.24998 9.91667L2.33331 7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const LabelText = styled.label`
  font-size: 14px;
  color: #333;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  user-select: none;
  line-height: 1.5;

  a {
    color: #5b67f1;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 4px;
  margin-left: 30px;
  font-size: 13px;
  color: #c5192d;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FormCheckbox = ({ 
  label,
  name,
  checked,
  onChange,
  error,
  disabled,
  marginBottom,
  alignTop,
  className
}) => {
  const handleChange = (e) => {
    if (onChange && !disabled) {
      onChange(name, e.target.checked);
    }
  };

  const handleClick = () => {
    if (onChange && !disabled) {
      onChange(name, !checked);
    }
  };

  return (
    <>
      <CheckboxWrapper 
        $marginBottom={marginBottom} 
        $disabled={disabled}
        $alignTop={alignTop}
        className={className}
        onClick={handleClick}
      >
        <HiddenCheckbox
          id={name}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <StyledCheckbox 
          $checked={checked} 
          $error={!!error}
          $disabled={disabled}
          $alignTop={alignTop}
        >
          <CheckIcon />
        </StyledCheckbox>
        {label && (
          <LabelText 
            htmlFor={name}
            $disabled={disabled}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        )}
      </CheckboxWrapper>
      {error && <ErrorMessage>⚠ {error}</ErrorMessage>}
    </>
  );
};

export default FormCheckbox;
