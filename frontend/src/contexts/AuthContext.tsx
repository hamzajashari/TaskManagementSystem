import React, { createContext, useContext, useState, useEffect } from 'react';
import { JwtTokenResponse } from '../models/auth/AuthTypes';
import axiosClient from '../axiosClient';
import Loading from '../components/ui/Loading';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (tokens: JwtTokenResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in when the app starts
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Get stored tokens
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to use the existing token
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axiosClient.get('/api/account/health');
        setIsAuthenticated(true);
      } catch (error) {
        // Token expired, try to refresh
        if (refreshToken) {
          try {
            const result = await axiosClient.get('/api/account/getrefreshtoken', {
              params: { accessToken: token, refreshToken }
            });
            
            // Save new tokens
            const newTokens = result.data;
            localStorage.setItem('accessToken', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;
            setIsAuthenticated(true);
          } catch {
            // Refresh failed, user needs to login again
            handleLogout();
          }
        } else {
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Save tokens and update auth state
  const handleLogin = (tokens: JwtTokenResponse) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
    setIsAuthenticated(true);
  };

  // Clear tokens and auth state
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axiosClient.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login: handleLogin, 
      logout: handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}; 