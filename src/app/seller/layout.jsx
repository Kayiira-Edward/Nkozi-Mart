// app/seller/layout.jsx
import React from "react";
import Sidebar from "../components/seller/Sidebar";

export const metadata = {
  title: "Seller Dashboard",
  description: "Manage your store on Ugbuy",
};

export default function SellerLayout({ children }) {
  return (
    <div className="min-h-screen">
      <aside className="md:w-64">
        {/* The Sidebar component handles its own fixed positioning and responsive logic */}
        <Sidebar />
      </aside>

      {/* Main content */}
      {/* On desktop, add left padding to prevent content from being hidden behind the fixed sidebar. */}
      {/* On mobile, the Sidebar becomes a bottom nav, so no padding is needed. */}
      <div className="flex-1 md:pl-64">
        <main className="p-4 overflow-y-auto md:p-6">{children}</main>
      </div>
    </div>
  );
}
