// LiveLocationBanner.js
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useLocation from "@/hooks/useLocation";
import { FaMapMarkerAlt } from "react-icons/fa";

const LiveLocationBanner = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const { location, address, loading, error } = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const displayLocation = () => {
    if (userData?.address) {
      return userData.address.city
        ? `${userData.address.city}${
            userData.address.postalCode
              ? `, ${userData.address.postalCode}`
              : ""
          }`
        : "Unknown location";
    }

    if (address) {
      return address.city
        ? `${address.city}${
            address.postalCode ? `, ${address.postalCode}` : ""
          }`
        : "Unknown location";
    }

    if (location) {
      return `Lat: ${location.latitude?.toFixed(
        2
      )}, Lng: ${location.longitude?.toFixed(2)}`;
    }

    return "Location not available";
  };

  return (
    <div className="bg-[#fafafa] px-4 py-2 flex items-center gap-2 justify-center w-full relative z-40">
      <FaMapMarkerAlt className="text-black" size={18} />
      {loading ? (
        <p className="text-sm text-black">Getting your location...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <p className="text-sm text-black text-center">
          {userData?.name && (
            <span className="font-medium">{userData.name} - </span>
          )}
          {displayLocation()}
        </p>
      )}
    </div>
  );
};

export default LiveLocationBanner;
