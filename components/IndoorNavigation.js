"use client";
import { useState, useEffect } from "react";
import { calculateDistance } from "@/lib/locationService";

const IndoorNavigation = ({ userLocation, productLocation }) => {
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [heading, setHeading] = useState(null);
  const [compassAvailable, setCompassAvailable] = useState(false);

  // Calculate bearing between two points (in degrees)
  const calculateBearing = (start, end) => {
    if (!start || !end) return null;

    const startLat = (start.latitude * Math.PI) / 180;
    const startLng = (start.longitude * Math.PI) / 180;
    const endLat = (end.latitude * Math.PI) / 180;
    const endLng = (end.longitude * Math.PI) / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    if (bearing < 0) bearing += 360;

    return bearing;
  };

  // Update distance and bearing when locations change
  useEffect(() => {
    if (userLocation && productLocation) {
      // Calculate distance
      const dist = calculateDistance(userLocation, productLocation);
      setDistance(dist);

      // Calculate bearing
      const bear = calculateBearing(userLocation, productLocation);
      setBearing(bear);
    }
  }, [userLocation, productLocation]);

  // Set up device orientation/compass
  useEffect(() => {
    // Check if device orientation is available
    if (window.DeviceOrientationEvent) {
      // Request permission if needed (iOS 13+)
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        // Need to request on user interaction in iOS
        setCompassAvailable("needs-permission");
      } else {
        // Android and older iOS
        setCompassAvailable(true);

        const handleOrientation = (event) => {
          // Use compassHeading if available, otherwise use alpha
          let newHeading;
          if (event.webkitCompassHeading) {
            // iOS devices
            newHeading = event.webkitCompassHeading;
          } else if (event.alpha) {
            // Android devices
            newHeading = 360 - event.alpha; // Convert to compass heading
          }

          if (newHeading !== undefined) {
            setHeading(newHeading);
          }
        };

        window.addEventListener("deviceorientation", handleOrientation);

        return () => {
          window.removeEventListener("deviceorientation", handleOrientation);
        };
      }
    } else {
      setCompassAvailable(false);
    }
  }, []);

  // Request compass permission (for iOS)
  const requestCompassPermission = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const permissionState =
          await DeviceOrientationEvent.requestPermission();
        if (permissionState === "granted") {
          setCompassAvailable(true);

          const handleOrientation = (event) => {
            if (event.webkitCompassHeading) {
              setHeading(event.webkitCompassHeading);
            }
          };

          window.addEventListener("deviceorientation", handleOrientation);

          return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
          };
        } else {
          setCompassAvailable(false);
        }
      } catch (error) {
        console.error("Error requesting orientation permission:", error);
        setCompassAvailable(false);
      }
    }
  };

  // Determine the direction to point
  const getDirectionArrow = () => {
    if (heading === null || bearing === null) return null;

    // Calculate the relative direction to point
    let direction = bearing - heading;
    if (direction < 0) direction += 360;

    // Convert direction to an arrow
    return `transform rotate-[${direction}deg]`;
  };

  // Format distance
  const formatDistance = (meters) => {
    if (meters === null) return "Unknown";
    if (meters < 10) return "You're here!";
    if (meters < 1000) {
      return `${Math.round(meters)} meters`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  // For a simple compass-like direction
  const getDirection = () => {
    if (bearing === null) return "";

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  if (!userLocation || !productLocation) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p>Unable to start navigation. Location data missing.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Indoor Navigation</h3>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold">{formatDistance(distance)}</p>
          <p className="text-gray-600">Distance to product</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {compassAvailable === true && heading !== null ? (
              <svg
                className={getDirectionArrow()}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5L12 19"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 5L7 10"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 5L17 10"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <span className="text-xl font-bold">{getDirection()}</span>
            )}
          </div>
          <p className="text-sm mt-1">Head {getDirection()}</p>
        </div>
      </div>

      {compassAvailable === "needs-permission" && (
        <button
          onClick={requestCompassPermission}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Enable Compass
        </button>
      )}

      {compassAvailable === false && (
        <p className="text-yellow-600 text-sm">
          Compass not available on this device.
        </p>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>Follow the arrow to reach your product</p>
      </div>
    </div>
  );
};

export default IndoorNavigation;
