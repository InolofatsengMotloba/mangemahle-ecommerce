import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  getCartFromFirestore,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
} from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadCart(user.uid);
      } else {
        setUser(null);
        setCart([]); // Empty cart when user logs out
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loadCart = async (uid) => {
    try {
      setLoading(true);
      const savedCart = await getCartFromFirestore(uid);
      setCart(savedCart);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);

      // Debug what we're receiving
      console.log("Adding to cart:", item);

      // Determine correct product ID field
      const productId = item.id || item.productId;

      if (!productId) {
        console.error("No product ID found in item:", item);
        throw new Error("Product ID is required");
      }

      // Prepare the item for storage with validation - using title instead of name
      const cartItem = {
        productId: productId,
        title: item.title , // Changed from name to title
        price: parseFloat(item.price || 0),
        image: item.image || null,
        quantity: parseInt(item.quantity || 1),
      };

      console.log("Sending to Firestore:", cartItem);

      // Add item to Firestore
      await addItemToCart(user.uid, cartItem);

      // Reload cart to get updated state from Firestore
      await loadCart(user.uid);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert(`Failed to add item to cart: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      setLoading(true);

      // Remove from Firestore
      await removeCartItem(user.uid, productId);

      // Update local state
      setCart((prevCart) =>
        prevCart.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;

    try {
      setLoading(true);

      // Update in Firestore
      await updateCartItemQuantity(user.uid, productId, quantity);

      // Update local state
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Clear in Firestore by saving an empty array
      await saveCartToFirestore(user.uid, []);

      // Update local state
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
