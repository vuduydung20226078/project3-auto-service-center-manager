import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TechnicianLogin from '../components/Technician/TechnicianLogin';
import TechnicianWorkOrders from '../components/Technician/TechnicianWorkOrders';
import TechnicianWorkOrderDetail from '../components/Technician/TechnicianWorkOrderDetail';
import { logout as apiLogout } from '../api/auth';

const TechnicianPortal = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.role === 'Technician') {
          setUser(userData);
          setCurrentView('workOrders');
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('workOrders');
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear all auth data
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
    
    // Redirect to login page
    navigate('/');
  };

  const handleSelectWorkOrder = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedWorkOrder(null);
    setCurrentView('workOrders');
  };

  const handleStatusChange = (newStatus) => {
    console.log('Status changed to:', newStatus);
    // Sẽ update qua API sau
    alert(`Status changed to: ${newStatus}`);
  };

  if (currentView === 'login') {
    return <TechnicianLogin onLogin={handleLogin} />;
  }

  if (currentView === 'workOrders') {
    return (
      <TechnicianWorkOrders
        user={user}
        onLogout={handleLogout}
        onSelectWorkOrder={handleSelectWorkOrder}
      />
    );
  }

  if (currentView === 'detail') {
    return (
      <TechnicianWorkOrderDetail
        workOrder={selectedWorkOrder}
        onBack={handleBackToList}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return null;
};

export default TechnicianPortal;
