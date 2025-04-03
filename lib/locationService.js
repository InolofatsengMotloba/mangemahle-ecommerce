import { doc, updateDoc, GeoPoint } from "firebase/firestore";
import { db } from "./firebase";

// Update user's location in Firestore
export const updateUserLocation = async (userId, latitude, longitude) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      location: new GeoPoint(latitude, longitude),
      lastLocationUpdate: new Date(),
    });
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
