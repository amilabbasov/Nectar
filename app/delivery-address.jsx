import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView, Marker } from 'expo-maps';
import { useLocationContext } from '../context/LocationContext';
import LOCATION_COORDINATES from '../app/data/locationCoordinates';

const { width, height } = Dimensions.get('window');

// Header Component
const Header = ({ onBack, title }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Ionicons name="arrow-back" size={24} color="#181725" />
    </TouchableOpacity>
    <Text style={styles.screenTitle}>{title}</Text>
    <View style={{ width: 24 }} />
  </View>
);

// Location Banner Component
const LocationBanner = ({ locationText }) => (
  <View style={styles.selectedLocationBanner}>
    <Ionicons name="location" size={20} color="#FFFFFF" />
    <Text style={styles.selectedLocationText}>{locationText}</Text>
  </View>
);

// Map Component
const LocationMap = ({ region, address, mapRef, onRecenter, errorMsg }) => (
  <View style={styles.mapContainer}>
    {errorMsg ? (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF4B4B" />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    ) : (
      <>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={false}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="Delivery Location"
            description={address}
            color="#53B175"  // Changed from pinColor to color for expo-maps
          />
        </MapView>
        
        <TouchableOpacity style={styles.recenterButton} onPress={onRecenter}>
          <Ionicons name="location" size={24} color="#fff" />
        </TouchableOpacity>
      </>
    )}
  </View>
);

// Address Details Component
const AddressDetails = ({ address, selectedCountry, selectedCity, onChangeLocation }) => (
  <View style={styles.addressContainer}>
    <View style={styles.addressHeader}>
      <Ionicons name="location" size={24} color="#53B175" />
      <Text style={styles.addressTitle}>Delivery Location</Text>
    </View>
    
    <View style={styles.addressCard}>
      <Text style={styles.addressText}>{address || 'Address not available'}</Text>
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationLabel}>Selected Zone:</Text>
        <Text style={styles.locationValue}>
          {selectedCountry ? `${selectedCountry.icon} ${selectedCountry.title}` : 'Not selected'}
        </Text>
      </View>
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationLabel}>Selected Area:</Text>
        <Text style={styles.locationValue}>
          {selectedCity ? `${selectedCity.icon} ${selectedCity.title}` : 'Not selected'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.changeLocationButton}
        onPress={onChangeLocation}
      >
        <Text style={styles.changeLocationText}>Change Location</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Loading Component
const LoadingScreen = () => (
  <SafeAreaView edges={['top']} style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#53B175" />
    <Text style={styles.loadingText}>Loading delivery location...</Text>
  </SafeAreaView>
);

export default function DeliveryAddressScreen() {
  const router = useRouter();
  const { selectedCountry, selectedCity, getFormattedLocation } = useLocationContext();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState('');
  const mapRef = useRef(null);

  // Default coordinates (will be overridden by selected location)
  const [region, setRegion] = useState({
    latitude: 40.4093,  // Default to Baku, Azerbaijan
    longitude: 49.8671,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadSelectedLocation();
  }, [selectedCity, selectedCountry, getFormattedLocation]);

  const loadSelectedLocation = () => {
    try {
      setLoading(true);
      
      if (!selectedCity || !selectedCountry) {
        setErrorMsg('No delivery location selected. Please select a location.');
        setLoading(false);
        return;
      }
      
      // Set the address from the selected location
      const formattedLocation = getFormattedLocation();
      setAddress(formattedLocation);
      
      // Try to use predefined coordinates instead of geocoding
      const cityName = selectedCity.title;
      let coordinates = LOCATION_COORDINATES[cityName];
      
      // If we don't have predefined coordinates for this city, use default
      if (!coordinates) {
        coordinates = LOCATION_COORDINATES.default;
      }
      
      // Set the map region to the coordinates
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      setErrorMsg('Failed to load selected location');
    } finally {
      setLoading(false);
    }
  };

  const animateToRegion = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const handleChangeLocation = () => {
    router.push('/(auth)/location/location');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header onBack={() => router.back()} title="Delivery Address" />
      
      {selectedCountry && selectedCity && (
        <LocationBanner locationText={getFormattedLocation()} />
      )}
      
      <LocationMap 
        region={region}
        address={address}
        mapRef={mapRef}
        onRecenter={animateToRegion}
        errorMsg={errorMsg}
      />
      
      <AddressDetails 
        address={address}
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
        onChangeLocation={handleChangeLocation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7C7C7C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
  },
  selectedLocationBanner: {
    backgroundColor: '#53B175',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedLocationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  mapContainer: {
    height: height * 0.4,
    position: 'relative',
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#53B175',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF4B4B',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  addressContainer: {
    flex: 1,
    padding: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181725',
    marginLeft: 8,
  },
  addressCard: {
    backgroundColor: '#F2F3F2',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addressText: {
    fontSize: 16,
    color: '#181725',
    marginBottom: 16,
    lineHeight: 24,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  locationLabel: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  locationValue: {
    fontSize: 16,
    color: '#181725',
    fontWeight: '500',
  },
  changeLocationButton: {
    backgroundColor: '#53B175',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  changeLocationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});