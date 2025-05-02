import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from 'expo-font';
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import 'react-native-reanimated';
import { CartProvider } from '../context/CartContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { AuthProvider } from '../context/AuthContext';
import { LocationProvider } from '../context/LocationContext';
import { OrdersProvider } from '../context/OrdersContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

if (Platform && Platform.OS === 'ios') {
  StatusBar.setHidden(true);
}

function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'MaterialCommunityIcons': require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
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
      } catch (e) {
        console.log("Error handling splash screen:", e);
      }
    }
  }, [fontsLoaded, appIsReady]);

  if (!fontsLoaded || !appIsReady) {
    return null;
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
    backgroundColor: '#1CA044',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default RootLayout;