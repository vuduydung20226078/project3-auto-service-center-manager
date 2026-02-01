import React from 'react';
import Auth from './pages/Auth';
import AdminDashboard from './pages/ManagementPageAdmin';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerBookingPage from './pages/CustomerBookingPage';
import TechnicianPortal from './pages/TechnicianPortal';
import PaymentPage from './pages/PaymentPage';
import QRPaymentPage from './pages/QRPaymentPage';
import CreditCardPaymentPage from './pages/CreditCardPaymentPage';
import PaymentResultPage from './pages/PaymentResultPage';
import CustomerLayout from './components/Customer/CustomerLayout';
import CustomerHome from './pages/Customer/CustomerHome';
import CustomerBookings from './pages/Customer/CustomerBookings';
import CustomerCreateBooking from './pages/Customer/CustomerCreateBooking';
import CustomerBookingDetails from './pages/Customer/CustomerBookingDetails';
import CustomerVehicles from './pages/Customer/CustomerVehicles';
import CustomerVehicleDetails from './pages/Customer/CustomerVehicleDetails';
import CustomerProfile from './pages/Customer/CustomerProfile';
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
              ? <Navigate to="/customer" replace /> 
              : <Navigate to="/" />
          } 
        />
        
        {/* Customer Portal with Layout */}
        <Route 
          path="/customer" 
          element={
            isAuthenticated && user?.role === 'Customer' 
              ? <CustomerLayout /> 
              : <Navigate to="/" />
          }
        >
          <Route index element={<CustomerHome />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="bookings/new" element={<CustomerCreateBooking />} />
          <Route path="bookings/:id" element={<CustomerBookingDetails />} />
          <Route path="vehicles" element={<CustomerVehicles />} />
          <Route path="vehicles/:id" element={<CustomerVehicleDetails />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>
        
        {/* Admin Dashboard - for all roles except Customer */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated && user?.role !== 'Customer'
              ? <AdminDashboard /> 
              : <Navigate to="/" />
          } 
        />

        {/* Payment Page - accessible after invoice creation */}
        <Route 
          path="/payment" 
          element={
            isAuthenticated && user?.role !== 'Customer'
              ? <PaymentPage /> 
              : <Navigate to="/" />
          } 
        />

        {/* QR Payment Page - for MoMo and VNPAY */}
        <Route 
          path="/payment/qr" 
          element={
            isAuthenticated && user?.role !== 'Customer'
              ? <QRPaymentPage /> 
              : <Navigate to="/" />
          } 
        />

        {/* Credit Card Payment Page */}
        <Route 
          path="/payment/credit-card" 
          element={
            isAuthenticated && user?.role !== 'Customer'
              ? <CreditCardPaymentPage /> 
              : <Navigate to="/" />
          } 
        />

        {/* Payment Result Page - for VNPay return */}
        <Route 
          path="/payment/result" 
          element={<PaymentResultPage />} 
        />
      </Routes>
    </div>
  );
}

export default App;
