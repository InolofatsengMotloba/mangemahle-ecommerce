import { useState, useEffect } from "react";
import { calculateDistance } from "@/lib/locationService";

const LocationDisplay = ({
  userLocation,
  productLocation,
  showDistance = true,
}) => {
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (showDistance && userLocation && productLocation) {
      const dist = calculateDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        {
          latitude: productLocation.latitude,
          longitude: productLocation.longitude,
        }
      );
      setDistance(dist);
    }
  }, [userLocation, productLocation, showDistance]);

  const formatLocation = (location) => {
    if (!location) return "Unknown";
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  };

  const formatDistance = (meters) => {
    if (meters === null) return "Unknown";
    if (meters < 1000) {
      return `${Math.round(meters)} meters`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      {productLocation && (
        <div className="mb-2">
          <span className="font-medium">Product Location:</span>{" "}
          {formatLocation(productLocation)}
        </div>
      )}

      {userLocation && (
        <div className="mb-2">
          <span className="font-medium">Your Location:</span>{" "}
          {formatLocation(userLocation)}
        </div>
      )}

      {showDistance && distance !== null && (
        <div className="text-blue-600 font-medium">
          Distance: {formatDistance(distance)}
        </div>
      )}

      {!userLocation && (
        <div className="text-yellow-600">
          Enable location services to see your position and distance to product.
        </div>
      )}
    </div>
  );
};

export default LocationDisplay;
