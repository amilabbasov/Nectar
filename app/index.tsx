import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome/welcome" />;
  }

  return <Redirect href="/(tabs)/shop" />;
};

export default Index;