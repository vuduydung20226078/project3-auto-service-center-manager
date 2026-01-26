import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginSignup from '../components/Login/LoginSignup.jsx'; 

function Auth() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Auto-redirect based on user role if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'Customer') {
        navigate('/customerlogedin', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Don't show login page while checking auth
  if (isLoading) {
    return null;
  }

  return (
    <div>
      <LoginSignup />
    </div>
  );
}

export default Auth;
