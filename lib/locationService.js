import { doc, updateDoc, GeoPoint } from "firebase/firestore";
import { db } from "./firebase";

// Helper function for reverse geocoding
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Extract relevant address components
    const city =
      data.address.city || data.address.town || data.address.village || "";
    const postalCode = data.address.postcode || "";
    const country = data.address.country || "";

    return {
      city,
      postalCode,
      country,
      fullAddress: data.display_name || "",
      raw: data.address, // Include raw address data for potential future use
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return {
      city: "",
      postalCode: "",
      country: "",
      fullAddress: "",
      error: error.message,
    };
  }
};

// Update user's location in Firestore with geocoded address
export const updateUserLocation = async (userId, latitude, longitude) => {
  try {
    const userRef = doc(db, "users", userId);
    const geoPoint = new GeoPoint(latitude, longitude);

    // Get address information from reverse geocoding
    const address = await reverseGeocode(latitude, longitude);

    const updateData = {
      location: geoPoint,
      lastLocationUpdate: new Date(),
    };

    // Only add address fields if we got valid data
    if (address && !address.error) {
      updateData.address = {
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
        fullAddress: address.fullAddress,
        updatedAt: new Date(),
      };
    }

    await updateDoc(userRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating user location:", error);
    return false;
  }
};

// Calculate distance between two GeoPoints (in meters)
export const calculateDistance = (geoPoint1, geoPoint2) => {
  if (!geoPoint1 || !geoPoint2) return null;

  // Haversine formula for calculating distance between two points on Earth
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters

  const lat1 = geoPoint1.latitude;
  const lon1 = geoPoint1.longitude;
  const lat2 = geoPoint2.latitude;
  const lon2 = geoPoint2.longitude;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

// Get human-readable address from coordinates
export const getAddressFromCoordinates = async (latitude, longitude) => {
  return await reverseGeocode(latitude, longitude);
};
