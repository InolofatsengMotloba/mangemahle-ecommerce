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
    const sort = searchParams.get("sort") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const lastVisibleId = searchParams.get("lastVisibleId");
    const limitPerPage = 20;

    const productsRef = collection(db, "products");

    if (search || category || sort) {
      const allSnapshot = await getDocs(productsRef);
      let allProducts = allSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (search) {
        allProducts = allProducts.filter((product) =>
          fuzzyMatch(product.title, search)
        );
      }

      if (category) {
        // Split categories by comma and trim whitespace
        const categories = category
          .split(",")
          .map((c) => c.trim().toLowerCase());
        allProducts = allProducts.filter((product) =>
          categories.includes(product.category?.toLowerCase())
        );
      }

      if (sort === "asc") {
        allProducts.sort((a, b) => a.price - b.price);
      } else if (sort === "desc") {
        allProducts.sort((a, b) => b.price - a.price);
      }

      // Handle pagination in-memory:
      const paginatedProducts = allProducts.slice(
        (page - 1) * limitPerPage,
        page * limitPerPage
      );

      const lastVisibleId = paginatedProducts[paginatedProducts.length - 1]?.id;

      return new Response(
        JSON.stringify({ products: paginatedProducts, lastVisibleId }),
        {
          status: 200,
        }
      );
    }

    // Pagination path
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
    let products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (sort === "asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products.sort((a, b) => b.price - a.price);
    }

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
