import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  getCartFromFirestore,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  saveCartToFirestore, // needed for clearing cart
} from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadCart(user.uid);
      } else {
        setUser(null);
        setCart([]);
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
      const productId = item.id || item.productId;

      if (!productId) {
        console.error("No product ID found in item:", item);
        throw new Error("Product ID is required");
      }

      const cartItem = {
        productId,
        title: item.title,
        price: parseFloat(item.price || 0),
        image: item.image || null,
        quantity: parseInt(item.quantity || 1),
      };

      await addItemToCart(user.uid, cartItem);
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
      await removeCartItem(user.uid, productId);
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
      await updateCartItemQuantity(user.uid, productId, quantity);
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
      await saveCartToFirestore(user.uid, []);
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const selfCheckout = async () => {
    if (!user) {
      alert("Please sign in to proceed to checkout.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      // Mocking a checkout process
      const total = calculateTotal();
      console.log("Checking out with total: R", total.toFixed(2));

      // TODO: Replace this with actual payment/checkout logic

      // Clear cart after successful "checkout"
      await saveCartToFirestore(user.uid, []);
      setCart([]);
      alert(`Checkout successful! You paid R${total.toFixed(2)}.`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
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
        calculateTotal,
        selfCheckout,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
