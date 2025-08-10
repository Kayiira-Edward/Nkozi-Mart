'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, auth } from "@/app/firebase/config";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set up auth state listener to track the current user
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // Sync cart with Firestore (for authenticated users) or local storage (for unauthenticated users)
  useEffect(() => {
    if (!user) {
      // User is not authenticated, load from local storage
      const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(localCart);
      setIsInitialized(true);
      return;
    }

    // User is authenticated, sync with Firestore
    const cartDocRef = doc(db, "carts", user.uid);
    const unsubscribeFirestore = onSnapshot(cartDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCartItems(data.items || []);
      } else {
        setDoc(cartDocRef, { items: [] }, { merge: true });
        setCartItems([]);
      }
      setIsInitialized(true);
    }, (error) => {
      console.error("Error fetching cart:", error);
      setIsInitialized(true);
    });

    return () => unsubscribeFirestore();
  }, [user]);

  // Save cart to local storage whenever cartItems change, but ONLY for unauthenticated users
  useEffect(() => {
    if (!user && isInitialized) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user, isInitialized]);

  const updateCartInFirestore = async (items) => {
    if (!user) {
      console.error("User not authenticated. Cannot update cart in Firestore.");
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

    let updatedCartItems;
    if (existingItemIndex > -1) {
      updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
    } else {
      updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
    }
    setCartItems(updatedCartItems);
    if (user) {
      updateCartInFirestore(updatedCartItems);
    }
  };

  const removeItem = (itemId) => {
    const updatedCartItems = cartItems.filter((cartItem) => cartItem.id !== itemId);
    setCartItems(updatedCartItems);
    if (user) {
      updateCartInFirestore(updatedCartItems);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      updateCartInFirestore([]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      if (user) {
      updateCartInFirestore(updatedCartItems);
      }
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeItem,
    clearCart,
    updateQuantity,
  };

  if (!isInitialized) {
    return (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
            Loading cart...
        </div>
    );
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}