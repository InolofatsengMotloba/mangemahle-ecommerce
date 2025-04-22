"use client";

import "./globals.css";
import Header from "@/components/Header";
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
        <Suspense
          fallback={
            <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#94bb9f]"></div>
            </div>
          }
        >
          <LocationProvider>
            <CartProvider>
              <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 mb-16">{children}</main>
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
