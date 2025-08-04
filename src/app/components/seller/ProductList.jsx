'use client';

import ProductCard from './ProductCard'; // Assuming a ProductCard component exists in the same directory

// The Header component import has been removed as it was causing a build error.

export default function ProductList({ products, whatsapp, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-xl">
        <p>You have not added any products yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          whatsapp={whatsapp}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product.id)}
        />
      ))}
    </div>
  );
}
