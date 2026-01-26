import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader';
import DatePicker from '../common/DatePicker';
import TimeSlotSelector from '../common/TimeSlotSelector';
import { useBooking } from '../../contexts/BookingContext';

const Container = styled.div`
  width: 100%;
`;

const ContentSection = styled.div`
  margin-top: 24px;
`;

const InfoBox = styled.div`
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border: 2px solid #667eea20;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  svg {
    color: #667eea;
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const InfoText = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 6px 0;
    font-size: 15px;
    font-weight: 700;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #666;
    line-height: 1.5;
  }
`;

const Step2DateTimeSelection = () => {
  const { selectedDate, selectedTime, setDateTime } = useBooking();
  
  const [date, setDate] = useState(selectedDate || '');
  const [time, setTime] = useState(selectedTime || '');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');

  // Generate time slots (8 AM - 5 PM, hourly)
  const generateTimeSlots = (selectedDate) => {
    const slots = [];
    const hours = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    // Simulate some booked slots
    const bookedSlots = ['11:00 AM', '03:00 PM'];

    hours.forEach(hour => {
      slots.push({
        time: hour,
        booked: bookedSlots.includes(hour)
      });
    });

    return slots;
  };

  useEffect(() => {
    if (date) {
      const slots = generateTimeSlots(date);
      setAvailableSlots(slots);
      setDateError('');
    } else {
      setAvailableSlots([]);
    }
  }, [date]);

  useEffect(() => {
    // Update context whenever date or time changes
    if (date && time) {
      setDateTime(date, time);
      setTimeError('');
    }
  }, [date, time, setDateTime]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (newTime) => {
    setTime(newTime);
  };

  return (
    <Container>
      <SectionHeader
        icon={<FaCalendarAlt />}
        title="Choose Date & Time"
        subtitle="Select your preferred appointment date and time"
      />

      <ContentSection>
        <InfoBox>
          <FaCalendarAlt />
          <InfoText>
            <h4>Business Hours</h4>
            <p>
              Monday - Friday: 8:00 AM - 6:00 PM<br />
              Saturday: 9:00 AM - 4:00 PM<br />
              Sunday: Closed
            </p>
          </InfoText>
        </InfoBox>

        <DatePicker
          label="Select Date"
          value={date}
          onChange={handleDateChange}
          error={dateError}
          helperText="Choose a date for your service appointment"
        />

        {date && (
          <TimeSlotSelector
            label="Select Time Slot"
            slots={availableSlots}
            selectedTime={time}
            onSelect={handleTimeSelect}
            error={timeError}
          />
        )}

        {!date && (
          <InfoBox style={{ marginTop: '20px' }}>
            <FaCalendarAlt />
            <InfoText>
              <p>Please select a date to view available time slots</p>
            </InfoText>
          </InfoBox>
        )}
      </ContentSection>
    </Container>
  );
};

export default Step2DateTimeSelection;
