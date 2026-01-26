import React from 'react';
import Auth from './pages/Auth';
import AdminDashboard from './pages/ManagementPageAdmin';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerBookingPage from './pages/CustomerBookingPage';
import TechnicianPortal from './pages/TechnicianPortal';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Loading...
    </div>;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/booking" element={<CustomerBookingPage />} />
        <Route path="/technician" element={<TechnicianPortal />} />
        
        {/* Customer Dashboard - only for Customer role */}
        <Route 
          path="/customerlogedin" 
          element={
            isAuthenticated && user?.role === 'Customer' 
              ? <CustomerDashboard /> 
              : <Navigate to="/" />
          } 
        />
        
        {/* Admin Dashboard - for all roles except Customer */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated && user?.role !== 'Customer'
              ? <AdminDashboard /> 
              : <Navigate to="/" />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
