import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { FaArrowRight } from 'react-icons/fa';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #f0f0f0;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 12px;
  }
`;

const BackButton = styled(Button)`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ContinueButton = styled(Button)`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const NavigationButtons = ({ 
  onBack,
  onContinue,
  continueText = 'Continue',
  backText = 'Back',
  showBack = true,
  continueDisabled = false,
  continueIcon = <FaArrowRight />,
  loading = false
}) => {
  return (
    <ButtonContainer>
      {showBack ? (
        <BackButton
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          {backText}
        </BackButton>
      ) : (
        <div></div>
      )}
      
      <ContinueButton
        variant="primary"
        onClick={onContinue}
        disabled={continueDisabled || loading}
        icon={continueIcon}
      >
        {loading ? 'Processing...' : continueText}
      </ContinueButton>
    </ButtonContainer>
  );
};

export default NavigationButtons;
