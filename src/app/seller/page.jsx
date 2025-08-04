// src/app/seller/page.jsx
"use client";

import { useState, useEffect } from "react";
import { FaBox, FaDollarSign, FaShoppingCart } from "react-icons/fa";

export default function SellerDashboardHome() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    // Populate mock order data if it doesn't exist
    // In a real app, this data would come from a backend API
    const existingOrders = localStorage.getItem('sellerOrders');
    if (!existingOrders) {
      const mockOrders = [
        { id: 1, items: [{ productId: 1, price: 10000 }], status: "pending" },
        { id: 2, items: [{ productId: 2, price: 12000 }], status: "delivered" },
        { id: 3, items: [{ productId: 1, price: 10000 }, { productId: 2, price: 12000 }], status: "shipped" },
      ];
      localStorage.setItem('sellerOrders', JSON.stringify(mockOrders));
    }
    
    // Fetch and calculate dashboard metrics from localStorage
    const savedProducts = JSON.parse(localStorage.getItem("sellerProducts"));
    if (savedProducts) {
      setTotalProducts(savedProducts.length);
    }
    
    const savedOrders = JSON.parse(localStorage.getItem("sellerOrders"));
    if (savedOrders) {
      setTotalOrders(savedOrders.length);
      
      const revenue = savedOrders.reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.price, 0);
        return sum + orderTotal;
      }, 0);
      setTotalRevenue(revenue);
    }
  }, []);

  // Format the revenue as a currency string
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const cardData = [
    {
      title: "Total Products",
      count: totalProducts,
      icon: <FaBox size={24} />,
      iconColor: "bg-[#D9EEDA] text-[#25D366]",
    },
    {
      title: "Total Revenue",
      count: formatCurrency(totalRevenue),
      icon: <FaDollarSign size={24} />,
      iconColor: "bg-[#FFF8E1] text-[#FBCF03]",
    },
    {
      title: "Total Orders",
      count: totalOrders,
      icon: <FaShoppingCart size={24} />,
      iconColor: "bg-[#DDECFD] text-[#2597F3]",
    },
  ];

  return (
    <main className="min-h-screen p-6 text-[#1E1E1E] transition-colors duration-300 bg-[#E8F8E3] md:p-10">
      <div className="mx-auto space-y-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
            Welcome Back, Seller 👋
          </h1>

          {/* Search */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#77CF79] transition-all"
            />
            <svg
              className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Description */}
        <p className="max-w-2xl leading-relaxed text-gray-600">
          This is your control center. Use the side menu to manage products, track orders, and update your profile.
        </p>

        {/* Cards */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {cardData.map(({ title, count, icon, iconColor }, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md transition-transform transform hover:scale-[1.03] hover:shadow-xl duration-300"
            >
              <div className="flex items-center gap-3">
                <span className={`p-3 rounded-2xl ${iconColor}`}>
                  {icon}
                </span>
                <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">{title}</h2>
              </div>
              <p className="mt-6 text-4xl font-extrabold text-gray-900">{count}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
