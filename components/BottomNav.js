"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AiFillHome,
  AiOutlineShoppingCart,
  AiOutlineHeart,
} from "react-icons/ai";
import { FiShoppingBag } from "react-icons/fi";
import CartIcon from "./CartIcon";

const navItems = [
  { label: "Home", icon: <AiFillHome size={24} />, href: "/" },
  { label: "Products", icon: <FiShoppingBag size={24} />, href: "/products" },
  { label: "Cart", icon: <CartIcon size={24} />, href: "/cart" },
  { label: "Wishlist", icon: <AiOutlineHeart size={24} />, href: "/wishlist" },
  // { label: "Profile", icon: <AiOutlineUser size={24} />, href: "/profile" },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#f9fbf8] shadow-md border-t border-gray-200 flex justify-between items-center px-4 py-3 sm:hidden z-50 h-16">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center text-sm transition-colors duration-200"
          >
            <div
              className={`text-[22px] ${
                isActive ? "text-[#2e4d3b]" : "text-gray-500"
              }`}
            >
              {item.icon}
            </div>
            <span
              className={`text-[11px] mt-1 ${
                isActive ? "text-[#2e4d3b]" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
