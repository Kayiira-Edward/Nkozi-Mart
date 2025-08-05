'use client';

import { useEffect, useState } from "react";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
import ProfileDisplay from "@/app/components/seller/ProfileDisplay";
import ProductList from "@/app/components/seller/ProductList";
import { Share2 } from "lucide-react"; // Import Share2 icon
import ToastNotification from "@/app/components/ToastNotification"; // Assuming this path is correct
import Image from "next/image"; // Import Image for seller avatar

// Import the shared Firebase instances
import { db } from '@/app/firebase/config';

export default function PublicStorePage({ params }) {
  const { storeId } = params;
  const [sellerProfile, setSellerProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false }); // Add toast state

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
      setToast({ message: 'Error loading seller profile.', type: 'error', isVisible: true });
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
      setToast({ message: 'Error loading products.', type: 'error', isVisible: true });
    });
    
    return () => {
      unsubscribeProfile();
      unsubscribeProducts();
    };
  }, [storeId]);

  const handleCopyStoreLink = async () => {
    const storeUrl = window.location.href; // Get the current URL
    try {
        const textarea = document.createElement('textarea');
        textarea.value = storeUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setToast({ message: 'Store link copied to clipboard!', type: 'success', isVisible: true });
    } catch (err) {
        console.error('Failed to copy text: ', err);
        setToast({ message: 'Failed to copy link. Please try manually.', type: 'error', isVisible: true });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-[#f0f2f5]"> {/* Updated background color */}
        <div className="text-xl font-medium text-gray-500">Loading store...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 font-sans bg-[#f0f2f5]"> {/* Updated background color */}
        <div className="text-xl font-medium text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-sans bg-[#f0f2f5]"> {/* Updated background color */}
      <div className="max-w-4xl mx-auto">
        {/* Seller Profile Header */}
        <div className="relative p-6 mb-8 bg-white shadow-lg rounded-3xl">
            <div className="flex items-center mb-4 space-x-4">
                {/* Placeholder for seller avatar */}
                <Image
                    src={sellerProfile?.profileImage || "/assets/images/seller-placeholder.png"} // Use actual profile image if available
                    alt={`${sellerProfile?.storeName} Avatar`}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-[#2edc86]"
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{sellerProfile?.storeName}</h1>
                    <p className="text-gray-600">{sellerProfile?.email}</p>
                </div>
            </div>
            <p className="mb-4 text-gray-700">{sellerProfile?.description || 'No description provided.'}</p>
            
            <div className="flex items-center space-x-4">
                {sellerProfile?.whatsapp && (
                    <a
                        href={`https://wa.me/${sellerProfile.whatsapp.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors bg-green-500 rounded-full shadow-md hover:bg-green-600"
                    >
                        {/* Assuming FaWhatsapp is available or use a simple SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-5 h-5">
                            <path d="M380.9 97.1C339.4 55.6 283.8 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 222-99.6 222-222 0-60.1-22.4-115.6-63.9-157.1zM223.9 448H224c34.9 0 69.5-10.1 99.9-29.1L370 434l-30.9-117.7c19.4-33.7 29.6-71.9 29.6-111 0-101.4-82.4-183.8-183.8-183.8S40.1 154.6 40.1 256c0 101.3 82.4 183.8 183.8 183.8zM342.9 203.4c-2.6-2.6-7-3.6-10.6-2.1-3.6 1.5-6.1 4.2-7.8 7.6-1.7 3.4-2.7 7.2-2.7 11.2s1.1 7.8 2.7 11.2c1.7 3.4 4.2 6.1 7.8 7.6 3.6 1.5 8 0.5 10.6-2.1l17.2-17.2c2.6-2.6 3.6-7 2.1-10.6-1.5-3.6-4.2-6.1-7.6-7.8-3.4-1.7-7.2-2.7-11.2-2.7s-7.8 1.1-11.2 2.7l-17.2 17.2zM224 296c-1.7 0-3.4-.6-4.8-1.7-1.4-1.1-2.4-2.7-2.8-4.4l-11.3-45.2c-.4-1.7-.1-3.5.8-4.9s2.4-2.5 4-2.9l45.2-11.3c1.7-.4 3.5-.1 4.9.8s2.5 2.4 2.9 4l11.3 45.2c.4 1.7.1 3.5-.8 4.9s-2.4 2.5-4 2.9l-45.2 11.3c-1.7.4-3.4.6-4.8.6z"/>
                        </svg>
                        <span>WhatsApp Us</span>
                    </a>
                )}
                <button
                    onClick={handleCopyStoreLink}
                    className="flex items-center px-4 py-2 space-x-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-full shadow-md hover:bg-gray-200"
                    aria-label="Share store"
                >
                    <Share2 size={20} />
                    <span>Share Store</span>
                </button>
            </div>
        </div>

        {/* Seller's Products */}
        <div className="p-6 bg-white shadow-lg rounded-3xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Products from {sellerProfile?.storeName}</h2>
          {products.length > 0 && sellerProfile ? (
            <ProductList products={products} whatsapp={sellerProfile.whatsapp} />
          ) : (
            <div className="p-8 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-xl">
                <p>This seller has not listed any products yet.</p>
            </div>
          )}
        </div>
      </div>
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
