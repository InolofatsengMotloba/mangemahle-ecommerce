"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params?.id;

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

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <p>{product.details}</p>
    </div>
  );
};

export default ProductDetails;
