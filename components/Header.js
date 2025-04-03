"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import Logout from "./Logout";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <Link href="/">
        <span>Home</span>
      </Link>
      <Link href="/products">Products</Link>
      <Link href="/products/map">Product Map</Link>
      <div>
        {user ? (
          <>
            <Link href="/profile" className="mr-4">
              Profile
            </Link>
            <Logout />
          </>
        ) : (
          <>
            <Link href="/signup" className="mr-4">
              Sign Up
            </Link>
            <Link href="/signin">Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
}
