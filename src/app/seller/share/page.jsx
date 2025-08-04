// seller/share/page.jsx
"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';

export default function SharePage() {
  const [shareLink, setShareLink] = useState("");
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch the sellerId from
    // your authentication state or a backend API.
    const fetchedSellerId = "brin-mart-12345";
    setSellerId(fetchedSellerId);
    if (fetchedSellerId) {
      // Construct the shareable URL for the NEW public store page
      const currentOrigin = window.location.origin;
      const link = `${currentOrigin}/store/${fetchedSellerId}`; // Note the change from /seller/ to /store/
      setShareLink(link);
    }
  }, []);

  if (!sellerId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
        <p className="text-gray-500">Loading seller information...</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
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
