
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { Edit, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

export default function ProductCard({ product, whatsapp, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const productImageSrc = product.image || 'https://placehold.co/200x200?text=Product+Image';
  const whatsappUrl = whatsapp 
    ? `https://wa.me/${whatsapp.replace("+", "")}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`
    : '#';

  const confirmDelete = async () => {
    setIsDeleting(true);
    setShowModal(false); // Close the modal
    try {
      await deleteDoc(doc(db, 'products', product.id));
      // No need to show a success message, the UI will update from the real-time listener.
    } catch (error) {
      console.error('Error deleting product:', error);
      // In a real app, you might show a toast notification here
      // For now, we'll log it.
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (e) => {
    e.stopPropagation(); // Prevent card link from being triggered
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className="relative flex flex-col p-5 transition-all duration-300 transform bg-white shadow-md rounded-3xl group hover:shadow-lg hover:scale-[1.02]"
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
        <p className="mt-2 text-lg font-extrabold text-[#2edc86]">
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
            onClick={openDeleteModal}
            disabled={isDeleting}
            className="p-2 text-white transition-colors duration-200 bg-red-500 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete ${product.name}`}
          >
            {isDeleting ? <span className="animate-spin">🗑️</span> : <Trash2 size={16} />}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-11/12 max-w-sm p-6 bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-600">Are you sure you want to delete <span className="font-semibold">{product.name}</span>? This action cannot be undone.</p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// //       </div>
// //     </div>
// //   );
// // }


