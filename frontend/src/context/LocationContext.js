import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_REGION } from '../config/constants';

const LocationContext = createContext({});

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (err) {
      setError('Failed to get location permission');
      console.error(err);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = currentLocation.coords;
      
      setLocation({
        latitude,
        longitude,
      });
      
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (err) {
      setError('Failed to get current location');
      console.error(err);
    }
  };

  const updateLocation = async () => {
    if (hasPermission) {
      await getCurrentLocation();
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        region,
        hasPermission,
        error,
        updateLocation,
        setRegion,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
