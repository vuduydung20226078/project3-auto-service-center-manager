import React from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader';
import FormInput from './FormInput';

const FormSection = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInformationForm = ({ 
  values,
  errors,
  touched,
  onChange,
  onBlur
}) => {
  return (
    <FormSection>
      <SectionHeader
        icon={<FaUser />}
        title="Contact Information"
        subtitle="Please provide your contact details"
        noBorder
        marginBottom="20px"
      />

      <FormGrid>
        <FormInput
          label="Full Name"
          name="name"
          value={values.name || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.name && errors.name}
          placeholder="Enter your full name"
          required
          icon={<FaUser />}
          autoComplete="name"
        />
      </FormGrid>

      <FormGrid>
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={values.email || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.email && errors.email}
          placeholder="your.email@example.com"
          icon={<FaEnvelope />}
          autoComplete="email"
          helperText="At least email or phone is required"
        />

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={values.phone || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.phone && errors.phone}
          placeholder="555-0101"
          icon={<FaPhone />}
          autoComplete="tel"
          helperText="At least email or phone is required"
        />
      </FormGrid>

      <FormInput
        label="Address (Optional)"
        name="address"
        value={values.address || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.address && errors.address}
        placeholder="Enter your address"
        icon={<FaMapMarkerAlt />}
        autoComplete="street-address"
      />
    </FormSection>
  );
};

export default ContactInformationForm;
