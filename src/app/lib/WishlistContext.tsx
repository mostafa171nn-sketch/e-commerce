'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { WishlistItem, getWishlist, addToWishlist, removeFromWishlist } from './wishlist';

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFromLocalStorage = () => {
    // Try all possible localStorage keys to find existing wishlist data
    const possibleKeys = [];

    // Add user-specific key if we have user id and it's not empty
    if (user?.id && user.id !== '') {
      possibleKeys.push(`wishlist_${user.id}`);
    }

    // Always check guest wishlist
    possibleKeys.push('guest_wishlist');

    // Check legacy key for backward compatibility
    possibleKeys.push('wishlist_');

    // Try to find any existing wishlist data
    for (const key of possibleKeys) {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setWishlist(parsedData);
            return; // Found data, stop looking
          }
        } catch (err) {
          // Continue to next key
        }
      }
    }

    setWishlist([]);
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && token) {
      const syncWithAPI = async () => {
        setLoading(true);
        setError(null);
        try {
          const apiWishlist = await getWishlist(token);

          let currentWishlist = [...wishlist];

          apiWishlist.forEach((apiItem: WishlistItem) => {
            if (!currentWishlist.some(localItem => localItem.id === apiItem.id)) {
              currentWishlist.push(apiItem);
            }
          });

          const guestWishlist = localStorage.getItem('guest_wishlist');
          if (guestWishlist) {
            try {
              const parsedGuestWishlist = JSON.parse(guestWishlist);
              parsedGuestWishlist.forEach((guestItem: WishlistItem) => {
                if (!currentWishlist.some(item => item.id === guestItem.id)) {
                  currentWishlist.push(guestItem);
                  addToWishlist(guestItem.id, token).catch(err => {});
                }
              });
              localStorage.removeItem('guest_wishlist');
            } catch (err) {
            
            }
          }

          setWishlist(currentWishlist);
        } catch (err: any) {
          if (wishlist.length === 0) {
            setError('Failed to load wishlist');
          }
          if (err.message.includes('Unauthorized')) {
            logout();
          }
        } finally {
          setLoading(false);
        }
      };

      syncWithAPI();
    }
  }, [isAuthenticated, token, logout]);

  useEffect(() => {
    localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));

    if (isAuthenticated && user?.id) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated, user?.id]);

  const handleAddToWishlist = async (product: WishlistItem) => {
    if (isInWishlist(product.id)) {
      return;
    }

    setError(null);
    const newWishlist = [...wishlist, product];
    setWishlist(newWishlist);

    if (isAuthenticated && token) {
      try {
        await addToWishlist(product.id, token);
      } catch (err: any) {
        if (err.message.includes('Unauthorized')) {
          setError('Session expired. Please log in again.');
          logout();
        } else {
          setError('Failed to sync with server, but item saved locally');
        }
      }
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    const newWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(newWishlist);
    setError(null);

    if (isAuthenticated && token) {
      try {
        await removeFromWishlist(productId, token);
      } catch (err: any) {
        setWishlist(wishlist);
        if (err.message.includes('Unauthorized')) {
          setError('Session expired. Please log in again.');
          logout();
        } else {
          setError('Failed to remove from wishlist');
        }
        console.error('Error removing from wishlist:', err);
      }
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    if (isAuthenticated && user?.id) {
      localStorage.removeItem(`wishlist_${user.id}`);
    } else if (!isAuthenticated) {
      localStorage.removeItem('guest_wishlist');
    }
  };

  const value: WishlistContextType = {
    wishlist,
    loading,
    error,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
