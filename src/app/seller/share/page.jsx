'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from 'qrcode.react';
import { onAuthStateChanged } from "firebase/auth";

// Import the shared Firebase instance
import { auth } from '@/app/firebase/config';

export default function SharePage() {
  const [shareLink, setShareLink] = useState("");
  const [sellerId, setSellerId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Set up an authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSellerId(user.uid);
        // Construct the shareable URL for the NEW public store page
        const currentOrigin = window.location.origin;
        const link = `${currentOrigin}/store/${user.uid}`;
        setShareLink(link);
      } else {
        // Redirect to login if no user is signed in
        router.push('/auth/login');
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (!sellerId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <p className="text-gray-500">Loading seller information...</p>
      </div>
    );
  }

  const handleCopy = () => {
    // Fallback for clipboard API might be needed, but this is the standard
    navigator.clipboard.writeText(shareLink)
      .then(() => console.log("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy link: ", err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-gray-50">
      <div className="w-full max-w-sm p-6 mx-auto bg-white shadow-lg rounded-3xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">Share Your Shop</h1>
        
        <p className="mb-6 text-center text-gray-600">
          Share this link or QR code with your customers to show them your products.
        </p>

        <div className="flex flex-col items-center space-y-6">
          {/* QR Code */}
          <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg">
            {shareLink && <QRCodeSVG value={shareLink} size={200} />}
          </div>

          {/* Shareable Link */}
          <div className="w-full">
            <label htmlFor="shareLink" className="block text-sm font-medium text-gray-700">Your Public Shop Link</label>
            <div className="flex mt-1">
              <input
                id="shareLink"
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 block w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-500 border border-green-500 rounded-r-md hover:bg-green-600"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
