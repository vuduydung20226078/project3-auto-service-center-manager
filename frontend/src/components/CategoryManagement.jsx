import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import DynamicTable from './DynamicTable';
import ServiceFormModal from './ServiceFormModal';
import PartFormModal from './PartFormModal';
import { servicesApi, partsApi } from '../api/catalogApi';

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

const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 0;
`;

const TabContentWrapper = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 0 0 12px 12px;
  border-top: none;
  padding: 30px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const TabsOuterWrapper = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 12px 12px 0 0;
  border-bottom: none;
  background-color: white;
  overflow: hidden;
`;

const Tab = styled.button`
  padding: 15px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: ${props => props.$active ? 600 : 500};
  color: ${props => props.$active ? '#4c00b4' : '#999'};
  border-bottom: ${props => props.$active ? '3px solid #4c00b4' : 'none'};
  transition: all 0.3s ease;

  &:hover {
    color: #4c00b4;
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

const CreateBtn = styled.button`
  padding: 12px 24px;
  background-color: #4c00b4;
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
    background-color: #3c009d;
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

const ConfirmOverlay = styled.div`
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

const ConfirmDialog = styled.div`
  background: white;
  border-radius: 8px;
  width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ConfirmHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const ConfirmBody = styled.div`
  padding: 20px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const ConfirmFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;

  &.cancel {
    background-color: #f0f0f0;
    color: #666;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &.delete {
    background-color: #d32f2f;
    color: white;

    &:hover {
      background-color: #c62828;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  // Fetch services on component mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (err) {
      setError('Failed to load services. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadParts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await partsApi.getAll();
      setParts(data);
    } catch (err) {
      setError('Failed to load parts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setStatusFilter('All Status');
    if (tab === 'parts' && parts.length === 0) {
      loadParts();
    } else {
      setError('');
    }
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setModalMode('create');
    if (activeTab === 'services') {
      setShowServiceModal(true);
    } else {
      setShowPartModal(true);
    }
  };

  const handleView = (id) => {
    const item = activeTab === 'services' 
      ? services.find(s => s.id === id)
      : parts.find(p => p.id === id);
    
    setEditingItem(item);
    setModalMode('edit');
    if (activeTab === 'services') {
      setShowServiceModal(true);
    } else {
      setShowPartModal(true);
    }
  };

  const handleEdit = (id) => {
    const item = activeTab === 'services' 
      ? services.find(s => s.id === id)
      : parts.find(p => p.id === id);
    
    setEditingItem(item);
    setModalMode('edit');
    if (activeTab === 'services') {
      setShowServiceModal(true);
    } else {
      setShowPartModal(true);
    }
  };

  const handleDelete = (id) => {
    const item = activeTab === 'services' 
      ? services.find(s => s.id === id)
      : parts.find(p => p.id === id);
    
    setDeleteConfirm({
      show: true,
      id: id,
      name: item?.name || 'this item'
    });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (activeTab === 'services') {
        await servicesApi.delete(deleteConfirm.id);
        setSuccessMessage('Service deleted successfully!');
        loadServices();
      } else {
        await partsApi.delete(deleteConfirm.id);
        setSuccessMessage('Part deleted successfully!');
        loadParts();
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setDeleteConfirm({ show: false, id: null, name: '' });
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, id: null, name: '' });
  };

  const handleServiceSubmit = async (data) => {
    try {
      if (modalMode === 'create') {
        await servicesApi.create(data);
        setSuccessMessage('Service created successfully!');
      } else {
        await servicesApi.update(editingItem.id, data);
        setSuccessMessage('Service updated successfully!');
      }
      loadServices();
      setShowServiceModal(false);
      setEditingItem(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw err;
    }
  };

  const handlePartSubmit = async (data) => {
    try {
      if (modalMode === 'create') {
        await partsApi.create(data);
        setSuccessMessage('Part created successfully!');
      } else {
        await partsApi.update(editingItem.id, data);
        setSuccessMessage('Part updated successfully!');
      }
      loadParts();
      setShowPartModal(false);
      setEditingItem(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw err;
    }
  };

  // Filter data based on search and status
  const getFilteredData = () => {
    const data = activeTab === 'services' ? services : parts;
    return data.filter(item => {
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'All Status' ||
        (statusFilter === 'Active' && item.active) ||
        (statusFilter === 'Inactive' && !item.active);
      
      return matchesSearch && matchesStatus;
    });
  };

  // Column definitions for services
  const serviceColumns = [
    { key: 'code', label: 'Code', width: '120px' },
    { key: 'name', label: 'Service Name', width: '200px' },
    { key: 'description', label: 'Description', width: '300px' },
    { key: 'price', label: 'Price', type: 'currency', width: '100px' },
    { key: 'duration_minutes', label: 'Duration (min)', width: '120px' },
    { key: 'active', label: 'Status', type: 'status', width: '100px' },
    { key: 'createdAt', label: 'Created', type: 'date', width: '120px' },
  ];

  // Column definitions for parts
  const partColumns = [
    { key: 'sku', label: 'SKU', width: '120px' },
    { key: 'name', label: 'Part Name', width: '250px' },
    { key: 'unit_price', label: 'Unit Price', type: 'currency', width: '120px' },
    { key: 'unit', label: 'Unit', width: '100px' },
    { key: 'active', label: 'Status', type: 'status', width: '100px' },
    { key: 'createdAt', label: 'Created', type: 'date', width: '120px' },
  ];

  const filteredData = getFilteredData();

  return (
    <PageContainer>
      <Header>
        <Title>Category Management</Title>
        <Subtitle>Manage service categories and parts inventory</Subtitle>
      </Header>

      <TabsOuterWrapper>
        <TabsContainer>
          <Tab
            $active={activeTab === 'services'}
            onClick={() => handleTabChange('services')}
          >
            Service Categories
          </Tab>
          <Tab
            $active={activeTab === 'parts'}
            onClick={() => handleTabChange('parts')}
          >
            Parts Categories
          </Tab>
        </TabsContainer>
      </TabsOuterWrapper>

      <TabContentWrapper>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        {successMessage && <SuccessMsg>✓ {successMessage}</SuccessMsg>}

        <ControlBar>
        <SearchInput
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </FilterSelect>
        <CreateBtn onClick={handleCreateNew}>
          <FaPlus />
          Create New
        </CreateBtn>
      </ControlBar>

      {loading ? (
        <LoadingMsg>Loading...</LoadingMsg>
      ) : (
        <DynamicTable
          columns={activeTab === 'services' ? serviceColumns : partColumns}
          data={filteredData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />
      )}
      </TabContentWrapper>

      <ServiceFormModal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleServiceSubmit}
        initialData={editingItem}
        mode={modalMode}
      />

      <PartFormModal
        isOpen={showPartModal}
        onClose={() => {
          setShowPartModal(false);
          setEditingItem(null);
        }}
        onSubmit={handlePartSubmit}
        initialData={editingItem}
        mode={modalMode}
      />

      {deleteConfirm.show && (
        <ConfirmOverlay onClick={cancelDelete}>
          <ConfirmDialog onClick={(e) => e.stopPropagation()}>
            <ConfirmHeader>
              <ConfirmTitle>Confirm Delete</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
              This action cannot be undone.
            </ConfirmBody>
            <ConfirmFooter>
              <ConfirmButton 
                className="cancel" 
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancel
              </ConfirmButton>
              <ConfirmButton 
                className="delete" 
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </ConfirmButton>
            </ConfirmFooter>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}
    </PageContainer>
  );
};

export default CategoryManagement;
