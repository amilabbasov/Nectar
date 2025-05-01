import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_COUNTRIES } from '../app/data/locationData';

const LOCATION_STORAGE_KEY = '@nectar_user_location';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved location on initial render
  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const locationData = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
        
        if (locationData) {
          const { country, city } = JSON.parse(locationData);
          setSelectedCountry(country);
          setSelectedCity(city);
          
          // Also set available cities based on the country
          if (country) {
            const countryCities = INITIAL_COUNTRIES[country.code]?.cities || [];
            setCities(countryCities);
          }
        }
      } catch (err) {
        console.error('Error loading location data:', err);
        setError('Failed to load location data');
      } finally {
        setLoading(false);
      }
    };

    loadSavedLocation();
  }, []);

  // Save location data whenever it changes
  const saveLocationData = async (country, city) => {
    try {
      const locationData = { country, city };
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
    } catch (err) {
      console.error('Error saving location data:', err);
      setError('Failed to save location data');
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedCity(null); // Reset selected city when country changes
    
    // Update available cities based on selected country
    const countryCities = INITIAL_COUNTRIES[country.code]?.cities || [];
    setCities(countryCities);
    
    // Save the partial location data (just country for now)
    saveLocationData(country, null);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    
    // Save the complete location data
    saveLocationData(selectedCountry, city);
  };

  const clearLocation = async () => {
    try {
      await AsyncStorage.removeItem(LOCATION_STORAGE_KEY);
      setSelectedCountry(null);
      setSelectedCity(null);
      setCities([]);
    } catch (err) {
      console.error('Error clearing location data:', err);
      setError('Failed to clear location data');
    }
  };

  // Get formatted location string for display
  const getFormattedLocation = () => {
    if (!selectedCity || !selectedCountry) return 'Select location';
    return `${selectedCity.title}, ${selectedCountry.title}`;
  };

  // Get list of all available countries from INITIAL_COUNTRIES
  const countries = Object.entries(INITIAL_COUNTRIES).map(([code, data]) => ({
    code,
    title: data.title,
    icon: data.icon
  }));

  return (
    <LocationContext.Provider
      value={{
        selectedCountry,
        selectedCity,
        cities,
        countries,
        loading,
        error,
        handleCountrySelect,
        handleCitySelect,
        clearLocation,
        getFormattedLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}