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
  const { location, loading, error } = useLocation();

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

  const displayLocation = userData?.location || location;

  return (
    <div className="bg-[#f9fbf8] border-b border-gray-200 px-4 py-2 flex items-center gap-2 justify-center w-full">
      <FaMapMarkerAlt className="text-[#2e4d3b]" size={18} />
      {loading ? (
        <p className="text-sm text-gray-500">Getting your location...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <p className="text-sm text-gray-700 text-center">
          {userData?.name && (
            <span className="font-medium">{userData.name} - </span>
          )}
          Lat: {displayLocation?.latitude?.toFixed(2)}, Lng:{" "}
          {displayLocation?.longitude?.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default LiveLocationBanner;
