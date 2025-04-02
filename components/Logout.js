"use client";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
