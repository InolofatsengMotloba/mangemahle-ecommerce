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

function fuzzyMatch(productTitle, searchQuery) {
  return productTitle.toLowerCase().includes(searchQuery.toLowerCase());
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const lastVisibleId = searchParams.get("lastVisibleId");
    const limitPerPage = 20;

    const productsRef = collection(db, "products");

    // Case 1: Search exists — return all matches
    if (search) {
      const allSnapshot = await getDocs(productsRef);
      const allProducts = allSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredProducts = allProducts.filter((product) =>
        fuzzyMatch(product.title, search)
      );

      return new Response(JSON.stringify({ products: filteredProducts }), {
        status: 200,
      });
    }

    // Case 2: Paginated normal listing
    let q = query(productsRef, orderBy("id"), limit(limitPerPage));

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
