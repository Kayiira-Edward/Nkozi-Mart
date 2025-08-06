'use client'; // This is a Client Component

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import Link from 'next/link';

export default function SellerDashboard() {
  // State to hold Firebase authentication instance
  const [auth, setAuth] = useState(null);
  // State to hold the current user's ID
  const [userId, setUserId] = useState(null);
  // State to track if authentication is ready
  const [isAuthReady, setIsAuthReady] = useState(false);
  // State for any error messages
  const [error, setError] = useState('');

  // Initialize Firebase and set up authentication listener
  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Retrieve Firebase config from global variable
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const app = initializeApp(firebaseConfig);
        const firebaseAuth = getAuth(app);
        setAuth(firebaseAuth);

        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            // User is signed in
            setUserId(user.uid);
          } else {
            // No user is signed in, attempt anonymous sign-in or custom token sign-in
            try {
              if (typeof __initial_auth_token !== 'undefined') {
                await signInWithCustomToken(firebaseAuth, __initial_auth_token);
              } else {
                await signInAnonymously(firebaseAuth);
              }
            } catch (anonError) {
              console.error("Error signing in anonymously:", anonError);
              setError("Failed to authenticate. Please try again.");
            }
          }
          setIsAuthReady(true); // Authentication state is now ready
        });

        // Cleanup the authentication listener on component unmount
        return () => unsubscribe();
      } catch (err) {
        console.error("Failed to initialize Firebase:", err);
        setError("Failed to initialize the application. Please try again later.");
      }
    };

    initFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Display loading message while authentication is in progress
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-50 to-purple-100 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl p-8 text-center bg-white border border-gray-200 shadow-2xl sm:p-10 rounded-3xl">
        <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
          Seller Dashboard
        </h1>

        {/* Display User ID */}
        {userId && (
          <div className="px-4 py-3 mb-8 text-sm text-blue-800 break-all border border-blue-200 rounded-lg bg-blue-50">
            Your Seller ID: <span className="font-mono font-semibold">{userId}</span>
          </div>
        )}

        {/* Error Message Display */}
        {error && (
          <div className="relative px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Dashboard Navigation Links */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
          {/* Manage Products Card */}
          <Link href="/seller/manage-products" className="block">
            <div className="flex flex-col items-center justify-center h-48 p-6 text-white transition-all duration-300 ease-in-out transform bg-indigo-600 shadow-lg cursor-pointer hover:bg-indigo-700 rounded-xl hover:shadow-xl hover:-translate-y-1">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h2 className="mb-2 text-2xl font-bold">Manage Products</h2>
              <p className="text-sm text-indigo-100">View, edit, and delete your product listings.</p>
            </div>
          </Link>

          {/* Add New Product Card */}
          <Link href="/seller/add-product" className="block">
            <div className="flex flex-col items-center justify-center h-48 p-6 text-white transition-all duration-300 ease-in-out transform bg-green-600 shadow-lg cursor-pointer hover:bg-green-700 rounded-xl hover:shadow-xl hover:-translate-y-1">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="mb-2 text-2xl font-bold">Add New Product</h2>
              <p className="text-sm text-green-100">Create new product listings for your store.</p>
            </div>
          </Link>

          {/* You can add more dashboard links here, e.g., for orders, analytics, etc. */}
        </div>
      </div>
    </div>
  );
}
