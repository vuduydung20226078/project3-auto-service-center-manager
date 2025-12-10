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

const PartFormModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    unit_price: '',
    unit: '',
    active: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || '',
        name: initialData.name || '',
        unit_price: initialData.unit_price || '',
        unit: initialData.unit || '',
        active: initialData.active !== undefined ? initialData.active : true,
      });
    } else {
      setFormData({
        sku: '',
        name: '',
        unit_price: '',
        unit: '',
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
      setError('Part name is required');
      setLoading(false);
      return;
    }

    if (!formData.unit_price || parseFloat(formData.unit_price) < 0) {
      setError('Valid unit price is required');
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        unit_price: parseFloat(formData.unit_price),
      };

      await onSubmit(dataToSubmit);
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save part');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{mode === 'create' ? 'Create New Part' : 'Edit Part'}</Title>
          <CloseBtn onClick={onClose}>
            <FaTimes />
          </CloseBtn>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <FormGroup>
            <Label>SKU</Label>
            <Input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g., BRK-PAD-001"
              disabled={mode === 'edit'}
            />
          </FormGroup>

          <FormGroup>
            <Label>Part Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Brake Pad Set"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Unit Price *</Label>
            <Input
              type="number"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Unit</Label>
            <Input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g., piece, set, box"
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

export default PartFormModal;
