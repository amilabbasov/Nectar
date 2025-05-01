import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('./assets/images/appItems/splash.png')}
          style={styles.splashIcon}
          resizeMode="contain"
        />
        <ActivityIndicator 
          size="large" 
          color="#FFFFFF" 
          style={styles.loadingIndicator}
        />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome/welcome" />;
  }

  return <Redirect href="/(tabs)/shop" />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#53B175',
  },
  splashIcon: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 100,
  }
});

export default Index;