import React from 'react';
import styled from 'styled-components';

const InfoRowContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: ${props => props.$padding || '12px 0'};
  border-bottom: ${props => props.$noBorder ? 'none' : '1px solid #f0f0f0'};

  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: ${props => props.$bgColor || '#f5f5f5'};
  color: ${props => props.$color || '#5b67f1'};
  font-size: 18px;
  flex-shrink: 0;
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const Label = styled.div`
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
  font-weight: 500;
`;

const Value = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: ${props => props.$bold ? '600' : '400'};
  word-wrap: break-word;
`;

const InfoRow = ({ 
  icon, 
  label, 
  value, 
  iconBgColor, 
  iconColor,
  boldValue,
  padding,
  noBorder,
  className 
}) => {
  return (
    <InfoRowContainer $padding={padding} $noBorder={noBorder} className={className}>
      {icon && (
        <IconWrapper $bgColor={iconBgColor} $color={iconColor}>
          {icon}
        </IconWrapper>
      )}
      <ContentWrapper>
        {label && <Label>{label}</Label>}
        {value && <Value $bold={boldValue}>{value}</Value>}
      </ContentWrapper>
    </InfoRowContainer>
  );
};

export default InfoRow;
