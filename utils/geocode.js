// utils/geocode.js
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const city =
      data.address.city || data.address.town || data.address.village || "";
    const postalCode = data.address.postcode || "";

    return {
      city,
      postalCode,
      fullAddress: data.display_name || "",
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return {
      city: "",
      postalCode: "",
      fullAddress: "",
      error: error.message,
    };
  }
};
