'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface OrderItem {
  id: number;
  title: string;
  price: number;
  imageCover: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress?: {
    name: string;
    address: string;
    phone: string;
  };
  paymentMethod: 'cash' | 'visa';
}

interface CartActivity {
  id: string;
  productId: number;
  action: 'added' | 'removed' | 'increased' | 'decreased' | 'ordered';
  timestamp: string;
  quantity?: number;
}

interface OrdersContextType {
  orders: Order[];
  currentOrder: Order | null;
  cartActivity: CartActivity[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addCartActivity: (activity: Omit<CartActivity, 'id' | 'timestamp'>) => void;
  clearCartActivity: () => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [cartActivity, setCartActivity] = useState<CartActivity[]>([]);

  // Load orders and activity from localStorage on mount or user change
  useEffect(() => {
    if (user?.email) {
      const storedOrders = localStorage.getItem(`orders_${user.email}`);
      const storedCurrentOrder = localStorage.getItem(`currentOrder_${user.email}`);
      const storedActivity = localStorage.getItem(`cartActivity_${user.email}`);

      if (storedOrders) {
        try {
          setOrders(JSON.parse(storedOrders));
        } catch (error) {
          console.error('Failed to parse stored orders:', error);
        }
      }

      if (storedCurrentOrder) {
        try {
          setCurrentOrder(JSON.parse(storedCurrentOrder));
        } catch (error) {
          console.error('Failed to parse stored current order:', error);
        }
      }

      if (storedActivity) {
        try {
          setCartActivity(JSON.parse(storedActivity));
        } catch (error) {
          console.error('Failed to parse stored activity:', error);
        }
      }
    }
  }, [user?.email]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`orders_${user.email}`, JSON.stringify(orders));
    }
  }, [orders, user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`currentOrder_${user.email}`, JSON.stringify(currentOrder));
    }
  }, [currentOrder, user?.email]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`cartActivity_${user.email}`, JSON.stringify(cartActivity));
    }
  }, [cartActivity, user?.email]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    if (currentOrder?.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  const addCartActivity = (activity: Omit<CartActivity, 'id' | 'timestamp'>) => {
    const newActivity: CartActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setCartActivity(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
  };

  const clearCartActivity = () => {
    setCartActivity([]);
  };

  const value: OrdersContextType = {
    orders,
    currentOrder,
    cartActivity,
    addOrder,
    updateOrderStatus,
    addCartActivity,
    clearCartActivity,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
