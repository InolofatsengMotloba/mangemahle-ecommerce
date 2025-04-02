"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const url = `/api/products?page=${pageNum}${
        lastVisible ? `&lastVisibleId=${lastVisible}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();
      // Only add new products if we're loading a new page
      setProducts((prev) =>
        pageNum === 1 ? data.products : [...prev, ...data.products]
      );
      setLastVisible(data.lastVisibleId);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const handleLoadMore = () => {
    if (lastVisible) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => {
          // Log to debug if there's an issue with product.id or product.name
          console.log("Product ID:", product.id);
          console.log("Product Name:", product.name);

          // Use product.id as the key, as it should be unique
          return (
            <div key={product.id} className="card">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <Link href={`/products/${product.id}`}>View Details</Link>
            </div>
          );
        })}
      </div>

      {loading && <p>Loading...</p>}

      {lastVisible && !loading && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
};

export default Products;
