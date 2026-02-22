'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken, getUserProfile } from './auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const result = await getUserProfile(storedToken);
          if (result.message === 'success') {
            setToken(storedToken);
            setUser(result.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const result = await getUserProfile(newToken);
      if (result.message === 'success') {
        setUser(result.user);
      }
    } catch (error) {
      console.error('Failed to get user profile:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
