'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  title: string;
  price: number;
  imageCover: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isLoadedRef = useRef(false);

  // Load cart when user state is determined (on mount or login/logout)
  useEffect(() => {
    setIsLoading(true);
    if (user && user.id) {
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          setCart(parsedCart);
        } catch (error) {
          console.error('Failed to parse stored cart:', error);
          setCart([]);
        }
      } else {
        // Load guest cart if no user cart
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) {
          try {
            const parsedCart = JSON.parse(guestCart);
            setCart(parsedCart);
            // Save to user cart
            localStorage.setItem(`cart_${user.id}`, JSON.stringify(parsedCart));
            // Clear guest cart
            localStorage.removeItem('guest_cart');
          } catch (error) {
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }
    } else {
      // User not logged in, load guest cart
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        try {
          const parsedCart = JSON.parse(guestCart);
          setCart(parsedCart);
        } catch (error) {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    const key = user?.id ? `cart_${user.id}` : 'guest_cart';
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user?.id]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (id: number) => {
    return cart.some(item => item.id === id);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextType = {
    cart,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isInCart,
    isLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
