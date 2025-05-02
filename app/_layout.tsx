import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import 'react-native-reanimated';
import { CartProvider } from '../context/CartContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { AuthProvider } from '../context/AuthContext';
import { LocationProvider } from '../context/LocationContext';
import { OrdersProvider } from '../context/OrdersContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'MaterialCommunityIcons': require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  // Prepare app resources
  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.log("Error hiding splash screen:", e);
      }
    }
  }, [fontsLoaded, appIsReady]);

  // Show a simple loading screen with only background color matching splash
  if (!fontsLoaded || !appIsReady) {
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
    backgroundColor: '#53B175',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '70%',
    height: '40%',
  },
});

// Make sure the default export is explicit and at the end of the file
export default RootLayout;