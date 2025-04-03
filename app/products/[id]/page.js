"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useLocation from "@/hooks/useLocation";
import LocationDisplay from "@/components/LocationDisplay";
import GoogleMap from "@/components/GoogleMap";
import IndoorNavigation from "@/components/IndoorNavigation";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const params = useParams();
  const id = params?.id;

  // Get user's current location
  const { location: userLocation, error: locationError } = useLocation();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch product");
          }
          const data = await res.json();
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  // Convert Firestore GeoPoint to a usable object for our components
  const productLocation = product.location
    ? {
        latitude: product.location.latitude || product.location._latitude,
        longitude: product.location.longitude || product.location._longitude,
      }
    : null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-blue-600 mb-4">
              ${product.price}
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <p>{product.details}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Location Information</h3>
            {productLocation ? (
              <>
                <LocationDisplay
                  userLocation={userLocation}
                  productLocation={productLocation}
                  showDistance={true}
                />

                {userLocation && (
                  <button
                    onClick={() => setShowNavigation(!showNavigation)}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {showNavigation ? "Hide Navigation" : "Navigate to Product"}
                  </button>
                )}

                {showNavigation && userLocation && (
                  <div className="mt-4">
                    <IndoorNavigation
                      userLocation={userLocation}
                      productLocation={productLocation}
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-yellow-600">
                This product does not have location information.
              </p>
            )}
          </div>
        </div>

        {/* Google Maps Section */}
        {productLocation && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Product Location Map</h3>
            <div className="h-80 w-full">
              <GoogleMap
                userLocation={userLocation}
                productLocation={productLocation}
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                height="400px"
              />
            </div>

            {locationError && (
              <p className="mt-2 text-yellow-600">
                Location error: {locationError}. Enable location services to see
                your position on the map.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
