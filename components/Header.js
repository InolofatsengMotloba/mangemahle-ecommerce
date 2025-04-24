"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import Logout from "./Logout";
import LiveLocationBanner from "./LiveLocationBanner";
import Image from "next/image";
import {
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineAppstore,
  AiOutlineInfoCircle,
  AiOutlineQuestionCircle,
  AiOutlineEnvironment,
} from "react-icons/ai";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
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

  const smallNavLinks = [
    {
      name: "My Profile",
      path: "/profile",
      icon: <FiUser className="mr-3 text-[#94bb9f]" size={18} />,
    },
    {
      name: "Shop Categories",
      path: "/categories",
      icon: <AiOutlineAppstore className="mr-3 text-[#94bb9f]" size={18} />,
    },
    {
      name: "Services",
      path: "/about-us",
      icon: <AiOutlineInfoCircle className="mr-3 text-[#94bb9f]" size={18} />,
    },
    {
      name: "Help & Support",
      path: "/support",
      icon: (
        <AiOutlineQuestionCircle className="mr-3 text-[#94bb9f]" size={18} />
      ),
    },
    {
      name: "Store Locator",
      path: "/support",
      icon: <AiOutlineEnvironment className="mr-3 text-[#94bb9f]" size={18} />,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("search", encodeURIComponent(searchQuery.trim()));
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
    setShowMobileSearch(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b border-gray-200 relative z-50">
      <LiveLocationBanner />

      {/* Top Navigation Row */}
      <nav className="flex justify-between items-center px-4 sm:px-6 py-4 bg-white">
        {/* Left: Logo */}
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

          {/* Cart Icon - hidden on mobile */}
          <Link
            href="/cart"
            className="hidden sm:flex relative items-center justify-center"
          >
            <CartIcon size={24} />
          </Link>

          {/* Profile Icon - hidden on mobile */}
          <div className="hidden sm:block relative">
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

          {/* Hamburger Menu Button - visible on mobile */}
          <button className="sm:hidden focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? (
              <AiOutlineClose size="20" />
            ) : (
              <AiOutlineMenu size="20" />
            )}
          </button>
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

      {/* Navigation Links - Desktop */}
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          {/* Menu Header */}
          <div className="flex justify-between items-center mb-8">
            <Image
              src="/mh-logo.png"
              alt="Logo"
              width={120}
              height={70}
              className="object-contain"
              priority
            />

            <button onClick={toggleMenu} className="focus:outline-none">
              <AiOutlineClose size="20" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-4">
              {smallNavLinks.map(({ name, path, icon }) => (
                <li key={name}>
                  <Link
                    href={path}
                    className={`flex items-center py-2 text-lg ${
                      pathname === path ? "text-[#94bb9f]" : "text-gray-700"
                    }`}
                    onClick={toggleMenu}
                  >
                    {icon}
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Actions */}
          <div className="mt-auto pt-8 border-t border-gray-200 mb-16">
            {user ? (
              <>
                {/* <Link
                  href="/profile"
                  className="flex items-center py-3 text-gray-700"
                  onClick={toggleMenu}
                >
                  <FiUser className="mr-3 text-[#94bb9f]" size={18} />
                  Profile
                </Link> */}
                {/* <Link
                  href="/cart"
                  className="flex items-center py-3 text-gray-700"
                  onClick={toggleMenu}
                >
                  <FiShoppingCart className="mr-3 text-[#94bb9f]" size={18} />
                  Cart
                </Link> */}
                <Logout className="w-full text-left py-3 text-gray-700" />
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-base font-bold text-[#385941] mb-3">
                    Unlock Your Mahlemange Experience
                  </h1>
                  <p className="text-gray-600 mb-4 text-xs">
                    Sign in for personalized recommendations, faster checkout,
                    and exclusive deals tailored just for you.
                  </p>

                  <div className="space-y-3">
                    <Link
                      href="/signin"
                      className="flex items-center justify-center px-4 py-3 bg-[#94bb9f] hover:bg-[#385941] text-white rounded-lg transition-colors"
                      onClick={toggleMenu}
                    >
                      <FiLogIn className="mr-3" size={18} />
                      Sign In to Your Account
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center px-4 py-3 border border-[#94bb9f] text-[#385941] hover:bg-[#f0f7f2] rounded-lg transition-colors"
                      onClick={toggleMenu}
                    >
                      <FiUserPlus className="mr-3" size={18} />
                      Join Mahlemange
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
