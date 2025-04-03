"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { updateUserLocation } from "@/lib/locationService";

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchId, setWatchId] = useState(null);

  // Start tracking location
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    try {
      // Get initial position quickly
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLoading(false);

          // Update in Firestore if user is logged in
          const user = auth.currentUser;
          if (user) {
            updateUserLocation(user.uid, latitude, longitude);
          }
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      // Then start watching position for changes
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Update in Firestore if user is logged in
          const user = auth.currentUser;
          if (user) {
            updateUserLocation(user.uid, latitude, longitude);
          }
        },
        (err) => {
          setError(`Error tracking location: ${err.message}`);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      setWatchId(id);
    } catch (err) {
      setError(`Error initializing location tracking: ${err.message}`);
      setLoading(false);
    }
  };

  // Stop tracking location
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Auto-start tracking on mount
  useEffect(() => {
    startTracking();
  }, []);

  const value = {
    location,
    error,
    loading,
    startTracking,
    stopTracking,
    isTracking: watchId !== null,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
