"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, GeoPoint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Logout from "@/components/Logout";
import useLocation from "@/hooks/useLocation";
import LocationDisplay from "@/components/LocationDisplay";
import { FiUser, FiMail, FiClock, FiMapPin, FiRefreshCw } from "react-icons/fi";

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

      await fetchUserData(user.uid);
      setUpdating(false);
    } catch (error) {
      console.error("Error updating location:", error);
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  const userDataLocation = userData?.location
    ? {
        latitude: userData.location.latitude,
        longitude: userData.location.longitude,
      }
    : null;

  return (
    <div className="max-w-md mx-auto m-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <header className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#385941]">My Profile</h2>
        <div className="w-16 h-1 bg-[#94bb9f] mx-auto mt-2"></div>
      </header>

      {userData ? (
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center mb-3">
              <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
                <FiUser className="text-[#385941]" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Account Information
              </h3>
            </div>

            <div className="space-y-3 pl-11">
              <div className="flex items-center">
                <FiUser className="text-[#94bb9f] mr-2" size={16} />
                <span className="text-gray-700">
                  <strong>Name:</strong> {userData.name || "Not provided"}
                </span>
              </div>

              <div className="flex items-center">
                <FiMail className="text-[#94bb9f] mr-2" size={16} />
                <span className="text-gray-700">
                  <strong>Email:</strong> {userData.email}
                </span>
              </div>

              <div className="flex items-center">
                <FiClock className="text-[#94bb9f] mr-2" size={16} />
                <span className="text-gray-700">
                  <strong>Last Updated:</strong>{" "}
                  {userData.lastUpdated?.toDate().toLocaleString() || "Never"}
                </span>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center mb-3">
              <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
                <FiMapPin className="text-[#385941]" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Your Location
              </h3>
            </div>

            {locationLoading ? (
              <div className="flex items-center text-gray-500 pl-11">
                <FiRefreshCw className="animate-spin mr-2" size={16} />
                Getting your location...
              </div>
            ) : locationError ? (
              <p className="text-red-500 pl-11">{locationError}</p>
            ) : (
              <div className="pl-11 space-y-4">
                <LocationDisplay userLocation={userDataLocation} />

                <button
                  onClick={updateLocationManually}
                  disabled={updating || !location}
                  className={`flex items-center px-4 py-2 rounded-lg text-white ${
                    updating || !location
                      ? "bg-gray-400"
                      : "bg-[#94bb9f] hover:bg-[#385941]"
                  } transition-colors`}
                >
                  {updating ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" size={16} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiMapPin className="mr-2" size={16} />
                      Update My Location
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Logout />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-8">
          <FiRefreshCw className="animate-spin text-[#94bb9f]" size={24} />
        </div>
      )}
    </div>
  );
};

export default Profile;
