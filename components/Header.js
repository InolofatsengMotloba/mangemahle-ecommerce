"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import Logout from "./Logout";
import CartIcon from "./CartIcon";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="relative z-50">
      <nav className="p-4 bg-black text-white flex justify-between items-center relative z-50">
        {/* Logo/Brand */}
        <div className="flex space-x-4">
          <Link href="/">
            <span className="font-extrabold text-lg">HerStore</span>
          </Link>
        </div>

        {/* Hamburger Icon (for mobile screens) */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none relative z-50"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Links & Cart (for desktop screens) */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/products/map">Product Map</Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile">Profile</Link>
                <CartIcon />
                <Logout />
              </>
            ) : (
              <>
                <Link href="/signup">Sign Up</Link>
                <Link href="/signin">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay when menu is open - positioned BELOW the nav */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black bg-opacity-70 z-40"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dropdown Menu for Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 w-full bg-black text-white p-4 flex flex-col space-y-4 shadow-lg z-50">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/products" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>
          <Link href="/products/map" onClick={() => setIsMenuOpen(false)}>
            Product Map
          </Link>
          {user ? (
            <>
              <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <div onClick={() => setIsMenuOpen(false)}>
                <CartIcon />
              </div>
              <Logout />
            </>
          ) : (
            <>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
              <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
