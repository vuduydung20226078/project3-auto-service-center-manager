import React, { useState } from 'react';
import styled from 'styled-components';
import AdminSidebar from '../components/AdminSidebar';
import CategoryManagement from '../components/CategoryManagement';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('category');

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'category':
        return <CategoryManagement />;
      case 'inventory':
        return <div style={{ marginLeft: '280px', padding: '30px' }}>Inventory Management Coming Soon</div>;
      case 'appointment':
        return <div style={{ marginLeft: '280px', padding: '30px' }}>Appointment Management Coming Soon</div>;
      case 'workorder':
        return <div style={{ marginLeft: '280px', padding: '30px' }}>Work Order Coming Soon</div>;
      case 'technician':
        return <div style={{ marginLeft: '280px', padding: '30px' }}>Technician Assignment Coming Soon</div>;
      case 'control':
        return <div style={{ marginLeft: '280px', padding: '30px' }}>Control Panel Coming Soon</div>;
      default:
        return <CategoryManagement />;
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
