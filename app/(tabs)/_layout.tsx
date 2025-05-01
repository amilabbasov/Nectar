import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 80 : 70,
          backgroundColor: '#FFFFFF',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
            },
            android: {
              elevation: 10,
            },
          }),
          borderTopWidth: 0,
          overflow: 'hidden',
          paddingHorizontal: 8,
        },

        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/tabIcons/shop.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color === '#4CAF50' ? '#4CAF50' : '#9E9E9E',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/tabIcons/explore.png')}
              style={{
                width: 28.35,
                height: 18.2,
                tintColor: color === '#4CAF50' ? '#4CAF50' : '#9E9E9E'
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/tabIcons/cart.png')}
              style={{
                width: 21.96,
                height: 19.56,
                tintColor: color === '#4CAF50' ? '#4CAF50' : '#9E9E9E'
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: "Favourite",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/tabIcons/favourite.png')}
              style={{
                width: 22.8,
                height: 19.6,
                tintColor: color === '#4CAF50' ? '#4CAF50' : '#9E9E9E'
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/tabIcons/account.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color === '#4CAF50' ? '#4CAF50' : '#9E9E9E'
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}