
import React from "react";
import OrdersTable from "../../components/admin/OrdersTable";

export const metadata = {
  title: "Admin Orders",
  description: "View and manage recent orders",
};

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD123",
      customer: "John Doe",
      date: "2025-08-01",
      total: "UGX 75,000",
      status: "Delivered",
    },
    {
      id: "ORD124",
      customer: "Alice Kim",
      date: "2025-08-01",
      total: "UGX 23,000",
      status: "Pending",
    },
    {
      id: "ORD125",
      customer: "Brian Opio",
      date: "2025-07-31",
      total: "UGX 49,500",
      status: "Cancelled",
    },
  ];

  return (
    <main className="p-4 sm:p-6">
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">Recent Orders</h1>
      <OrdersTable orders={orders} />
    </main>
  );
}
