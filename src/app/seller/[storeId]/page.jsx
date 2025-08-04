'use client';

import { useEffect, useState } from "react";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
import ProfileDisplay from "@/app/components/seller/ProfileDisplay";
import ProductList from "@/app/components/seller/ProductList";

// Import the shared Firebase instances
import { db } from '@/app/firebase/config';

export default function PublicStorePage({ params }) {
  const { storeId } = params;
  const [sellerProfile, setSellerProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) {
      setError("No store ID provided.");
      setIsLoading(false);
      return;
    }
    
    // Set up a real-time listener for the seller's profile
    const profileRef = doc(db, "sellers", storeId);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setSellerProfile(docSnap.data());
      } else {
        setError("Seller profile not found.");
        setSellerProfile(null);
      }
      setIsLoading(false);
    }, (e) => {
      console.error("Error fetching seller profile:", e);
      setError("Failed to load seller profile.");
      setIsLoading(false);
    });

    // Set up a real-time listener for the seller's products
    const productsQuery = query(collection(db, "products"), where("sellerId", "==", storeId));
    const unsubscribeProducts = onSnapshot(productsQuery, (querySnapshot) => {
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsData);
    }, (e) => {
      console.error("Error fetching products:", e);
      // Don't set error here, as the profile might still be loading correctly
    });
    
    return () => {
      unsubscribeProfile();
      unsubscribeProducts();
    };
  }, [storeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-gray-50">
        <div className="text-xl font-medium text-gray-500">Loading store...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-gray-50">
        <div className="text-xl font-medium text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="w-full max-w-sm p-6 mx-auto mb-8 bg-white shadow-lg rounded-3xl">
          {sellerProfile ? (
            <ProfileDisplay profile={sellerProfile} />
          ) : (
            <p className="text-center text-gray-500">No profile found for this store.</p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Products</h2>
          {products.length > 0 && sellerProfile ? (
            <ProductList products={products} whatsapp={sellerProfile.whatsapp} />
          ) : (
            <p className="text-center text-gray-500">This store has no products to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
