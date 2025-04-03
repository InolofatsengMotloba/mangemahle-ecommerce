"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, GeoPoint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Logout from "@/components/Logout";
import useLocation from "@/hooks/useLocation";
import LocationDisplay from "@/components/LocationDisplay";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const {
    location,
    error: locationError,
    loading: locationLoading,
  } = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await fetchUserData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
  };

  const updateLocationManually = async () => {
    if (!user || !location) return;

    try {
      setUpdating(true);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        location: new GeoPoint(location.latitude, location.longitude),
        lastUpdated: new Date(),
      });

      // Refresh user data
      await fetchUserData(user.uid);
      setUpdating(false);
    } catch (error) {
      console.error("Error updating location:", error);
      setUpdating(false);
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  // Extract location from userData
  const userDataLocation = userData?.location
    ? {
        latitude: userData.location.latitude,
        longitude: userData.location.longitude,
      }
    : null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      {userData ? (
        <div>
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {userData.lastUpdated?.toDate().toLocaleString() || "Never"}
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Your Location</h3>
          {locationLoading ? (
            <p>Getting your location...</p>
          ) : locationError ? (
            <p className="text-red-500">{locationError}</p>
          ) : (
            <>
              <LocationDisplay userLocation={userDataLocation} />

              <div className="mt-4">
                <button
                  onClick={updateLocationManually}
                  disabled={updating || !location}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {updating ? "Updating..." : "Update My Location"}
                </button>
              </div>
            </>
          )}

          <div className="mt-6">
            <Logout />
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
