import React from 'react';
import styled from 'styled-components';
import { FaStickyNote } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader';
import FormTextarea from './FormTextarea';

const FormSection = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
`;

const AdditionalNotesSection = ({ 
  value,
  onChange,
  onBlur,
  error
}) => {
  return (
    <FormSection>
      <SectionHeader
        icon={<FaStickyNote />}
        title="Additional Notes (Optional)"
        subtitle="Tell us more about the service you need"
        noBorder
        marginBottom="20px"
      />

      <FormTextarea
        name="additionalNotes"
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        placeholder="Any specific concerns or requests? (e.g., strange noise, check engine light, etc.)"
        maxLength={500}
        showCharCount
        minHeight="120px"
        marginBottom="0"
      />
    </FormSection>
  );
};

export default AdditionalNotesSection;
