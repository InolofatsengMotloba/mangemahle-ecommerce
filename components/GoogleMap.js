"use client";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";

const GoogleMap = ({
  userLocation,
  productLocation,
  apiKey,
  width = "100%",
  height = "400px",
  zoom = 18, // Higher zoom for indoor-level detail
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [productMarker, setProductMarker] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  // Initialize map when the script loads
  const initializeMap = () => {
    if (!mapRef.current) return;

    // Set default center (will be updated when locations are available)
    const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
    const center = productLocation || userLocation || defaultCenter;

    const mapOptions = {
      center: center,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.SATELLITE,
          google.maps.MapTypeId.HYBRID,
        ],
      },
      zoomControl: true,
      fullscreenControl: true,
    };

    const newMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
  };

  // Update map when locations change
  useEffect(() => {
    if (!map || !googleMapsLoaded) return;

    // Update user marker
    if (userLocation) {
      const userLatLng = new google.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      );

      if (userMarker) {
        userMarker.setPosition(userLatLng);
      } else {
        // Create user marker with custom icon
        const newUserMarker = new google.maps.Marker({
          position: userLatLng,
          map: map,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          zIndex: 2,
        });
        setUserMarker(newUserMarker);
      }
    }

    // Update product marker
    if (productLocation) {
      const productLatLng = new google.maps.LatLng(
        productLocation.latitude,
        productLocation.longitude
      );

      if (productMarker) {
        productMarker.setPosition(productLatLng);
      } else {
        // Create product marker
        const newProductMarker = new google.maps.Marker({
          position: productLatLng,
          map: map,
          title: "Product Location",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
          zIndex: 1,
        });
        setProductMarker(newProductMarker);
      }
    }

    // Set appropriate bounds to fit all markers
    if ((userLocation && productLocation) || userLocation || productLocation) {
      const bounds = new google.maps.LatLngBounds();

      if (userLocation) {
        bounds.extend(
          new google.maps.LatLng(userLocation.latitude, userLocation.longitude)
        );
      }

      if (productLocation) {
        bounds.extend(
          new google.maps.LatLng(
            productLocation.latitude,
            productLocation.longitude
          )
        );
      }

      // Only fit bounds if we have at least one marker
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);

        // Adjust zoom level to show indoor details
        const listener = google.maps.event.addListenerOnce(
          map,
          "bounds_changed",
          function () {
            if (map.getZoom() > zoom) {
              map.setZoom(zoom);
            }
          }
        );
      }
    }
  }, [map, userLocation, productLocation, googleMapsLoaded]);

  // Load Google Maps script
  const handleGoogleMapsLoaded = () => {
    setGoogleMapsLoaded(true);
  };

  // Initialize map once script is loaded
  useEffect(() => {
    if (googleMapsLoaded) {
      initializeMap();
    }
  }, [googleMapsLoaded]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`}
        onLoad={handleGoogleMapsLoaded}
      />
      <div
        ref={mapRef}
        style={{ width: width, height: height }}
        className="rounded-lg shadow-md border border-gray-200"
      />
      {!googleMapsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-60 rounded-lg">
          <div className="animate-pulse">Loading map...</div>
        </div>
      )}
    </>
  );
};

export default GoogleMap;
