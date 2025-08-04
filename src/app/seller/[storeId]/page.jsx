// src/app/store/[storeId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import ProfileDisplay from "../../components/seller/ProfileDisplay";
import ProductList from "../../components/seller/ProductList";

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
    
    const fetchStoreData = async () => {
      try {
        // This is a simulation; in a real app, you would fetch from an API
        const savedProfile = JSON.parse(localStorage.getItem("sellerProfile"));
        const savedProducts = JSON.parse(localStorage.getItem("sellerProducts"));

        if (savedProfile) {
          setSellerProfile(savedProfile);
          if (savedProducts) {
            setProducts(savedProducts);
          }
        } else {
          setError("Profile not found.");
        }
      } catch (e) {
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-gray-50">
        <div className="text-xl font-medium text-gray-500">Loading store profile...</div>
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
