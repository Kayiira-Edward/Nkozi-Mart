// app/components/seller/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";

export default function ProductCard({ product, whatsapp, onEdit, onDelete }) {
  const productImageSrc = product.image || "https://placehold.co/200x200?text=Product+Image";
  const whatsappUrl = whatsapp 
    ? `https://wa.me/${whatsapp.replace("+", "")}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`
    : '#';

  return (
    <div
      className="relative flex flex-col p-5 transition-all duration-300 transform bg-white shadow-lg rounded-3xl group hover:shadow-2xl hover:scale-[1.02]"
    >
      <div className="relative w-full h-40 mb-4 overflow-hidden shadow-md rounded-2xl">
        <Image
          src="/public/assets/images/shop.jpg"
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{product.name}</h3>
        <p className="mt-2 text-lg font-extrabold text-green-600">
          UGX {product.price.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-500 line-clamp-3">{product.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-white transition-colors duration-200 bg-blue-500 rounded-full hover:bg-blue-600"
              aria-label={`Edit ${product.name}`}
            >
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-white transition-colors duration-200 bg-red-500 rounded-full hover:bg-red-600"
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <Link
          href={whatsappUrl}
          target="_blank"
          className="flex items-center justify-center w-10 h-10 text-white transition-colors duration-200 bg-green-500 rounded-full shadow-lg hover:bg-green-600"
          aria-label={`Order ${product.name} on WhatsApp`}
        >
          <FaWhatsapp size={20} />
        </Link>
      </div>
    </div>
  );
}
