import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Layout/Header.jsx';
import LoginSignup from '../components/Login/LoginSignup.jsx'; 

function Auth() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  console.log('Auth Page - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  // Auto-redirect to admin if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Don't show login page while checking auth
  if (isLoading) {
    return null;
  }

  return (
    <div>
      <Header />
      <LoginSignup />
    </div>
  );
}

export default Auth;
