import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserSlash, FaUserCheck } from 'react-icons/fa';
import DynamicTable from './DynamicTable';
import { usersApi } from '../api/usersApi';

const PageContainer = styled.div`
  margin-left: 280px;
  padding: 30px;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const ContentWrapper = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

const ControlBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
`;

const SearchInput = styled.input`
  flex: 1;
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
  padding: 12px 16px;
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

  &.confirm {
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
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState({ show: false, user: null, action: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (user) => {
    setConfirmAction({
      show: true,
      user: user,
      action: user.status === 'active' ? 'disable' : 'activate'
    });
  };

  const confirmToggleStatus = async () => {
    setProcessing(true);
    try {
      const newStatus = confirmAction.user.status === 'active' ? 'disabled' : 'active';
      await usersApi.toggleStatus(confirmAction.user.id, newStatus);
      setSuccessMessage(`User ${newStatus === 'active' ? 'activated' : 'disabled'} successfully!`);
      loadUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
      setConfirmAction({ show: false, user: null, action: '' });
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const cancelAction = () => {
    setConfirmAction({ show: false, user: null, action: '' });
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm);
      
      const matchesStatus = 
        statusFilter === 'All Status' ||
        (statusFilter === 'Active' && user.status === 'active') ||
        (statusFilter === 'Inactive' && user.status === 'disabled');

      const matchesRole =
        roleFilter === 'All Roles' ||
        user.Role?.name === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  };

  const userColumns = [
    { 
      key: 'id', 
      label: 'ID', 
      type: 'text',
      width: '60px',
      render: (value) => value
    },
    { 
      key: 'full_name', 
      label: 'Full Name', 
      type: 'text' 
    },
    { 
      key: 'email', 
      label: 'Email', 
      type: 'text' 
    },
    { 
      key: 'phone', 
      label: 'Phone', 
      type: 'text',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'Role.name', 
      label: 'Role', 
      type: 'text',
      render: (value, row) => row.Role?.name || 'N/A'
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'status',
      render: (value) => value === 'active' ? 'Active' : 'Disabled'
    }
  ];

  // Get unique roles for filter
  const uniqueRoles = ['All Roles', ...new Set(users.map(u => u.Role?.name).filter(Boolean))];

  return (
    <PageContainer>
      <Header>
        <Title>User Management</Title>
        <Subtitle>Manage system users and their access</Subtitle>
      </Header>

      <ContentWrapper>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        {successMessage && <SuccessMsg>✓ {successMessage}</SuccessMsg>}

        <ControlBar>
        <SearchInput
          type="text"
          placeholder="Search by name, email, username, or phone..."
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
        <FilterSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          {uniqueRoles.map(role => (
            <option key={role}>{role}</option>
          ))}
        </FilterSelect>
      </ControlBar>

      {loading ? (
        <LoadingMsg>Loading users...</LoadingMsg>
      ) : (
        <DynamicTable
          columns={userColumns}
          data={getFilteredUsers()}
          onEdit={null}
          onDelete={null}
          onView={null}
          customActions={(row) => [
            {
              icon: row.status === 'active' ? FaUserSlash : FaUserCheck,
              label: row.status === 'active' ? 'Disable' : 'Activate',
              onClick: () => handleToggleStatus(row),
              color: row.status === 'active' ? '#d32f2f' : '#2e7d32'
            }
          ]}
        />
      )}
      </ContentWrapper>

      {confirmAction.show && (
        <ConfirmOverlay onClick={cancelAction}>
          <ConfirmDialog onClick={(e) => e.stopPropagation()}>
            <ConfirmHeader>
              <ConfirmTitle>
                Confirm {confirmAction.action === 'activate' ? 'Activation' : 'Deactivation'}
              </ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              Are you sure you want to {confirmAction.action} user <strong>{confirmAction.user?.full_name || confirmAction.user?.username}</strong>?
              {confirmAction.action === 'disable' && (
                <div style={{ marginTop: '10px', color: '#d32f2f' }}>
                  ⚠️ This user will not be able to access the system.
                </div>
              )}
            </ConfirmBody>
            <ConfirmFooter>
              <ConfirmButton 
                className="cancel" 
                onClick={cancelAction}
                disabled={processing}
              >
                Cancel
              </ConfirmButton>
              <ConfirmButton 
                className="confirm" 
                onClick={confirmToggleStatus}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </ConfirmButton>
            </ConfirmFooter>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}
    </PageContainer>
  );
};

export default UserManagement;
