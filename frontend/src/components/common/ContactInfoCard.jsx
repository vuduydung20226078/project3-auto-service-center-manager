import React from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import InfoRow from './InfoRow';

const CardContainer = styled.div`
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

const ContactInfoCard = ({ name, email, phone }) => {
  return (
    <CardContainer>
      <CardTitle>Contact Information</CardTitle>
      <InfoRow
        icon={<FaUser />}
        label="Name"
        value={name}
        iconBgColor="#10b98115"
        iconColor="#10b981"
        boldValue
      />
      <InfoRow
        icon={<FaEnvelope />}
        label="Email"
        value={email}
        iconBgColor="#10b98115"
        iconColor="#10b981"
      />
      <InfoRow
        icon={<FaPhone />}
        label="Phone"
        value={phone}
        iconBgColor="#10b98115"
        iconColor="#10b981"
        noBorder
      />
    </CardContainer>
  );
};

export default ContactInfoCard;
