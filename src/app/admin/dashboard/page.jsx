// app/admin/dashboard/page.jsx

import React from "react";
import StatGrid from "../../components/admin/StatGrid";

export const metadata = {
  title: "Admin Dashboard",
  description: "Overview of key marketplace metrics",
};

export default function DashboardPage() {
  const stats = [
    {
      id: 1,
      label: "Total Users",
      value: 1452,
      icon: "users",
    },
    {
      id: 2,
      label: "Orders Placed",
      value: 328,
      icon: "shopping-cart",
    },
    {
      id: 3,
      label: "Products Listed",
      value: 154,
      icon: "box",
    },
    {
      id: 4,
      label: "Visits (This Month)",
      value: 4678,
      icon: "eye",
    },
  ];

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      <StatGrid stats={stats} />
    </main>
  );
}
