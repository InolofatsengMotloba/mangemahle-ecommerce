"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import Logout from "./Logout";
import LiveLocationBanner from "./LiveLocationBanner";
import Image from "next/image";
import { AiOutlineUser, AiOutlineSearch } from "react-icons/ai";
import SearchInput from "./SearchInput";
import {
  FiShoppingCart,
  FiCreditCard,
  FiUserPlus,
  FiUser,
  FiLogIn,
} from "react-icons/fi";
import CartIcon from "./CartIcon";

export default function Header() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize search query from URL if it exists
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(decodeURIComponent(search));
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [searchParams]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "About Us", path: "/about-us" },
    { name: "Support", path: "/support" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("search", encodeURIComponent(searchQuery.trim()));
    } else {
      params.delete("search");
    }

    // Preserve other query parameters
    router.push(`${pathname}?${params.toString()}`);
    setShowMobileSearch(false);
  };

  return (
    <header className="border-b border-gray-200 relative z-50">
      <LiveLocationBanner />

      {/* Top Navigation Row */}
      <nav className="flex justify-between items-center px-4 sm:px-6 py-4 bg-white">
        {/* Left: Logo on mobile, search on desktop */}
        <div className="flex items-center">
          <div className="lg:hidden">
            <Link href="/">
              <Image
                src="/mh-logo.png"
                alt="Logo"
                width={80}
                height={50}
                className="object-contain h-10"
                priority
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <SearchInput query={searchQuery} setQuery={setSearchQuery} />
            </form>
          </div>
        </div>

        {/* Center: Logo on desktop */}
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
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

        {/* Right: Icons and mobile search */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Mobile Search Button */}
          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <AiOutlineSearch size="20" />
          </button>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center"
          >
            <CartIcon size={24} />
          </Link>

          {/* Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="focus:outline-none"
            >
              <AiOutlineUser size="20" className="sm:size-6" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 text-sm z-50 overflow-hidden">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 hover:bg-[#f0f7f2] text-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiUser className="mr-2 text-[#94bb9f]" size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/wallet"
                      className="flex items-center px-4 py-3 hover:bg-[#f0f7f2] text-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiCreditCard className="mr-2 text-[#94bb9f]" size={16} />
                      My Wallet
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-3 hover:bg-[#f0f7f2] text-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiShoppingCart
                        className="mr-2 text-[#94bb9f]"
                        size={16}
                      />
                      Orders
                    </Link>
                    <div className="border-t border-gray-100">
                      <Logout className="w-full text-left px-4 py-3 hover:bg-[#f0f7f2] text-gray-700 transition-colors" />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="flex items-center px-4 py-3 hover:bg-[#f0f7f2] text-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiUserPlus className="mr-2 text-[#94bb9f]" size={16} />
                      Sign Up
                    </Link>
                    <Link
                      href="/signin"
                      className="flex items-center px-4 py-3 hover:bg-[#f0f7f2] text-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiLogIn className="mr-2 text-[#94bb9f]" size={16} />
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="lg:hidden px-4 pb-4">
          <form onSubmit={handleSearch}>
            <SearchInput query={searchQuery} setQuery={setSearchQuery} />
          </form>
        </div>
      )}

      {/* Navigation Links */}
      <div className="hidden lg:flex justify-center space-x-6 py-2 text-sm font-medium">
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
