import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Base key for cart storage
const CART_STORAGE_BASE_KEY = 'nectar_cart';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Generate user-specific cart key
  const getCartKey = () => {
    if (user && user.email) {
      return `${CART_STORAGE_BASE_KEY}_${user.email.replace(/[@.]/g, '_')}`;
    }
    return CART_STORAGE_BASE_KEY; // Fallback for non-logged in users
  };

  // Load cart from AsyncStorage on initial render, when refresh is triggered, and when user changes
  useEffect(() => {
    loadCart();
  }, [refreshTrigger, user?.email]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartKey = getCartKey();
      const savedCart = await AsyncStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (parseError) {
          console.error('Error parsing cart data:', parseError);
          // If corrupted, reset the cart
          await AsyncStorage.removeItem(cartKey);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        const cartKey = getCartKey();
        await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    if (!loading) {
      saveCart();
    }
  }, [cart, loading, user?.email]);

  // Function to force refresh the cart from storage
  const refreshCart = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    const itemToAdd = {
      ...item,
      quantity: item.quantity || quantity
    };
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...prevCart[existingItemIndex],
          quantity: prevCart[existingItemIndex].quantity + (item.quantity || quantity)
        };
        return updatedCart;
      } else {
        // Add new item with quantity
        return [...prevCart, itemToAdd];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = async () => {
    try {
      const cartKey = getCartKey();
      await AsyncStorage.removeItem(cartKey);
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Calculate total price of items in cart
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get the total number of items in the cart
  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};