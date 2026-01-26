import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';
import FormCheckbox from './FormCheckbox';

const ConfirmationContainer = styled.div`
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border: 2px solid #667eea30;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const ConfirmationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  margin: 0 auto 16px;
`;

const ConfirmationText = styled.div`
  text-align: center;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;

  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #c5192d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const TermsConfirmation = ({ 
  agreed,
  onChange,
  error
}) => {
  return (
    <ConfirmationContainer>
      <ConfirmationIcon>
        <FaCheckCircle />
      </ConfirmationIcon>
      
      <ConfirmationText>
        By confirming this booking, you agree to our{' '}
        <a href="/terms" target="_blank">terms of service</a>.{' '}
        We'll send a confirmation email and may contact you to confirm your appointment.
      </ConfirmationText>

      <CheckboxWrapper>
        <FormCheckbox
          name="termsAgreed"
          checked={agreed}
          onChange={(name, value) => onChange(value)}
          label="I agree to the terms and conditions"
        />
      </CheckboxWrapper>

      {error && (
        <ErrorMessage>
          ⚠ {error}
        </ErrorMessage>
      )}
    </ConfirmationContainer>
  );
};

export default TermsConfirmation;
