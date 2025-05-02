import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, StyleSheet } from 'react-native';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={styles.loadingContainer} />;
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome/welcome" />;
  }

  return <Redirect href="/(tabs)/shop" />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#53B175',
  }
});

export default Index;