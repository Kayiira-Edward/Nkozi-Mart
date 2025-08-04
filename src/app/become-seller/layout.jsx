// app/become-seller/layout.jsx
import React from "react";

export const metadata = {
  title: "Become a Seller",
  description: "Join our marketplace and start selling",
};

export default function SellerOnboardingLayout({ children }) {
  return (
    <div className="min-h-screen font-sans antialiased bg-gray-50">
      {children}
    </div>
  );
}
