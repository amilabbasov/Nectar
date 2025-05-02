import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, StyleSheet, Image, StatusBar, Animated } from 'react-native';

const Index = () => {
  const { user, loading } = useAuth();
  const [splashVisible, setSplashVisible] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    StatusBar.setHidden(true, 'none');
    
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setSplashVisible(false);
        StatusBar.setHidden(false, 'fade');
      });
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false, 'fade');
    };
  }, []);

  if (splashVisible) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <Image 
          source={require('./assets/images/appItems/splash.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </Animated.View>
    );
  }

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
  splashContainer: {
    flex: 1,
    backgroundColor: '#1CA044',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1CA044',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: 200,
    height: 200,
  },
});

export default Index;