import React from 'react';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

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
