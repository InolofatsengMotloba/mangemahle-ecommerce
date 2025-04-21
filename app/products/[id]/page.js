"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useLocation from "@/hooks/useLocation";
import LocationDisplay from "@/components/LocationDisplay";
import GoogleMap from "@/components/GoogleMap";
import IndoorNavigation from "@/components/IndoorNavigation";
import { ImageGallery } from "@/components/ImageGallery";
import {
  FiShoppingCart,
  FiMapPin,
  FiNavigation,
  FiStar,
  FiTag,
} from "react-icons/fi";

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

  if (loading)
    return (
      <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#94bb9f]"></div>
      </div>
    );


  if (error)
    return (
      <div className="max-w-5xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );


  if (!product)
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <p>Product not found.</p>
      </div>
    );

  // Convert Firestore GeoPoint to a usable object for our components
  const productLocation = product.location
    ? {
        latitude: product.location.latitude || product.location._latitude,
        longitude: product.location.longitude || product.location._longitude,
      }
    : null;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white">
      <div className="flex flex-col md:flex-row pt-5 mb-6 bg-white">
        {/* Product Image */}
        <ImageGallery
          className="mt-6 md:mt-0 md:ml-8 flex-1"
          images={product.images}
        />

        {/* Product Details */}
        <div className="p-4 mt-6 md:mt-0 md:ml-8 flex-1 bg-white">
          <h1 className="text-3xl font-bold mb-1">{product.title}</h1>
          <p className="text-sm text-gray-700 mb-4 border-b-black">
            {product.brand || "No brand specified"}
          </p>

          <p className="text-base text-gray-700 mb-2">{product.description}</p>
          <p className="text-lg text-gray-700 mb-2 border-b-black font-semibold">
            {product.category || "Uncategorized"}
          </p>

          <div className="flex flex-wrap justify-between items-center mb-3">
            <button
              className={`text-sm font-medium ${
                product.stock > 0
                  ? "text-white bg-[#2d7942] px-2 py-1 rounded-md"
                  : "text-white bg-red-600 px-2 py-1 rounded-md"
              }`}
            >
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </button>
            <p className="text-xl font-bold">$ {product.price || "N/A"}</p>
          </div>

          <p className="text-base text-black font-semibold mb-2">
            Rating: {product.rating || "Not rated"}
          </p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap items-center mb-4">
              <h3 className="mr-2 font-semibold">Tags:</h3>
              {product.tags.map((tag, index) => (
                <button
                  key={index}
                  className="border-2 font-bold border-black bg-white text-black m-1 px-2 py-1 rounded-md"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location Information */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
            <FiMapPin className="text-[#385941]" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-[#385941]">
            Location Information
          </h2>
        </div>

        {productLocation ? (
          <div className="space-y-4">
            <LocationDisplay
              userLocation={userLocation}
              productLocation={productLocation}
              showDistance={true}
            />

            {userLocation && (
              <button
                onClick={() => setShowNavigation(!showNavigation)}
                className={`flex items-center justify-center w-full md:w-auto px-6 py-2 rounded-lg ${
                  showNavigation
                    ? "bg-gray-100 text-gray-700"
                    : "bg-[#94bb9f] text-white hover:bg-[#385941]"
                } transition-colors`}
              >
                <FiNavigation className="mr-2" />
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

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">
                Product Location Map
              </h3>
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <GoogleMap
                  userLocation={userLocation}
                  productLocation={productLocation}
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-yellow-600">
            This product does not have location information.
          </p>
        )}

        {locationError && (
          <p className="mt-4 text-yellow-600">
            <FiMapPin className="inline mr-1" />
            Location error: {locationError}. Enable location services to see
            your position on the map.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
