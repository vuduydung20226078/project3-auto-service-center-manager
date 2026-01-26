import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshAccessToken } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Restore session khi app mount
  useEffect(() => {
    let isCancelled = false;
    
    const restoreSession = async () => {
      try {
        await refreshAccessToken();
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (!isCancelled) {
          setIsAuthenticated(true);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setIsAuthenticated(false);
          setUser(null);
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
    // Get user from localStorage when login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
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
