import React from 'react';
import styled from 'styled-components';

const SummaryBar = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 30px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  @media (max-width: 768px) {
    padding: 16px 20px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ServiceCount = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TotalLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  opacity: 0.9;
`;

const TotalPrice = styled.span`
  font-size: 28px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ServiceSelectionSummary = ({ 
  selectedCount,
  totalPrice
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <SummaryBar>
      <LeftSection>
        <ServiceCount>{selectedCount}</ServiceCount>
        <span>{selectedCount === 1 ? 'service' : 'services'} selected</span>
      </LeftSection>
      <RightSection>
        <TotalLabel>Total:</TotalLabel>
        <TotalPrice>{totalPrice.toFixed(0)} VND</TotalPrice>
      </RightSection>
    </SummaryBar>
  );
};

export default ServiceSelectionSummary;
