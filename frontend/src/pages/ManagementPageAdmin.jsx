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
import BookingManagement from '../components/MainContainerAdmin/BookingManagement';
import TechnicianSchedule from '../components/MainContainerAdmin/TechnicianSchedule';
import InvoiceManagement from '../components/MainContainerAdmin/InvoiceManagement';
const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const AdminContent = styled.main`
  flex: 1;
  min-width: 0;
  overflow-x: auto;
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
        return <TechnicianSchedule />;
      case 'bookings':
        return <BookingManagement />;
      case 'invoices':
        return <InvoiceManagement />;
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
      <AdminContent>
        {renderContent()}
      </AdminContent>
    </AdminContainer>
  );
};

export default AdminDashboard;
