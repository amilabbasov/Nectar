import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, StyleSheet, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const Index = () => {
  const { user, loading } = useAuth();

  // Prevent auto-hiding of splash screen
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    
    // Hide splash screen after a short delay
    setTimeout(async () => {
      await SplashScreen.hideAsync().catch(e => console.log("Error hiding splash:", e));
    }, 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('./assets/images/appItems/splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
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
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '70%',
    height: '40%',
    resizeMode: 'contain',
  },
});

export default Index;