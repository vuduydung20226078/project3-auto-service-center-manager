import React from 'react';
import styled from 'styled-components';
import { FaClock } from 'react-icons/fa';

const SelectorWrapper = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;

  svg {
    color: #667eea;
    font-size: 16px;
  }
`;

const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
`;

const SlotButton = styled.button`
  padding: 12px 16px;
  border: 2px solid ${props => {
    if (props.$selected) return '#667eea';
    if (props.$booked) return '#e0e0e0';
    return '#e0e0e0';
  }};
  border-radius: 8px;
  background: ${props => {
    if (props.$selected) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (props.$booked) return '#f5f5f5';
    return 'white';
  }};
  color: ${props => {
    if (props.$selected) return 'white';
    if (props.$booked) return '#999';
    return '#333';
  }};
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.$booked ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  text-align: center;

  &:hover:not(:disabled) {
    transform: ${props => props.$booked ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$booked ? 'none' : '0 4px 8px rgba(102, 126, 234, 0.2)'};
    border-color: ${props => props.$booked ? '#e0e0e0' : '#667eea'};
  }

  &:disabled {
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const SlotLabel = styled.div`
  font-weight: 700;
`;

const SlotStatus = styled.div`
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.8;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  background: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #fff5f5;
  border: 1px solid #fee;
  border-radius: 8px;
  color: #c5192d;
  font-size: 13px;
  text-align: center;
`;

const TimeSlotSelector = ({ 
  label = 'Select Time Slot',
  slots = [],
  selectedTime,
  onSelect,
  error
}) => {
  const handleSlotClick = (slot) => {
    if (!slot.booked && onSelect) {
      onSelect(slot.time);
    }
  };

  if (slots.length === 0) {
    return (
      <SelectorWrapper>
        <Label>
          <FaClock />
          {label}
        </Label>
        <EmptyState>
          <p>No available time slots. Please select a different date.</p>
        </EmptyState>
      </SelectorWrapper>
    );
  }

  return (
    <SelectorWrapper>
      <Label>
        <FaClock />
        {label}
      </Label>
      <SlotsGrid>
        {slots.map((slot, index) => (
          <SlotButton
            key={index}
            $selected={selectedTime === slot.time}
            $booked={slot.booked}
            onClick={() => handleSlotClick(slot)}
            disabled={slot.booked}
          >
            <SlotLabel>{slot.time}</SlotLabel>
            {slot.booked && <SlotStatus>Booked</SlotStatus>}
          </SlotButton>
        ))}
      </SlotsGrid>
      {error && <ErrorMessage>⚠ {error}</ErrorMessage>}
    </SelectorWrapper>
  );
};

export default TimeSlotSelector;
