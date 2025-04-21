// hooks/useLocation.js
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { updateUserLocation } from "@/lib/locationService";
import { reverseGeocode } from "@/utils/geocode";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateAddress = async (latitude, longitude) => {
    try {
      const geoData = await reverseGeocode(latitude, longitude);
      setAddress(geoData);
      return geoData;
    } catch (err) {
      console.error("Error in reverse geocoding:", err);
      setAddress(null);
      return null;
    }
  };

  useEffect(() => {
    let watchId;

    const startLocationTracking = async () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
        return;
      }

      try {
        // First get a quick initial position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            await updateAddress(latitude, longitude);
            setLoading(false);

            // Update user location in Firestore if user is logged in
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

        // Then start watching for position updates
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            await updateAddress(latitude, longitude);

            // Update user location in Firestore if user is logged in
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
      } catch (err) {
        setError(`Error initializing location tracking: ${err.message}`);
        setLoading(false);
      }
    };

    startLocationTracking();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return { location, address, error, loading };
};

export default useLocation;
