import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();
const FAVORITES_STORAGE_KEY_PREFIX = '@nectar_favorite_items';

export function FavoritesProvider({ children }) {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Get user-specific storage key
  const getFavoritesStorageKey = () => {
    return user ? `${FAVORITES_STORAGE_KEY_PREFIX}_${user.email.replace(/[@.]/g, '_')}` : `${FAVORITES_STORAGE_KEY_PREFIX}_guest`;
  };

  // Load favorite items from AsyncStorage whenever user changes
  useEffect(() => {
    const loadFavoriteItems = async () => {
      try {
        setIsLoading(true);
        const storageKey = getFavoritesStorageKey();
        const storedItems = await AsyncStorage.getItem(storageKey);
        if (storedItems !== null) {
          setFavoriteItems(JSON.parse(storedItems));
        } else {
          setFavoriteItems([]); // Reset favorites when changing users
        }
      } catch (error) {
        console.error('Error loading favorite items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteItems();
  }, [user?.email]); // Reload favorites when user changes

  // Save to AsyncStorage whenever favorite items change
  const saveFavoriteItems = async (items) => {
    try {
      const storageKey = getFavoritesStorageKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving favorite items:', error);
    }
  };

  const addToFavorites = (item) => {
    // Only add to favorites if item is in stock
    if (!item.inStock) {
      return;
    }
    
    setFavoriteItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems;
      }
      const updatedItems = [...prevItems, { ...item }];
      saveFavoriteItems(updatedItems);
      return updatedItems;
    });
  };

  const removeFromFavorites = (itemId) => {
    setFavoriteItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      saveFavoriteItems(updatedItems);
      return updatedItems;
    });
  };

  const isFavorite = (itemId) => {
    return favoriteItems.some(item => item.id === itemId);
  };

  const clearFavorites = async () => {
    try {
      const storageKey = getFavoritesStorageKey();
      await AsyncStorage.removeItem(storageKey);
      setFavoriteItems([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteItems,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites,
      isLoading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}