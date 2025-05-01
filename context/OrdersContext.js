import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();
const ORDERS_STORAGE_KEY_PREFIX = '@nectar_orders';

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Get user-specific storage key
  const getOrdersStorageKey = () => {
    return user ? `${ORDERS_STORAGE_KEY_PREFIX}_${user.email.replace(/[@.]/g, '_')}` : `${ORDERS_STORAGE_KEY_PREFIX}_guest`;
  };

  // Load orders from AsyncStorage whenever user changes
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const storageKey = getOrdersStorageKey();
        const storedOrders = await AsyncStorage.getItem(storageKey);
        
        if (storedOrders !== null) {
          setOrders(JSON.parse(storedOrders));
        } else {
          setOrders([]); // Reset orders when changing users
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user?.email]); // Reload orders when user changes

  // Save to AsyncStorage whenever orders change
  const saveOrders = async (updatedOrders) => {
    try {
      const storageKey = getOrdersStorageKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const addOrder = async (order) => {
    // Create a new order with a unique ID and timestamp
    const newOrder = {
      ...order,
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      status: order.status || 'processing', // Default status is processing
    };

    setOrders(prevOrders => {
      const updatedOrders = [newOrder, ...prevOrders];
      saveOrders(updatedOrders);
      return updatedOrders;
    });

    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      saveOrders(updatedOrders);
      return updatedOrders;
    });
  };

  const clearOrders = async () => {
    try {
      const storageKey = getOrdersStorageKey();
      await AsyncStorage.removeItem(storageKey);
      setOrders([]);
    } catch (error) {
      console.error('Error clearing orders:', error);
    }
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      addOrder,
      getOrderById,
      updateOrderStatus,
      clearOrders,
      isLoading
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}