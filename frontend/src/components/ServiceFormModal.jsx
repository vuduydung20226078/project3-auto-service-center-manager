import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 8px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #333;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4c00b4;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  min-height: 80px;
  resize: vertical;

  &:focus {
    border-color: #4c00b4;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;

  &.primary {
    background-color: #4c00b4;
    color: white;

    &:hover {
      background-color: #3c009d;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background-color: #f0f0f0;
    color: #666;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const ErrorMsg = styled.div`
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  color: #c5192d;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const ServiceFormModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    active: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        duration_minutes: initialData.duration_minutes || '',
        active: initialData.active !== undefined ? initialData.active : true,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        price: '',
        duration_minutes: '',
        active: true,
      });
    }
    setError('');
    setLoading(false);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError('Service name is required');
      setLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      setError('Valid price is required');
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes) || 60,
      };

      await onSubmit(dataToSubmit);
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{mode === 'create' ? 'Create New Service' : 'Edit Service'}</Title>
          <CloseBtn onClick={onClose}>
            <FaTimes />
          </CloseBtn>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <FormGroup>
            <Label>Code</Label>
            <Input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., OIL-001"
              disabled={mode === 'edit'}
            />
          </FormGroup>

          <FormGroup>
            <Label>Service Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Oil Change"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the service..."
            />
          </FormGroup>

          <FormGroup>
            <Label>Price *</Label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              placeholder="60"
              min="1"
            />
          </FormGroup>

          <FormGroup>
            <CheckboxWrapper>
              <Checkbox
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <Label style={{ margin: 0 }}>Active</Label>
            </CheckboxWrapper>
          </FormGroup>
        </Form>

        <ButtonGroup>
          <Button type="button" className="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default ServiceFormModal;
