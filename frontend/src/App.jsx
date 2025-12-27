import React from 'react';
import Auth from './pages/Auth';
import AdminDashboard from './pages/ManagementPageAdmin';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Loading...
    </div>;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
