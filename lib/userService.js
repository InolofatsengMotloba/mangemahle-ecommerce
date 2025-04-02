import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Function to save user data to Firestore
export const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      id: user.uid,
      name: user.displayName || "Anonymous",
      email: user.email,
      location: null, // Will update later
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Error saving user:", error);
  }
};
