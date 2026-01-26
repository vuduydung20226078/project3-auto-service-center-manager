import React from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
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

const AppointmentDetailsCard = ({ date, time }) => {
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <CardContainer>
      <CardTitle>Appointment Details</CardTitle>
      <InfoRow
        icon={<FaCalendarAlt />}
        label="Date"
        value={formatDate(date)}
        iconBgColor="#667eea15"
        iconColor="#667eea"
        noBorder={false}
      />
      <InfoRow
        icon={<FaClock />}
        label="Time"
        value={time}
        iconBgColor="#667eea15"
        iconColor="#667eea"
        noBorder
      />
    </CardContainer>
  );
};

export default AppointmentDetailsCard;
