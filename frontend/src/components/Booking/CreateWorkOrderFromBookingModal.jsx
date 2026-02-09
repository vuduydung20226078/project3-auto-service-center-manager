import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus, FaTrash, FaWrench, FaInfoCircle } from 'react-icons/fa';
import { techniciansApi } from '../../api/techniciansApi';
import { servicesApi } from '../../api/servicesApi';
import { partsApi } from '../../api/partsApi';
import api from '../../api/api';
import toast from '../../utils/toast';

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
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 0;
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
  }
`;

const Body = styled.div`
  padding: 24px;
`;

const InfoSection = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 4px solid #667eea;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const InfoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  font-size: 14px;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 8px;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #555;
  min-width: 100px;
`;

const InfoValue = styled.span`
  color: #666;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  
  span.required {
    color: #ef4444;
    margin-left: 4px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemsTable = styled.div`
  margin-top: 16px;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 110px 2fr 100px 120px 140px 50px;
  gap: 12px;
  margin-bottom: 12px;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;

const RemoveButton = styled.button`
  padding: 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #dc2626;
  }
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const TotalLabel = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const TotalValue = styled.span`
  font-size: 28px;
  font-weight: 700;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CancelButton = styled(Button)`
  background-color: #e9ecef;
  color: #666;
  
  &:hover {
    background-color: #dee2e6;
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

const CreateWorkOrderFromBookingModal = ({ booking, onClose, onSuccess }) => {
  const [technician_id, setTechnicianId] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState(90); // Default 90 minutes
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [techsRes, servicesRes, partsRes] = await Promise.all([
        techniciansApi.getAll(),
        servicesApi.getAll(),
        partsApi.getAll()
      ]);
      
      setTechnicians(techsRes || []);
      setServices(servicesRes || []);
      setParts(partsRes || []);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load form data');
    }
  };
  
  const addItem = () => {
    setItems([...items, {
      type: 'service',
      service_id: '',
      part_id: '',
      description: '',
      quantity: 1,
      price: 0
    }]);
  };
  
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    // Recalculate duration after removing item
    calculateAndSetDuration(newItems);
  };
  
  const calculateAndSetDuration = (itemsList) => {
    // Calculate total duration from all services (services don't have quantity)
    let totalDuration = 0;
    itemsList.forEach(item => {
      if (item.type === 'service' && item.service_id) {
        const service = services.find(s => s.id === parseInt(item.service_id));
        if (service && service.duration_minutes) {
          // Services are added once, no quantity multiplication
          totalDuration += service.duration_minutes;
        }
      }
    });
    
    // Set to calculated duration or default to 90 if no services
    setEstimatedDuration(totalDuration > 0 ? totalDuration : 90);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    
    // Check for duplicate service when selecting
    if (field === 'service_id' && value) {
      const isDuplicate = items.some((item, i) => i !== index && item.type === 'service' && item.service_id === value);
      if (isDuplicate) {
        toast.error('This service has already been added');
        return;
      }
      
      const service = services.find(s => s.id === parseInt(value));
      if (service) {
        newItems[index].price = service.price || 0;
        newItems[index].description = service.name;
      }
    }
    
    if (field === 'part_id' && value) {
      const part = parts.find(p => p.id === parseInt(value));
      if (part) {
        newItems[index].price = part.unit_price || 0;
        newItems[index].description = part.name;
      }
    }
    
    newItems[index][field] = value;
    setItems(newItems);
    
    // Recalculate duration when service or type changes (not quantity for parts)
    if (field === 'service_id' || field === 'type') {
      calculateAndSetDuration(newItems);
    }
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
    }, 0);
  };
  
  const validateForm = () => {
    if (!technician_id) {
      toast.error('Please select a technician');
      return false;
    }
    
    if (items.length === 0) {
      toast.error('Please add at least one service or part');
      return false;
    }
    
    // Validate items
    for (const item of items) {
      if (item.type === 'service' && !item.service_id) {
        toast.error('Please select a service for all service items');
        return false;
      }
      if (item.type === 'part' && !item.part_id) {
        toast.error('Please select a part for all part items');
        return false;
      }
      if (!item.quantity || item.quantity < 1) {
        toast.error('Quantity must be at least 1');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await api.post('/work-orders/from-booking', {
        booking_id: booking.id,
        technician_id: parseInt(technician_id),
        vehicle_id: booking.vehicle_id,
        start_time: booking.scheduled_time, // Use booking's scheduled time
        estimated_duration: estimatedDuration,
        items: items.map(item => ({
          item_type: item.type.toUpperCase(), // SERVICE or PART
          item_id: item.type === 'service' ? parseInt(item.service_id) : parseInt(item.part_id),
          description: item.description,
          quantity: item.type === 'service' ? 1 : parseInt(item.quantity), // Services always quantity 1
          unit_price: parseFloat(item.price)
        }))
      });
      
      toast.success('Work order created successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error creating work order:', err);
      toast.error(err.response?.data?.message || 'Failed to create work order');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatPrice = (price) => {
    return `${parseFloat(price || 0).toFixed(0)} VND`;
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FaWrench /> Create Work Order
          </Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Body>
          <InfoSection>
            <InfoTitle>
              <FaInfoCircle /> Booking Information
            </InfoTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Booking ID:</InfoLabel>
                <InfoValue>#{booking.id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status:</InfoLabel>
                <InfoValue>{booking.status}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Customer:</InfoLabel>
                <InfoValue>{booking.customer?.name || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone:</InfoLabel>
                <InfoValue>{booking.customer?.phone || 'N/A'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Vehicle:</InfoLabel>
                <InfoValue>
                  {booking.vehicle?.license_plate} - {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Scheduled:</InfoLabel>
                <InfoValue>
                  {formatDate(booking.scheduled_time)} at {formatTime(booking.scheduled_time)}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          <FormGroup>
            <Label>
              Assign Technician <span className="required">*</span>
            </Label>
            <Select 
              value={technician_id} 
              onChange={(e) => setTechnicianId(e.target.value)}
            >
              <option value="">Select a technician</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>
                  {tech.User?.full_name || `Technician #${tech.id}`} 
                  {tech.specialty && ` - ${tech.specialty}`}
                  {tech.status && ` (${tech.status})`}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              Estimated Duration (minutes)
            </Label>
            <Input
              type="number"
              min="15"
              step="15"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 90)}
              placeholder="90"
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Scheduled: {formatDate(booking.scheduled_time)} at {formatTime(booking.scheduled_time)}
            </div>
          </FormGroup>

          <SectionTitle>
            <FaWrench /> Services & Parts
          </SectionTitle>

          {items.length === 0 ? (
            <EmptyState>
              No items added yet. Click "Add Item" to begin.
            </EmptyState>
          ) : (
            <ItemsTable>
              {items.map((item, index) => (
                <ItemRow key={index}>
                  <FormGroup style={{ marginBottom: 0 }}>
                    <Select
                      value={item.type}
                      onChange={(e) => updateItem(index, 'type', e.target.value)}
                    >
                      <option value="service">Service</option>
                      <option value="part">Part</option>
                    </Select>
                  </FormGroup>

                  <FormGroup style={{ marginBottom: 0 }}>
                    {item.type === 'service' ? (
                      <Select
                        value={item.service_id}
                        onChange={(e) => updateItem(index, 'service_id', e.target.value)}
                      >
                        <option value="">Select service</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} - {formatPrice(service.price)}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Select
                        value={item.part_id}
                        onChange={(e) => updateItem(index, 'part_id', e.target.value)}
                      >
                        <option value="">Select part</option>
                        {parts.map(part => (
                          <option key={part.id} value={part.id}>
                            {part.name} - {formatPrice(part.unit_price)}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormGroup>

                  {item.type === 'part' && (
                    <FormGroup style={{ marginBottom: 0 }}>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      />
                    </FormGroup>
                  )}

                  <FormGroup style={{ marginBottom: 0 }}>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup style={{ marginBottom: 0 }}>
                    <Input
                      type="text"
                      placeholder="Subtotal"
                      value={formatPrice((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1))}
                      disabled
                    />
                  </FormGroup>

                  <RemoveButton onClick={() => removeItem(index)}>
                    <FaTrash />
                  </RemoveButton>
                </ItemRow>
              ))}
            </ItemsTable>
          )}

          <AddButton onClick={addItem}>
            <FaPlus /> Add Item
          </AddButton>

          {items.length > 0 && (
            <TotalSection>
              <TotalLabel>Total Amount:</TotalLabel>
              <TotalValue>{formatPrice(calculateTotal())}</TotalValue>
            </TotalSection>
          )}
        </Body>

        <Footer>
          <CancelButton onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={loading}>
            <FaWrench />
            {loading ? 'Creating...' : 'Create Work Order'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default CreateWorkOrderFromBookingModal;
