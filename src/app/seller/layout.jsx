import React from 'react';
import Sidebar from '../components/seller/Sidebar';

export const metadata = {
  title: 'Seller Dashboard',
  description: 'Manage your store, products, and profile.',
};

export default function SellerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {/* Sidebar is hidden on mobile and shown on desktop */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 px-4 pt-16 pb-16 md:ml-64 md:pt-0 md:pb-0 md:px-6">
        {children}
      </main>
    </div>
  );
}
