"use client";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LocationProvider } from "@/contexts/LocationContext";
import LocationPermission from "@/components/LocationPermissions";
import { CartProvider } from "@/contexts/CartContext";
import { SessionProvider } from "next-auth/react"; // 👈 import this

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <LocationProvider>
            <CartProvider>
              <Header />
              <main className="p-4">{children}</main>
              <Footer />
              <LocationPermission />
            </CartProvider>
          </LocationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
