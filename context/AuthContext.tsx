import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>; // New function to reload user data
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for storage
const USER_STORAGE_KEY = 'nectar_user';
const USERS_STORAGE_KEY = 'nectar_users';

// Helper function to create valid SecureStore keys from emails
const getSecureStoreKey = (email: string): string => {
  // Replace @ and other invalid characters with valid ones
  return `nectar_pwd_${email.replace(/[@.]/g, '_')}`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    loadUser();
  }, [loadAttempts]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          // If corrupted, clear the data
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to reload user data on demand
  const reloadUser = async () => {
    setLoadAttempts(prev => prev + 1);
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Get the list of registered users
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: Record<string, User> = usersData ? JSON.parse(usersData) : {};
      
      // Check if user exists
      if (!users[email]) {
        throw new Error('No account exists with this email');
      }
      
      // Get stored password hash for this user
      const secureKey = getSecureStoreKey(email);
      const storedPassword = await SecureStore.getItemAsync(secureKey);
      
      // Validate password (in a real app, you'd use a proper hashing algorithm)
      if (storedPassword !== password) {
        throw new Error('Incorrect password');
      }
      
      // Login successful
      const userData = users[email];
      
      // Set current user
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Failed to sign in');
      }
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Get existing users
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      
      // Parse users or initialize as empty object if null/undefined
      let users: Record<string, User> = {};
      if (usersData) {
        try {
          users = JSON.parse(usersData);
        } catch (parseError) {
          console.error('Error parsing users data:', parseError);
          // If data is corrupted, reset it
          users = {};
        }
      }
      
      // Check if user already exists
      if (users[email]) {
        throw new Error('An account with this email already exists');
      }
      
      // Create new user
      const newUser = {
        name,
        email,
      };
      
      // Store user data
      users[email] = newUser;
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Store password securely using the safe key format
      const secureKey = getSecureStoreKey(email);
      await SecureStore.setItemAsync(secureKey, password);
      
      // Set as current user
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Failed to create account');
      }
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      throw new Error('Failed to sign out');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    reloadUser, // Add the new function to the context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}