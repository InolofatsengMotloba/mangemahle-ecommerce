"use client";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LocationProvider } from "@/contexts/LocationContext";
import LocationPermission from "@/components/LocationPermissions";
import { CartProvider } from "@/contexts/CartContext";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation"; // <-- Import this

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname(); // <-- Get current route

  const isHomePage = pathname === "/"; // <-- Check if it's the homepage

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <LocationProvider>
            <CartProvider>
              {!isHomePage && <Header />} {/* Hide on homepage */}
              <main className="min-h-screen">{children}</main>
              {!isHomePage && <Footer />} {/* Hide on homepage */}
              <LocationPermission />
            </CartProvider>
          </LocationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
