import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus, FaTrash, FaWrench } from 'react-icons/fa';
import { workOrdersApi } from '../../api/workOrdersApi';
import { customersApi } from '../../api/customersApi';
import { vehiclesApi } from '../../api/vehiclesApi';
import { techniciansApi } from '../../api/techniciansApi';
import { servicesApi } from '../../api/servicesApi';
import { partsApi } from '../../api/partsApi';
import { calculateTotal, validateWorkOrderForm } from './workOrderHelpers';
import toast from '../../utils/toast';

// Styled Components
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
  max-width: 800px;
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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
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
    border-color: #2563eb;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  margin-bottom: 12px;
  align-items: end;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  
  &:hover {
    background-color: #059669;
  }
`;

const RemoveButton = styled.button`
  padding: 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #dc2626;
  }
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

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 13px;
  margin-top: 4px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  
  input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const TotalSectionGradient = styled.div`
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

const ItemsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const WorkOrderForm = ({ workOrder, onClose, onSuccess }) => {
  // State
  const [customerType, setCustomerType] = useState('existing');
  const [vehicleType, setVehicleType] = useState('existing');
  
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    technician_id: '',
    status: 'OPEN',
    start_time: '',
    estimated_duration: 90
  });
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [newVehicle, setNewVehicle] = useState({
    license_plate: '',
    model: '',
    vin: '',
    mileage: '',
    note: ''
  });
  
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [partsList, setPartsList] = useState([]);
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCustomers();
    loadTechnicians();
    loadServices();
    loadParts();
    
    if (workOrder) {
      setCustomerType('existing');
      setVehicleType('existing');
      setFormData({
        customer_id: workOrder.customer_id || '',
        vehicle_id: workOrder.vehicle_id || '',
        advisor_id: workOrder.advisor_id || '',
        status: workOrder.status || 'OPEN'
      });
      if (workOrder.services) setServices(workOrder.services);
      if (workOrder.parts) setParts(workOrder.parts);
    }
  }, [workOrder]);

  // Load vehicles when customer changes
  useEffect(() => {
    if (customerType === 'existing' && formData.customer_id) {
      loadVehiclesByCustomer(formData.customer_id);
    }
  }, [formData.customer_id, customerType]);

  // API Load Functions
  const loadCustomers = async () => {
    try {
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadTechnicians = async () => {
    try {
      const data = await techniciansApi.getAll();
      setTechnicians(data);
    } catch (error) {
      console.error('Error loading technicians:', error);
    }
  };

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServicesList(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadParts = async () => {
    try {
      const data = await partsApi.getAll();
      setPartsList(data);
    } catch (error) {
      console.error('Error loading parts:', error);
    }
  };

  const loadVehiclesByCustomer = async (customerId) => {
    try {
      const data = await vehiclesApi.getAll({ customer_id: customerId });
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  // Calculate and auto-set duration from services
  const calculateAndSetDuration = (selectedServices) => {
    let totalDuration = 0;
    selectedServices.forEach(service => {
      if (service.service_id) {
        // Find the service from the catalog (servicesList state)
        const catalogService = servicesList.find(s => s.id === parseInt(service.service_id));
        if (catalogService && catalogService.duration_minutes) {
          // Services don't have quantity, each service is added once
          totalDuration += catalogService.duration_minutes;
        }
      }
    });
    
    // Set to calculated duration or keep current if no services
    if (totalDuration > 0) {
      setFormData(prev => ({ ...prev, estimated_duration: totalDuration }));
    }
  };

  // Service Management
  const addService = () => {
    setServices([...services, { service_id: '', price: 0, description: '' }]);
  };

  const removeService = (index) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
    calculateAndSetDuration(newServices);
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    
    // Check for duplicate service when selecting
    if (field === 'service_id' && value) {
      const isDuplicate = services.some((s, i) => i !== index && s.service_id === value);
      if (isDuplicate) {
        toast.error('This service has already been added');
        return;
      }
      
      const selectedService = servicesList.find(s => s.id === parseInt(value));
      if (selectedService) {
        updated[index].price = selectedService.price || 0;
      }
    }
    
    updated[index][field] = value;
    setServices(updated);
    
    // Recalculate duration when service changes
    if (field === 'service_id') {
      calculateAndSetDuration(updated);
    }
  };

  // Part Management
  const addPart = () => {
    setParts([...parts, { part_id: '', quantity: 1, price: 0, description: '' }]);
  };

  const removePart = (index) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const updatePart = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;
    
    // Auto-fill price when part is selected
    if (field === 'part_id' && value) {
      const selectedPart = partsList.find(p => p.id === parseInt(value));
      if (selectedPart) {
        updated[index].price = selectedPart.unit_price || 0;
      }
    }
    
    setParts(updated);
  };

  // Form Validation & Submit
  const validate = () => {
    const validationErrors = validateWorkOrderForm(
      customerType,
      vehicleType,
      formData,
      newCustomer,
      newVehicle
    );
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      
      let customerId = formData.customer_id;
      let vehicleId = formData.vehicle_id;
      
      // Create new customer if needed
      if (customerType === 'new') {
        const createdCustomer = await customersApi.create(newCustomer);
        customerId = createdCustomer.id;
      }
      
      // Create new vehicle if needed
      if (vehicleType === 'new') {
        const createdVehicle = await vehiclesApi.create({
          ...newVehicle,
          customer_id: customerId
        });
        vehicleId = createdVehicle.id;
      }
      
      const submitData = {
        vehicle_id: vehicleId,
        technician_id: formData.technician_id || null,
        status: formData.status,
        start_time: formData.start_time || null,
        estimated_duration: formData.estimated_duration || null,
        items: [
          ...services.map(s => ({ 
            service_id: s.service_id, 
            quantity: 1, // Services always have quantity 1
            price: s.price, 
            description: s.description || '',
            type: 'service' 
          })),
          ...parts.map(p => ({ 
            part_id: p.part_id, 
            quantity: p.quantity, 
            price: p.price, 
            description: p.description || '',
            type: 'part' 
          }))
        ]
      };

      if (workOrder) {
        await workOrdersApi.update(workOrder.id, submitData);
      } else {
        await workOrdersApi.create(submitData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving work order:', error);
      toast.error('Error saving work order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FaWrench /> {workOrder ? 'Edit Work Order' : 'New Work Order'}
          </Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <form onSubmit={handleSubmit}>
          <Body>
            {/* Customer Section */}
            <SectionTitle>Customer Information</SectionTitle>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  value="existing"
                  checked={customerType === 'existing'}
                  onChange={(e) => setCustomerType(e.target.value)}
                  disabled={!!workOrder}
                />
                Existing Customer
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  value="new"
                  checked={customerType === 'new'}
                  onChange={(e) => setCustomerType(e.target.value)}
                  disabled={!!workOrder}
                />
                New Customer (Walk-in)
              </RadioLabel>
            </RadioGroup>

            {customerType === 'existing' ? (
              <FormGroup>
                <Label>Select Customer *</Label>
                <Select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                >
                  <option value="">Select customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                  ))}
                </Select>
                {errors.customer_id && <ErrorText>{errors.customer_id}</ErrorText>}
              </FormGroup>
            ) : (
              <Grid>
                <FormGroup>
                  <Label>Customer Name *</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="Enter customer name"
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Phone *</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Address</Label>
                  <Input
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    placeholder="Enter address"
                  />
                </FormGroup>
              </Grid>
            )}

            {/* Vehicle Section */}
            <SectionTitle>Vehicle Information</SectionTitle>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  value="existing"
                  checked={vehicleType === 'existing'}
                  onChange={(e) => setVehicleType(e.target.value)}
                  disabled={!!workOrder || (customerType === 'existing' && !formData.customer_id)}
                />
                Existing Vehicle
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  value="new"
                  checked={vehicleType === 'new'}
                  onChange={(e) => setVehicleType(e.target.value)}
                  disabled={!!workOrder}
                />
                New Vehicle
              </RadioLabel>
            </RadioGroup>

            {vehicleType === 'existing' ? (
              <FormGroup>
                <Label>Select Vehicle *</Label>
                <Select
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
                  disabled={customerType === 'existing' && !formData.customer_id}
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.model} - {v.license_plate}</option>
                  ))}
                </Select>
                {errors.vehicle_id && <ErrorText>{errors.vehicle_id}</ErrorText>}
              </FormGroup>
            ) : (
              <Grid>
                <FormGroup>
                  <Label>License Plate *</Label>
                  <Input
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle({...newVehicle, license_plate: e.target.value})}
                    placeholder="Enter license plate"
                  />
                  {errors.license_plate && <ErrorText>{errors.license_plate}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Model *</Label>
                  <Input
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                    placeholder="Enter vehicle model"
                  />
                  {errors.model && <ErrorText>{errors.model}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>VIN</Label>
                  <Input
                    value={newVehicle.vin}
                    onChange={(e) => setNewVehicle({...newVehicle, vin: e.target.value})}
                    placeholder="Enter VIN"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mileage</Label>
                  <Input
                    type="number"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})}
                    placeholder="Enter mileage"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Note</Label>
                  <Input
                    value={newVehicle.note}
                    onChange={(e) => setNewVehicle({...newVehicle, note: e.target.value})}
                    placeholder="Enter note (optional)"
                  />
                </FormGroup>
              </Grid>
            )}

            {/* Work Order Details */}
            <SectionTitle>Work Order Details</SectionTitle>
            <FormGroup>
              <Label>Assign Technician</Label>
              <Select
                value={formData.technician_id}
                onChange={(e) => setFormData({...formData, technician_id: e.target.value})}
              >
                <option value="">Unassigned</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>
                    {tech.User?.full_name || tech.full_name} - {tech.status}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <Grid>
              <FormGroup>
                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                />
              </FormGroup>
              <FormGroup>
                <Label>Estimated Duration (minutes)</Label>
                <Input
                  type="number"
                  min="15"
                  step="15"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({...formData, estimated_duration: parseInt(e.target.value) || 90})}
                  placeholder="90"
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {services.length > 0 && services.some(s => s.service_id) 
                    ? 'Auto-calculated from selected services' 
                    : 'Will be calculated automatically when services are selected'}
                </div>
              </FormGroup>
            </Grid>

            {/* Services Section */}
            <SectionTitle>Services</SectionTitle>
            <AddButton type="button" onClick={addService}>
              <FaPlus /> Add Service
            </AddButton>
            {services.map((service, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <ItemRow>
                  <Select
                    value={service.service_id}
                    onChange={(e) => updateService(index, 'service_id', e.target.value)}
                    style={{ flex: 2 }}
                  >
                    <option value="">Select service</option>
                    {servicesList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} - {parseFloat(s.price || 0).toFixed(0)} VND
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={service.price}
                    onChange={(e) => updateService(index, 'price', e.target.value)}
                    min="0"
                    step="0.01"
                    style={{ width: '120px' }}
                  />
                  <RemoveButton type="button" onClick={() => removeService(index)}>
                    <FaTrash />
                  </RemoveButton>
                </ItemRow>
                <FormGroup style={{ marginTop: '8px' }}>
                  <Textarea
                    placeholder="Description (optional)"
                    value={service.description || ''}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                  />
                </FormGroup>
              </div>
            ))}

            {/* Parts Section */}
            <SectionTitle>Parts</SectionTitle>
            <AddButton type="button" onClick={addPart}>
              <FaPlus /> Add Part
            </AddButton>
            {parts.map((part, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <ItemRow>
                  <Select
                    value={part.part_id}
                    onChange={(e) => updatePart(index, 'part_id', e.target.value)}
                  >
                    <option value="">Select part</option>
                    {partsList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) - {parseFloat(p.unit_price || 0).toFixed(0)} VND
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={part.quantity}
                    onChange={(e) => updatePart(index, 'quantity', e.target.value)}
                    min="1"
                    style={{ width: '80px' }}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={part.price}
                    onChange={(e) => updatePart(index, 'price', e.target.value)}
                    min="0"
                    step="0.01"
                    style={{ width: '120px' }}
                  />
                  <Input
                    type="text"
                    placeholder="Subtotal"
                    value={`${((parseFloat(part.price) || 0) * (parseInt(part.quantity) || 1)).toFixed(0)} VND`}
                    disabled
                    style={{ width: '120px', background: '#f0f0f0' }}
                  />
                  <RemoveButton type="button" onClick={() => removePart(index)}>
                    <FaTrash />
                  </RemoveButton>
                </ItemRow>
                <FormGroup style={{ marginTop: '8px' }}>
                  <Textarea
                    placeholder="Description (optional)"
                    value={part.description || ''}
                    onChange={(e) => updatePart(index, 'description', e.target.value)}
                  />
                </FormGroup>
              </div>
            ))}

            {/* Total */}
            <TotalSectionGradient>
              <TotalLabel>Total Estimated Cost:</TotalLabel>
              <TotalValue>{parseFloat(calculateTotal(services, parts) || 0).toFixed(0)} VND</TotalValue>
            </TotalSectionGradient>
          </Body>

          <Footer>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              <FaWrench />
              {loading ? 'Saving...' : workOrder ? 'Update' : 'Create'}
            </SubmitButton>
          </Footer>
        </form>
      </Modal>
    </Overlay>
  );
};

export default WorkOrderForm;
