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
    const reqLimit = parseInt(searchParams.get("limit")) || 20;
    const limitPerPage = reqLimit > 50 ? 50 : reqLimit; // Set max limit to 50 for safety

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
        const categories = category
          .split(",")
          .map((c) => c.trim().toLowerCase());
        allProducts = allProducts.filter((product) =>
          categories.includes(product.category?.toLowerCase())
        );
      }

      // Enhanced sorting logic
      if (sort === "asc") {
        allProducts.sort((a, b) => a.price - b.price);
      } else if (sort === "desc") {
        allProducts.sort((a, b) => b.price - a.price);
      } else if (sort === "rating_desc") {
        allProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === "rating_asc") {
        allProducts.sort((a, b) => (a.rating || 0) - (b.rating || 0));
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

    // Pagination path - modified to handle rating sorting
    let q;
    if (sort === "rating_desc") {
      q = query(productsRef, orderBy("rating", "desc"), limit(limitPerPage));
      if (page > 1 && lastVisibleId) {
        const lastVisibleDoc = await getDoc(doc(db, "products", lastVisibleId));
        q = query(
          productsRef,
          orderBy("rating", "desc"),
          startAfter(lastVisibleDoc),
          limit(limitPerPage)
        );
      }
    } else {
      // Default sorting by ID
      q = query(productsRef, orderBy("id"), limit(limitPerPage));
      if (page > 1 && lastVisibleId) {
        const lastVisibleDoc = await getDoc(doc(db, "products", lastVisibleId));
        q = query(
          productsRef,
          orderBy("id"),
          startAfter(lastVisibleDoc),
          limit(limitPerPage)
        );
      }
    }

    const querySnapshot = await getDocs(q);
    let products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side sorting as fallback if Firestore sorting isn't enough
    if (sort === "asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating_desc") {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "rating_asc") {
      products.sort((a, b) => (a.rating || 0) - (b.rating || 0));
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
