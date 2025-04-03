"use client";
import { useState, useEffect } from "react";
import { useLocationContext } from "@/contexts/LocationContext";

const LocationPermission = () => {
  const { error, startTracking, isTracking } = useLocationContext();
  const [showPrompt, setShowPrompt] = useState(false);
  const [permissionState, setPermissionState] = useState("unknown");

  useEffect(() => {
    // Check if the browser supports the permissions API
    if (navigator.permissions && navigator.permissions.query) {
      checkPermission();
    } else {
      // For browsers that don't support the permissions API, show prompt
      setShowPrompt(true);
    }
  }, []);

  const checkPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermissionState(result.state);

      // If permission state changes
      result.onchange = () => {
        setPermissionState(result.state);
      };

      if (result.state === "prompt") {
        setShowPrompt(true);
      } else if (result.state === "granted" && !isTracking) {
        startTracking();
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      setShowPrompt(true);
    }
  };

  const handleRequestPermission = () => {
    startTracking();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-blue-200 z-50 max-w-md mx-auto">
      <h3 className="font-semibold text-lg mb-2">Enable Location Services</h3>
      <p className="mb-4">
        This app uses your location to show you nearby products and provide
        indoor navigation. Would you like to enable location services?
      </p>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <div className="flex space-x-2">
        <button
          onClick={handleRequestPermission}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enable Location
        </button>
        <button
          onClick={handleDismiss}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Not Now
        </button>
      </div>
    </div>
  );
};

export default LocationPermission;
