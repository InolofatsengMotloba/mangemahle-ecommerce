import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  getDoc,
} from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const lastVisibleId = searchParams.get("lastVisibleId"); // Get lastVisibleId from query params
    const limitPerPage = 20;

    const productsRef = collection(db, "products");
    let q = query(productsRef, orderBy("id"), limit(limitPerPage));

    // For pages beyond the first, use startAfter with the last visible document
    if (page > 1 && lastVisibleId) {
      const lastVisibleDoc = await getDoc(doc(db, "products", lastVisibleId));
      q = query(
        productsRef,
        orderBy("id"),
        startAfter(lastVisibleDoc),
        limit(limitPerPage)
      );
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const newLastVisibleId = newLastVisible ? newLastVisible.id : null;

    return new Response(
      JSON.stringify({
        products,
        lastVisibleId: newLastVisibleId,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    });
  }
}
