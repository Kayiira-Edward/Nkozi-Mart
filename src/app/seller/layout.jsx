// app/seller/layout.jsx
import React from "react";
import Sidebar from "../components/seller/Sidebar";

export const metadata = {
  title: "Seller Dashboard",
  description: "Manage your store on Ugbuy",
};

export default function SellerLayout({ children }) {
  return (
    <div className="flex min-h-screen"> {/* Added flex to make main content sit next to sidebar */}
      {/* The Sidebar component handles its own fixed positioning and responsive logic */}
      <Sidebar />

      {/* Main content */}
      {/* On desktop, add left padding to prevent content from being hidden behind the fixed sidebar. */}
      {/* On mobile, the Sidebar becomes a bottom nav, so no padding is needed. */}
      <div className="flex-1 md:ml-64"> {/* Changed pl-64 to ml-64 for better semantic separation from sidebar */}
        <main className="p-4 overflow-y-auto md:p-6">{children}</main>
      </div>
    </div>
  );
}
