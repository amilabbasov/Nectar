import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { CartProvider } from '../context/CartContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { AuthProvider } from '../context/AuthContext';
import { LocationProvider } from '../context/LocationContext';
import { OrdersProvider } from '../context/OrdersContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'MaterialCommunityIcons': require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  // Prepare app resources
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load any data or resources here
        // Add a longer delay to ensure splash screen is visible
        await new Promise(resolve => setTimeout(resolve, 2500));
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && appIsReady) {
      // Add a small delay before hiding splash screen for smoother transition
      setTimeout(async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          // Handle any errors hiding the splash screen
          console.log("Error hiding splash screen:", e);
        }
      }, 500);
    }
  }, [fontsLoaded, appIsReady]);

  // Show a loading screen that matches your splash screen colors
  if (!fontsLoaded || !appIsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <FavoritesProvider>
                <OrdersProvider>
                  <PaperProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    </Stack>
                  </PaperProvider>
                </OrdersProvider>
              </FavoritesProvider>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#53B175', // Match your splash screen background color
  }
});