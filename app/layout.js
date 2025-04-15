"use client";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LocationProvider } from "@/contexts/LocationContext";
import LocationPermission from "@/components/LocationPermissions";
import { CartProvider } from "@/contexts/CartContext";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import LiveLocationBanner from "@/components/LiveLocationBanner";

// Use Poppins as the primary font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <LocationProvider>
          <CartProvider>
            {!isHomePage && <Header />}
            <LiveLocationBanner />
            <main className="min-h-screen">{children}</main>
            {/* {!isHomePage && <Footer />} */}
            <LocationPermission />
            <BottomNav />
          </CartProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
