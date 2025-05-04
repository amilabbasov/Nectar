import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import { Ionicons } from '@expo/vector-icons';
const { SafeAreaView } = require('../../components/common');

const { height } = Dimensions.get('window');

export default function AccountScreen() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { clearLocation, getFormattedLocation } = useLocationContext();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Handle modal animations
  useEffect(() => {
    if (logoutModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          mass: 1,
          stiffness: 100,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          useNativeDriver: true,
          damping: 15,
          mass: 1,
          stiffness: 100,
        })
      ]).start();
    }
  }, [logoutModalVisible]);

  const menuItems = [
    {
      id: 'orders',
      title: 'Orders',
      icon: require('../assets/images/account/orders.png'),
      onPress: () => router.push('/orders'),
    },
    {
      id: 'details',
      title: 'My Details',
      icon: require('../assets/images/account/details.png'),
      onPress: () => router.push('/my-details'),
    },
    {
      id: 'address',
      title: 'Delivery Address',
      icon: require('../assets/images/account/address.png'),
      onPress: () => router.push('/delivery-address'),
    },
  ];

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);
      // Clear both auth and location data
      await signOut();
      await clearLocation();
      // Navigate to auth screen
      router.replace('../welcome/welcome');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#53B175" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={require('../assets/images/account/profile-placeholder.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Please login'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Image source={item.icon} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Image
                source={require('../assets/images/account/chevron-right.png')}
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Login/Logout Button */}
        {user ? (
          <TouchableOpacity style={styles.logoutButton} onPress={showLogoutModal}>
            <Image
              source={require('../assets/images/account/logout.png')}
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('/(auth)/welcome/welcome')}
          >
            <Ionicons name="log-in-outline" size={22} color="#53B175" style={styles.loginIcon} />
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        )}

        {/* Logout Confirmation Modal */}
        <Modal
          visible={logoutModalVisible}
          transparent={true}
          statusBarTranslucent={true}
          animationType="none"
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <TouchableOpacity 
              style={styles.dismissArea} 
              onPress={() => setLogoutModalVisible(false)}
              activeOpacity={1}
            />
            <Animated.View 
              style={[
                styles.modalContent, 
                { 
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }] 
                }
              ]}
            >
              <Image
                source={require('../assets/images/account/logout.png')}
                style={styles.modalIcon}
              />
              <Text style={styles.modalTitle}>Log Out</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to log out?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.confirmButtonText}>Yes, Logout</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    marginTop: 20,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  menuIconContainer: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  menuIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  menuTitle: {
    flex: 1,
    fontSize: 18,
    color: '#181725',
  },
  chevron: {
    width: 8,
    height: 16,
    resizeMode: 'contain',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: Platform.OS === 'android' ? 20 : 0,
  },
  logoutIcon: {
    width: 18,
    height: 18,
    marginRight: 12,
    tintColor: '#53B175',
  },
  logoutText: {
    color: '#53B175',
    fontSize: 18,
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: Platform.OS === 'android' ? 20 : 0,
  },
  loginIcon: {
    marginRight: 12,
  },
  loginText: {
    color: '#53B175',
    fontSize: 18,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalIcon: {
    width: 60,
    height: 60,
    tintColor: '#53B175',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#181725',
  },
  modalMessage: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F2F3F2',
  },
  confirmButton: {
    backgroundColor: '#53B175',
  },
  cancelButtonText: {
    color: '#181725',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});