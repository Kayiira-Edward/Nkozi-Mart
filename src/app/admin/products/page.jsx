// app/admin/products/page.jsx

import React from "react";
import ProductsTable from "../../components/admin/ProductsTable";

export const metadata = {
  title: "Admin Products",
  description: "Manage listed products",
};

export default function ProductsPage() {
  const products = [
    {
      id: "P001",
      name: "Wireless Mouse",
      price: "UGX 45,000",
      stock: 34,
      category: "Electronics",
    },
    {
      id: "P002",
      name: "Bluetooth Headphones",
      price: "UGX 120,000",
      stock: 12,
      category: "Electronics",
    },
    {
      id: "P003",
      name: "Water Bottle",
      price: "UGX 15,000",
      stock: 150,
      category: "Accessories",
    },
  ];

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      <ProductsTable products={products} />
    </main>
  );
}
