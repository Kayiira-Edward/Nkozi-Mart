'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Import the shared Firebase instances
import { db, auth } from "@/app/firebase/config";

// 1. Create the Context
const CartContext = createContext(null);

// 2. Create the Provider Component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart items from Firestore based on the authenticated user
  useEffect(() => {
    // Set up an auth state listener to get the current user
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setIsInitialized(true);
      return;
    }

    // Reference to the user's cart document in Firestore
    const cartDocRef = doc(db, "carts", user.uid);

    // Set up a real-time listener for the cart document
    const unsubscribeFirestore = onSnapshot(cartDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCartItems(data.items || []);
      } else {
        // If the cart document doesn't exist, set it with an empty array
        setDoc(cartDocRef, { items: [] }, { merge: true });
        setCartItems([]);
      }
      setIsInitialized(true);
    }, (error) => {
      console.error("Error fetching cart:", error);
      setIsInitialized(true);
    });

    // Cleanup the Firestore listener when the component unmounts
    return () => unsubscribeFirestore();
  }, [user]);

  // 3. Define the Cart-related functions that update Firestore
  const updateCartInFirestore = async (items) => {
    if (!user) {
      console.error("User not authenticated. Cannot update cart.");
      return;
    }
    const cartDocRef = doc(db, "carts", user.uid);
    try {
      await setDoc(cartDocRef, { items }, { merge: true });
    } catch (error) {
      console.error("Failed to update cart in Firestore:", error);
    }
  };

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      // If item exists, increase its quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      updateCartInFirestore(updatedCartItems);
    } else {
      // Otherwise, add the new item with quantity 1
      updateCartInFirestore([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeItem = (itemId) => {
    const updatedCartItems = cartItems.filter((cartItem) => cartItem.id !== itemId);
    updateCartInFirestore(updatedCartItems);
  };

  const clearCart = () => {
    updateCartInFirestore([]);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      updateCartInFirestore(updatedCartItems);
    }
  };

  // 4. Provide the value to the consuming components
  const value = {
    cartItems,
    addToCart,
    removeItem,
    clearCart,
    updateQuantity,
  };

  if (!isInitialized) {
    // Optional: Return a loading state while the cart is being fetched
    return <div>Loading cart...</div>;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 5. Create a custom hook for easy consumption of the context
export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
