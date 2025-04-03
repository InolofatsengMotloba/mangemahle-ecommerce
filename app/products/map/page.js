"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useLocation from "@/hooks/useLocation";
import Link from "next/link";
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const ProductsMap = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const mapRef = useRef(null);

  // Get user's location
  const { location: userLocation } = useLocation();

  // Fetch products with location data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);

        const productsData = [];
        productsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.location) {
            productsData.push({
              id: doc.id,
              ...data,
              location: {
                lat: data.location.latitude,
                lng: data.location.longitude,
              },
            });
          }
        });

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate center point for the map
  const getMapCenter = () => {
    if (userLocation) {
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    if (products.length > 0) {
      return products[0].location;
    }
    return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  };

  const onLoad = (map) => {
    mapRef.current = map;
    // Fit bounds to include all markers
    if (products.length > 0 || userLocation) {
      const bounds = new window.google.maps.LatLngBounds();

      if (userLocation) {
        bounds.extend(
          new window.google.maps.LatLng(
            userLocation.latitude,
            userLocation.longitude
          )
        );
      }

      products.forEach((product) => {
        bounds.extend(
          new window.google.maps.LatLng(
            product.location.lat,
            product.location.lng
          )
        );
      });

      map.fitBounds(bounds);

      // Don't zoom in too far
      const listener = window.google.maps.event.addListenerOnce(
        map,
        "bounds_changed",
        function () {
          if (map.getZoom() > 18) {
            map.setZoom(18);
          }
        }
      );
    }
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Product Map</h1>

      <div className="mb-4">
        <p>{products.length} products with location information</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Back to Products List
        </Link>
      </div>

      {/* Google Maps */}
      <div className="w-full h-[600px] rounded-lg shadow-md border border-gray-200">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={["places", "geometry"]}
        >
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            center={getMapCenter()}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={{
                  lat: userLocation.latitude,
                  lng: userLocation.longitude,
                }}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 7,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                }}
                zIndex={999}
                title="Your Location"
              />
            )}

            {/* Product Markers */}
            {products.map((product) => (
              <Marker
                key={product.id}
                position={product.location}
                title={product.name}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
                onClick={() => setSelectedProduct(product)}
              />
            ))}

            {/* Info Window */}
            {selectedProduct && (
              <InfoWindow
                position={selectedProduct.location}
                onCloseClick={() => setSelectedProduct(null)}
              >
                <div style={{ padding: 8 }}>
                  <h3 style={{ fontWeight: "bold", marginBottom: 5 }}>
                    {selectedProduct.name}
                  </h3>
                  <p style={{ marginBottom: 5 }}>${selectedProduct.price}</p>
                  <Link
                    href={`/products/${selectedProduct.id}`}
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    View Details
                  </Link>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default ProductsMap;
