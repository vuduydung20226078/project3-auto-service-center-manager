import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import DynamicTable from './DynamicTable';
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
  margin-bottom: 30px;
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

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    }
  };

  const handleCreateNew = () => {
    alert(`Open create dialog for new ${activeTab === 'services' ? 'service' : 'part'}`);
  };

  const handleView = (id) => {
    alert(`View details for item ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit item ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      if (activeTab === 'services') {
        await servicesApi.delete(id);
        loadServices();
      } else {
        await partsApi.delete(id);
        loadParts();
      }
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error(err);
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

      {error && <ErrorMsg>{error}</ErrorMsg>}

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
    </PageContainer>
  );
};

export default CategoryManagement;
