"use client";

import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Context
const CartContext = createContext(null);

// 2. Create the Provider Component
export function CartProvider({ children }) {
  // Initialize cartItems with data from localStorage on the client side
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart items from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsInitialized(true);
  }, []);

  // Save cart items to localStorage whenever the cart changes
  useEffect(() => {
    // Only save to localStorage after the initial state has been loaded
    if (isInitialized) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // 3. Define the Cart-related functions
  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      // If item exists, increase its quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Otherwise, add the new item with quantity 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
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