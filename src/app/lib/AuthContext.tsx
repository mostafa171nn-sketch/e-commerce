'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken, getUserProfile } from './auth';

interface User {
  id?: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData?: User | null) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const result = await getUserProfile(storedToken);
          if (result.message === 'success') {
            setToken(storedToken);
            setUser(result.user);
            localStorage.setItem('user', JSON.stringify(result.user));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (newToken: string, userData: User | null = null) => {
    try {
      const result = await getUserProfile(newToken);
      if (result.message === 'success') {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
      } else {
        throw new Error(result.message || 'Failed to get user profile');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      throw error;
    }

    const guestWishlist = localStorage.getItem('guest_wishlist');
    if (guestWishlist) {
      try {
        const parsedGuestWishlist = JSON.parse(guestWishlist);
       
        localStorage.removeItem('guest_wishlist');
      } catch (error) {
        console.error('Failed to parse guest wishlist:', error);
      }
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    const userId = user?.id;
    if (userId) {
      const userCart = localStorage.getItem(`cart_${userId}`);
      const userWishlist = localStorage.getItem(`wishlist_${userId}`);

      if (userCart) {
        localStorage.setItem('guest_cart', userCart);
        localStorage.removeItem(`cart_${userId}`);
      }

      if (userWishlist) {
        localStorage.setItem('guest_wishlist', userWishlist);
        localStorage.removeItem(`wishlist_${userId}`);
      }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
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
