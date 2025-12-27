import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: ${props => props.$padding || '20px'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.$noHover ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 4px 12px rgba(0, 0, 0, 0.12)'};
  }
`;

const CardHeader = styled.div`
  margin-bottom: ${props => props.$hasBody ? '16px' : '0'};
  padding-bottom: ${props => props.$hasBody ? '12px' : '0'};
  border-bottom: ${props => props.$hasBody ? '1px solid #e0e0e0' : 'none'};
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.$size || '18px'};
  font-weight: 700;
  color: #333;
`;

const CardSubtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #999;
`;

const CardBody = styled.div`
  color: #666;
`;

const Card = ({ 
  title, 
  subtitle, 
  children, 
  padding,
  titleSize,
  noHover,
  className,
  style 
}) => {
  return (
    <CardContainer 
      $padding={padding} 
      $noHover={noHover}
      className={className}
      style={style}
    >
      {(title || subtitle) && (
        <CardHeader $hasBody={!!children}>
          {title && <CardTitle $size={titleSize}>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      {children && <CardBody>{children}</CardBody>}
    </CardContainer>
  );
};

export default Card;
