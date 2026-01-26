import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: ${props => props.$marginBottom || '20px'};
  padding-bottom: ${props => props.$noBorder ? '0' : '12px'};
  border-bottom: ${props => props.$noBorder ? 'none' : '2px solid #f0f0f0'};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${props => props.$bgColor || '#5b67f110'};
  color: ${props => props.$color || '#5b67f1'};
  font-size: 20px;
`;

const TitleWrapper = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${props => props.$size || '18px'};
  font-weight: 700;
  color: #333;
`;

const Subtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #999;
`;

const SectionHeader = ({ 
  icon, 
  title, 
  subtitle,
  iconBgColor,
  iconColor,
  titleSize,
  marginBottom,
  noBorder,
  className,
  rightContent
}) => {
  return (
    <HeaderContainer 
      $marginBottom={marginBottom} 
      $noBorder={noBorder}
      className={className}
    >
      {icon && (
        <IconWrapper $bgColor={iconBgColor} $color={iconColor}>
          {icon}
        </IconWrapper>
      )}
      <TitleWrapper>
        {title && <Title $size={titleSize}>{title}</Title>}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleWrapper>
      {rightContent}
    </HeaderContainer>
  );
};

export default SectionHeader;
