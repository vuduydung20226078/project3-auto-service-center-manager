import React from 'react';
import styled from 'styled-components';
import { FaCar } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

const FormSection = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VehicleInformationForm = ({ 
  values,
  errors,
  touched,
  onChange,
  onBlur
}) => {
  // Generate years from 1990 to current year + 1
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 1; year >= 1990; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }

  return (
    <FormSection>
      <SectionHeader
        icon={<FaCar />}
        title="Vehicle Information"
        subtitle="Tell us about your vehicle"
        noBorder
        marginBottom="20px"
      />

      <FormGrid>
        <FormInput
          label="Make"
          name="make"
          value={values.make || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.make && errors.make}
          placeholder="e.g., Honda, Toyota"
          required
        />

        <FormInput
          label="Model"
          name="model"
          value={values.model || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.model && errors.model}
          placeholder="e.g., Civic, Camry"
          required
        />
      </FormGrid>

      <FormGrid>
        <FormSelect
          label="Year"
          name="year"
          value={values.year || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.year && errors.year}
          placeholder="Select year"
          options={years}
          required
        />

        <FormInput
          label="License Plate"
          name="licensePlate"
          value={values.licensePlate || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.licensePlate && errors.licensePlate}
          placeholder="e.g., ABC-123"
          required
        />
      </FormGrid>

      <FormGrid>
        <FormInput
          label="Current Mileage (Optional)"
          name="mileage"
          type="number"
          value={values.mileage || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.mileage && errors.mileage}
          placeholder="e.g., 45000"
        />

        <FormInput
          label="VIN (Optional)"
          name="vin"
          value={values.vin || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.vin && errors.vin}
          placeholder="17-character VIN"
          helperText="Vehicle Identification Number"
        />
      </FormGrid>
    </FormSection>
  );
};

export default VehicleInformationForm;
