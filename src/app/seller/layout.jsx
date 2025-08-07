// app/seller/layout.jsx
import React from 'react';
import Sidebar from '../components/seller/Sidebar';

export const metadata = {
  title: 'Seller Dashboard',
  description: 'Manage your store, products, and profile.',
};

export default function SellerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1 p-6 md:ml-64">
        {children}
      </main>
    </div>
  );
}
