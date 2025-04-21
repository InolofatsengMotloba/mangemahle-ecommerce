"use client";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LocationProvider } from "@/contexts/LocationContext";
import LocationPermission from "@/components/LocationPermissions";
import { CartProvider } from "@/contexts/CartContext";
import { Poppins } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import { Suspense } from "react";

// Use Poppins as the primary font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        {/* wrap children with Suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <LocationProvider>
            <CartProvider>
              <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 sm:mb-20">{children}</main>
                {/* {!isHomePage && <Footer />} */}
              </div>
              <LocationPermission />
              <BottomNav />
            </CartProvider>
          </LocationProvider>
        </Suspense>
      </body>
    </html>
  );
}
