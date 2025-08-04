// app/components/seller/ProductList.jsx
"use client";

import ProductCard from "./ProductCard";

export default function ProductList({ products, whatsapp }) {
  return (
    <div className="space-y-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} whatsapp={whatsapp} />
      ))}
    </div>
  );
}