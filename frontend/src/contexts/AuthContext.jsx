import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshAccessToken } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session khi app mount
  useEffect(() => {
    let isCancelled = false;
    
    const restoreSession = async () => {
      try {
        await refreshAccessToken();
        if (!isCancelled) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        if (!isCancelled) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();
    
    return () => {
      isCancelled = true;
    };
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
