import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import DynamicTable from './DynamicTable';
import { inventoryApi } from '../api/inventoryApi';
import { partsApi } from '../api/catalogApi';

const PageContainer = styled.div`
  margin-left: 280px;
  padding: 30px;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
`;

const ContentWrapper = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  padding: 20px;
  background: ${props => props.$bgColor || '#f5f5f5'};
  border-radius: 8px;
  border-left: 4px solid ${props => props.$borderColor || '#4c00b4'};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.$color || '#333'};
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    font-size: 24px;
  }
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4c00b4;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: white;
  outline: none;

  &:focus {
    border-color: #4c00b4;
  }
`;

const ActionBtn = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.$bgColor || '#4c00b4'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.$hoverColor || '#3c009d'};
  }
`;

const LoadingMsg = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

const ErrorMsg = styled.div`
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  color: #c5192d;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const SuccessMsg = styled.div`
  background-color: #e8f5e9;
  border: 1px solid #a5d6a7;
  color: #2e7d32;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalOverlay = styled.div`
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
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #333;
`;

const ModalBody = styled.div`
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
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: white;
  outline: none;

  &:focus {
    border-color: #4c00b4;
  }
`;

const ModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
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

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [parts, setParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    part_id: '',
    qty: '',
    type: 'IN',
    ref: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [inventoryData, partsData] = await Promise.all([
        inventoryApi.getAll(),
        partsApi.getAll()
      ]);
      setInventory(inventoryData);
      setParts(partsData);
    } catch (err) {
      setError('Failed to load inventory. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      part_id: '',
      qty: '',
      type: 'IN',
      ref: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await inventoryApi.addEntry({
        ...formData,
        qty: parseInt(formData.qty),
        part_id: parseInt(formData.part_id)
      });
      setSuccessMessage(`Stock ${formData.type === 'IN' ? 'added' : 'removed'} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      handleCloseModal();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredInventory = () => {
    return inventory.filter(item => {
      const matchesSearch = 
        item.Part?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Part?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStock = 
        stockFilter === 'All' ||
        (stockFilter === 'Low' && item.qty <= 5) ||
        (stockFilter === 'Out' && item.qty === 0) ||
        (stockFilter === 'Available' && item.qty > 5);
      
      return matchesSearch && matchesStock;
    });
  };

  const getStats = () => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(item => item.qty > 0 && item.qty <= 5).length;
    const outOfStock = inventory.filter(item => item.qty === 0).length;
    const totalQuantity = inventory.reduce((sum, item) => sum + item.qty, 0);

    return { totalItems, lowStock, outOfStock, totalQuantity };
  };

  const stats = getStats();

  const inventoryColumns = [
    { 
      key: 'id', 
      label: 'ID', 
      type: 'text',
      width: '60px',
      render: (value) => value
    },
    { 
      key: 'Part.sku', 
      label: 'SKU', 
      width: '120px',
      render: (value, row) => row.Part?.sku || 'N/A'
    },
    { 
      key: 'Part.name', 
      label: 'Part Name', 
      width: '250px',
      render: (value, row) => row.Part?.name || 'N/A'
    },
    { 
      key: 'qty', 
      label: 'Quantity', 
      width: '100px',
      render: (value) => {
        const color = value === 0 ? '#c5192d' : value <= 5 ? '#f57c00' : '#0f8419';
        return <span style={{ color, fontWeight: 600 }}>{value}</span>;
      }
    },
    { 
      key: 'location', 
      label: 'Location', 
      width: '150px',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'Part.unit', 
      label: 'Unit', 
      width: '80px',
      render: (value, row) => row.Part?.unit || 'N/A'
    },
    { 
      key: 'last_updated', 
      label: 'Last Updated', 
      type: 'date', 
      width: '120px' 
    },
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Inventory Management</Title>
        <Subtitle>Monitor and manage parts inventory</Subtitle>
      </Header>

      <ContentWrapper>
        <StatsContainer>
          <StatCard $bgColor="#e3f2fd" $borderColor="#1976d2">
            <StatLabel>Total Items</StatLabel>
            <StatValue $color="#1976d2">
              <FaBoxOpen />
              {stats.totalItems}
            </StatValue>
          </StatCard>

          <StatCard $bgColor="#fff3e0" $borderColor="#f57c00">
            <StatLabel>Low Stock</StatLabel>
            <StatValue $color="#f57c00">
              <FaExclamationTriangle />
              {stats.lowStock}
            </StatValue>
          </StatCard>

          <StatCard $bgColor="#ffebee" $borderColor="#c5192d">
            <StatLabel>Out of Stock</StatLabel>
            <StatValue $color="#c5192d">
              <FaExclamationTriangle />
              {stats.outOfStock}
            </StatValue>
          </StatCard>

          <StatCard $bgColor="#e8f5e9" $borderColor="#0f8419">
            <StatLabel>Total Quantity</StatLabel>
            <StatValue $color="#0f8419">
              {stats.totalQuantity}
            </StatValue>
          </StatCard>
        </StatsContainer>

        {error && <ErrorMsg>{error}</ErrorMsg>}
        {successMessage && <SuccessMsg>✓ {successMessage}</SuccessMsg>}

        <ControlBar>
          <SearchInput
            type="text"
            placeholder="Search by part name, SKU, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option>All</option>
            <option>Available</option>
            <option>Low</option>
            <option>Out</option>
          </FilterSelect>
          <ActionBtn onClick={handleOpenModal}>
            <FaPlus />
            Add Entry
          </ActionBtn>
        </ControlBar>

        {loading ? (
          <LoadingMsg>Loading inventory...</LoadingMsg>
        ) : (
          <DynamicTable
            columns={inventoryColumns}
            data={getFilteredInventory()}
            onEdit={null}
            onDelete={null}
            onView={null}
            showActions={false}
            itemsPerPage={15}
          />
        )}
      </ContentWrapper>

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add Stock Entry</ModalTitle>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                {error && <ErrorMsg>{error}</ErrorMsg>}

                <FormGroup>
                  <Label>Part *</Label>
                  <Select
                    name="part_id"
                    value={formData.part_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Part</option>
                    {parts.map(part => (
                      <option key={part.id} value={part.id}>
                        {part.sku} - {part.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Type *</Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="IN">IN (Add Stock)</option>
                    <option value="OUT">OUT (Remove Stock)</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Reference</Label>
                  <Input
                    type="text"
                    name="ref"
                    value={formData.ref}
                    onChange={handleChange}
                    placeholder="e.g., PO-12345, WO-67890"
                  />
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button 
                  type="button" 
                  className="secondary" 
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </ModalFooter>
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default InventoryManagement;
