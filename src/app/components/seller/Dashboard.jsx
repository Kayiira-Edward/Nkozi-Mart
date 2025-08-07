// components/seller/dashboard.jsx

'use client';

import Link from "next/link";
import { Package, User, Store } from "lucide-react";
import PropTypes from "prop-types";

// This component is now a reusable part of the dashboard page.
export default function SellerDashboard({ user }) {
  // We need the user object to create a link to the public store.
  const storeLink = user ? `/seller/${user.uid}` : '#';

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 font-sans antialiased">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome, Seller!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your store, products, and profile from here.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {/* Manage Products Card */}
        <Link
          href="/seller/products"
          className="flex flex-col items-center p-8 text-center transition-transform duration-300 bg-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#2edc86] focus:ring-opacity-50"
        >
          <Package size={64} strokeWidth={1.5} className="text-[#2edc86]" />
          <h2 className="mt-6 text-xl font-bold text-gray-800">Manage Products</h2>
          <p className="mt-2 text-gray-500">Add, edit, or delete products in your catalog.</p>
        </Link>

        {/* Manage Profile Card */}
        <Link
          href="/seller/profile"
          className="flex flex-col items-center p-8 text-center transition-transform duration-300 bg-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#2edc86] focus:ring-opacity-50"
        >
          <User size={64} strokeWidth={1.5} className="text-[#2edc86]" />
          <h2 className="mt-6 text-xl font-bold text-gray-800">Manage Profile</h2>
          <p className="mt-2 text-gray-500">Update your store information and contact details.</p>
        </Link>

        {/* View Public Store Card */}
        <Link
          href={storeLink}
          className="flex flex-col items-center p-8 text-center transition-transform duration-300 bg-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#2edc86] focus:ring-opacity-50"
        >
          <Store size={64} strokeWidth={1.5} className="text-[#2edc86]" />
          <h2 className="mt-6 text-xl font-bold text-gray-800">View My Store</h2>
          <p className="mt-2 text-gray-500">See how your public store page looks to customers.</p>
        </Link>
      </div>
    </div>
  );
}

// Add PropTypes for type-checking and documentation
SellerDashboard.propTypes = {
  user: PropTypes.object,
};

