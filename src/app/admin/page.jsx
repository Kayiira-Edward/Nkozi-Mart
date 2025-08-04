
"use client";

import StatGrid from "../components/admin/StatGrid";
import OrdersTable from "../components/admin/OrdersTable";
import ProductsTable from "../components/admin/ProductsTable";
import UsersTable from "../components/admin/UsersTable";

export default function AdminHome() {
  const sampleStats = [
    { id: 1, label: "Total Users", value: 1452, icon: "users" },
    { id: 2, label: "Orders Placed", value: 328, icon: "shopping-cart" },
    { id: 3, label: "Products Listed", value: 154, icon: "box" },
  ];

  const sampleOrders = [
    { id: "ORD123", customer: "John Doe", date: "2025-08-01", total: "UGX 75,000", status: "Delivered" },
    { id: "ORD124", customer: "Alice Kim", date: "2025-08-01", total: "UGX 23,000", status: "Pending" },
  ];

  const sampleProducts = [
    { id: "PROD001", name: "Product A", price: "UGX 10,000", stock: 50, category: "Category 1" },
    { id: "PROD002", name: "Product B", price: "UGX 20,000", stock: 30, category: "Category 2" },
  ];

  const sampleUsers = [
    { id: "USR001", name: "Jane Smith", email: "jane@example.com", role: "Admin" },
    { id: "USR002", name: "Mark Lee", email: "mark@example.com", role: "User" },
  ];

  return (
    <div className="w-full px-4 py-8 mx-auto max-w-screen-2xl sm:px-6 lg:px-12 space-y-14">
      <header className="text-center">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-gray-500">
          Monitor key metrics and manage the platform efficiently.
        </p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📊 Quick Stats</h2>
        </div>
        <StatGrid stats={sampleStats} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🧾 Recent Orders</h2>
        </div>
        <OrdersTable orders={sampleOrders} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🛍️ Products Snapshot</h2>
        </div>
        <ProductsTable products={sampleProducts} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">👥 Users Overview</h2>
        </div>
        <UsersTable users={sampleUsers} />
      </section>
    </div>
  );
}

