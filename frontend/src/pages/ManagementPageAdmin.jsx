import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import AdminSidebar from '../components/Layout/AdminSidebar';
import Dashboard from '../components/MainContainerAdmin/Dashboard';
import CategoryManagement from '../components/MainContainerAdmin/CategoryManagement';
import UserManagement from '../components/MainContainerAdmin/UserManagement';
import InventoryManagement from '../components/MainContainerAdmin/InventoryManagement';
import WorkOrderManagement from '../components/MainContainerAdmin/WorkOrderManagement';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout: setAuthLogout } = useAuth();
  const [activeMenu, setActiveMenu] = useState(() => {
    return sessionStorage.getItem('activeMenu') || 'dashboard';
  });

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    sessionStorage.setItem('activeMenu', menuId);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setAuthLogout();
      navigate('/');
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'category':
        return <CategoryManagement />;
      case 'users':
        return <UserManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'appointment':
        return <div style={{ marginLeft: '280px', padding: '30px' }}>Appointment Management Coming Soon</div>;
      case 'workorder':
        return <WorkOrderManagement />;
      case 'technician':
        return <div style={{ marginLeft: '280px', padding: '30px' }}>Technician Assignment Coming Soon</div>;
      case 'control':
        return <div style={{ marginLeft: '280px', padding: '30px' }}>Control Panel Coming Soon</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminContainer>
      <AdminSidebar
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
      />
      {renderContent()}
    </AdminContainer>
  );
};

export default AdminDashboard;
