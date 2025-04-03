import { db } from "../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req, { params }) {
  let { id } = params;

  try {
    // First try the exact ID from URL
    let docRef = doc(db, "products", id);
    let docSnap = await getDoc(docRef);

    // If not found and ID is numeric, try padded version
    if (!docSnap.exists() && !isNaN(id)) {
      const paddedId = String(id).padStart(3, "0");
      docRef = doc(db, "products", paddedId);
      docSnap = await getDoc(docRef);
      id = paddedId; // Update ID for response
    }

    if (docSnap.exists()) {
      const productData = docSnap.data();

      // Convert GeoPoint to a simple object with latitude and longitude
      const serializedProduct = {
        id: id,
        ...productData,
      };

      // Handle GeoPoint specially
      if (productData.location) {
        serializedProduct.location = {
          latitude: productData.location.latitude,
          longitude: productData.location.longitude,
        };
      }

      return new Response(JSON.stringify(serializedProduct), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch product details",
        details: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
