// Updated firebase.js with better cart functionality
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to save cart items to Firestore for a specific user
export const saveCartToFirestore = async (uid, cartItems) => {
  try {
    const batch = writeBatch(db);

    // First, get existing cart items to determine what needs to be updated/deleted
    const existingCartItems = await getCartFromFirestore(uid);
    const existingItemsMap = existingCartItems.reduce((acc, item) => {
      acc[item.productId] = item;
      return acc;
    }, {});

    // Create a map of new cart items
    const newItemsMap = cartItems.reduce((acc, item) => {
      acc[item.productId] = item;
      return acc;
    }, {});

    // Handle updates and additions
    for (const item of cartItems) {
      // If item exists in Firestore and has a cartItemId, update it
      if (existingItemsMap[item.productId]?.cartItemId) {
        const cartItemRef = doc(
          db,
          "carts",
          uid,
          "items",
          existingItemsMap[item.productId].cartItemId
        );
        batch.update(cartItemRef, {
          quantity: item.quantity,
          price: item.price, // Update price in case it changed
          updatedAt: new Date(),
        });
      }
      // Otherwise add as a new item
      else {
        const cartItemsRef = collection(db, "carts", uid, "items");
        const newItemRef = doc(cartItemsRef);
        batch.set(newItemRef, {
          productId: item.productId,
          title: item.title,
          price: item.price,
          image: item.image || null,
          quantity: item.quantity,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Handle deletions - remove items that exist in Firestore but not in the new cart
    for (const existingItem of existingCartItems) {
      if (!newItemsMap[existingItem.productId]) {
        const cartItemRef = doc(
          db,
          "carts",
          uid,
          "items",
          existingItem.cartItemId
        );
        batch.delete(cartItemRef);
      }
    }

    // Commit all changes
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error saving cart to Firestore:", error);
    return false;
  }
};

// Function to get the cart from Firestore for a specific user
export const getCartFromFirestore = async (uid) => {
  try {
    const cartItemsRef = collection(db, "carts", uid, "items");
    const querySnapshot = await getDocs(cartItemsRef);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => ({
      cartItemId: doc.id,
      ...doc.data(),
      price: parseFloat(doc.data().price || 0), // Ensure price is a number
      quantity: parseInt(doc.data().quantity || 1), // Ensure quantity is a number
    }));
  } catch (error) {
    console.error("Error getting cart from Firestore:", error);
    return []; // Return an empty cart if error occurs
  }
};

// Add a single item to cart - with data validation
export const addItemToCart = async (uid, item) => {
  try {
    // Validate required fields
    if (!item.productId) {
      console.error("Missing productId");
      throw new Error("Product ID is required");
    }
    
    // Ensure we have all required fields with fallbacks
    const validatedItem = {
      productId: item.productId,
      title: item.title, // Changed from name to title
      price: parseFloat(item.price || 0),
      image: item.image || null,
      quantity: parseInt(item.quantity || 1),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const cartItemsRef = collection(db, "carts", uid, "items");
    
    // Check if product already exists in cart
    const q = query(cartItemsRef, where("productId", "==", validatedItem.productId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing item
      const existingDoc = querySnapshot.docs[0];
      const existingItem = existingDoc.data();
      const newQuantity = (parseInt(existingItem.quantity) || 0) + validatedItem.quantity;
      
      await updateDoc(doc(db, "carts", uid, "items", existingDoc.id), {
        quantity: newQuantity,
        updatedAt: new Date()
      });
      
      return {
        ...existingItem,
        cartItemId: existingDoc.id,
        quantity: newQuantity
      };
    } else {
      // Add new item
      const newItemRef = doc(cartItemsRef);
      await setDoc(newItemRef, validatedItem);
      
      return {
        ...validatedItem,
        cartItemId: newItemRef.id
      };
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

// Update quantity of a specific cart item
export const updateCartItemQuantity = async (uid, productId, quantity) => {
  try {
    const cartItemsRef = collection(db, "carts", uid, "items");
    const q = query(cartItemsRef, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const itemDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "carts", uid, "items", itemDoc.id), {
        quantity: quantity,
        updatedAt: new Date(),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

// Remove an item from cart
export const removeCartItem = async (uid, productId) => {
  try {
    const cartItemsRef = collection(db, "carts", uid, "items");
    const q = query(cartItemsRef, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const itemDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, "carts", uid, "items", itemDoc.id));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export { db, auth };
