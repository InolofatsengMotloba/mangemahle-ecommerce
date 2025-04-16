"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import Logout from "./Logout";
import CartIcon from "./CartIcon";
import LiveLocationBanner from "./LiveLocationBanner";
import Image from "next/image";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";

export default function Header() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Elements", path: "/elements" },
    { name: "Shop", path: "/products" },
    { name: "Blog", path: "/blog" },
    { name: "Pages", path: "/pages" },
  ];

  return (
    <header className="border-b border-gray-200 relative z-50">
      <LiveLocationBanner />
      <nav className="flex justify-between items-center px-6 py-4 bg-white">
        {/* Left: Search */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Type and hit enter"
            className="border px-4 py-2 rounded-md text-sm focus:outline-none"
          />
        </div>

        {/* Center: Logo */}
        <div>
          <Link href="/">
            <Image
              src="/mh-logo.png"
              alt="Logo"
              width={120}
              height={70}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6 relative">
          {/* Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="focus:outline-none"
            >
              <AiOutlineUser size="24" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md text-sm z-50">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Logout />
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/signin"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <AiOutlineShoppingCart size="24" />
        </div>
      </nav>

      {/* Navigation Links */}
      <div className="flex justify-center space-x-6 py-2 text-sm font-medium">
        {navLinks.map(({ name, path }) => (
          <Link
            key={name}
            href={path}
            className={`pb-1 border-b-2 ${
              pathname === path ? "border-black" : "border-transparent"
            } hover:border-black transition`}
          >
            {name}
          </Link>
        ))}
      </div>
    </header>
  );
}
