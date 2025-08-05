'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { Edit, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';

// Import the shared Firebase instance
import { db } from '@/app/firebase/config';

export default function ProductCard({ product, whatsapp, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const productImageSrc = product.image || 'https://placehold.co/200x200?text=Product+Image';
  const whatsappUrl = whatsapp 
    ? `https://wa.me/${whatsapp.replace("+", "")}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`
    : '#';

  const handleDelete = async () => {
    // IMPORTANT: Avoid using window.confirm in production if you need custom UI/modals.
    // For this demonstration, it's used for simplicity.
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      setIsDeleting(true);
      try {
        await deleteDoc(doc(db, 'products', product.id));
        // No need to update state here, the parent component's Firestore listener will handle it.
      } catch (error) {
        console.error('Error deleting product:', error);
        // Use a toast notification here if you have one set up globally
        alert('Failed to delete product. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className="relative flex flex-col p-5 transition-all duration-300 transform bg-white shadow-md rounded-3xl group hover:shadow-lg hover:scale-[1.02]" // Adjusted shadow for consistency
    >
      <div className="relative w-full h-40 mb-4 overflow-hidden shadow-md rounded-2xl">
        <Image
          src={productImageSrc}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{product.name}</h3>
        <p className="mt-2 text-lg font-extrabold text-[#2edc86]"> {/* Updated price color */}
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
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-white transition-colors duration-200 bg-red-500 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete ${product.name}`}
          >
            {isDeleting ? <span className="animate-spin">🗑️</span> : <Trash2 size={16} />}
          </button>
        </div>
        <Link
          href={whatsappUrl}
          target="_blank"
          className="flex items-center justify-center w-10 h-10 text-white transition-colors duration-200 bg-[#2edc86] rounded-full shadow-md hover:bg-[#4ade80]" // Updated WhatsApp button colors and shadow
          aria-label={`Order ${product.name} on WhatsApp`}
        >
          <FaWhatsapp size={20} />
        </Link>
      </div>
    </div>
  );
}
