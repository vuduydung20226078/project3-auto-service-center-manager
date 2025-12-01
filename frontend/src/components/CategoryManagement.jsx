import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEye, FaEdit, FaTrash, FaPlus, FaChevronDown } from 'react-icons/fa';

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.thead`
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #fafafa;
    }
  }
`;

const TableCell = styled.td`
  padding: 15px;
  font-size: 14px;
  color: #333;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.$status === 'active' ? '#e6f4ea' : '#fbe4e6'};
  color: ${props => props.$status === 'active' ? '#0f8419' : '#c5192d'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ActionBtn = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    color: #333;
  }

  &.delete:hover {
    background-color: #ffebee;
    color: #c5192d;
  }
`;

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Mock data - replace with API calls
  const serviceCategories = [
    {
      id: 1,
      name: 'Oil Change',
      description: 'Complete engine oil change service with filter replacement',
      status: 'active',
      createdDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Brake Service',
      description: 'Brake inspection, pad replacement, and rotor servicing',
      status: 'active',
      createdDate: '2024-01-20',
    },
    {
      id: 3,
      name: 'Tire Rotation',
      description: 'Professional tire rotation and balance service',
      status: 'inactive',
      createdDate: '2024-02-01',
    },
    {
      id: 4,
      name: 'Engine Diagnostics',
      description: 'Comprehensive engine diagnostic testing and analysis',
      status: 'active',
      createdDate: '2024-02-10',
    },
  ];

  const handleCreateNew = () => {
    alert('Open create dialog for new service category');
  };

  const handleView = (id) => {
    alert(`View details for item ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit item ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete item ${id}`);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Category Management</Title>
        <Subtitle>Manage service categories and parts inventory</Subtitle>
      </Header>

      <TabsContainer>
        <Tab
          $active={activeTab === 'services'}
          onClick={() => setActiveTab('services')}
        >
          Service Categories
        </Tab>
        <Tab
          $active={activeTab === 'parts'}
          onClick={() => setActiveTab('parts')}
        >
          Parts Categories
        </Tab>
      </TabsContainer>

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

      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>Service Name</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Created Date</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {serviceCategories.map((service) => (
            <tr key={service.id}>
              <TableCell>
                <strong>{service.name}</strong>
              </TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>
                <StatusBadge $status={service.status}>
                  {service.status}
                </StatusBadge>
              </TableCell>
              <TableCell>{service.createdDate}</TableCell>
              <TableCell>
                <ActionButtons>
                  <ActionBtn onClick={() => handleView(service.id)} title="View">
                    <FaEye />
                  </ActionBtn>
                  <ActionBtn onClick={() => handleEdit(service.id)} title="Edit">
                    <FaEdit />
                  </ActionBtn>
                  <ActionBtn
                    className="delete"
                    onClick={() => handleDelete(service.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </ActionBtn>
                </ActionButtons>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </PageContainer>
  );
};

export default CategoryManagement;
