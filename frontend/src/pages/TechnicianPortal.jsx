import React, { useState } from 'react';
import TechnicianLogin from '../components/Technician/TechnicianLogin';
import TechnicianWorkOrders from '../components/Technician/TechnicianWorkOrders';
import TechnicianWorkOrderDetail from '../components/Technician/TechnicianWorkOrderDetail';

const TechnicianPortal = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'workOrders', 'detail'
  const [user, setUser] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('workOrders');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
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
