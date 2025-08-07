// components/seller/DashboardStats.jsx
import React from 'react';

/**
 * A component to display key statistics for the seller dashboard.
 * @param {object[]} products - An array of product objects.
 * @param {object[]} orders - An array of order objects.
 */
const DashboardStats = ({ products, orders }) => {
  // Calculate total products and orders from the passed props.
  const totalProducts = products ? products.length : 0;
  const totalOrders = orders ? orders.length : 0;
  const totalSales = orders ? orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) : 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Card for Total Products */}
      <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
          {/* Add an icon here, for example from Lucide React */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-500">
            <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <p className="mt-4 text-4xl font-bold text-gray-900">{totalProducts}</p>
      </div>

      {/* Card for Total Orders */}
      <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-700">Total Orders</h3>
          {/* Add an icon here, for example from Lucide React */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-500">
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        </div>
        <p className="mt-4 text-4xl font-bold text-gray-900">{totalOrders}</p>
      </div>

      {/* Card for Total Sales (Placeholder) */}
      <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-700">Total Sales</h3>
          {/* Add an icon here, for example from Lucide React */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-500">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        </div>
        <p className="mt-4 text-4xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
