'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, query, where, onSnapshot, deleteDoc } from "firebase/firestore";
import { Plus, Edit, Trash } from "lucide-react"; // Import Edit and Trash icons

// Import shared Firebase instances and components
import { auth, db } from '@/app/firebase/config';
import ProductForm from '@/app/components/seller/ProductForm';
import Modal from '@/app/components/Modal';
import ToastNotification from "@/app/components/ToastNotification";

export default function ManageProductsPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
  const router = useRouter();

  // Handle Authentication State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);
      } else {
        router.push('/auth?mode=login');
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  // Fetch products in real-time
  useEffect(() => {
    if (!user) return;

    const productsQuery = query(collection(db, 'products'), where('sellerId', '==', user.uid));
    const unsubscribeProducts = onSnapshot(productsQuery, (querySnapshot) => {
      const productsArray = [];
      querySnapshot.forEach((doc) => {
        productsArray.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsArray);
    }, (error) => {
      console.error('Error fetching products: ', error);
      setToast({ message: 'Error loading products.', type: 'error', isVisible: true });
    });

    return () => {
      unsubscribeProducts();
    };
  }, [user]);

  const handleFormSubmitted = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!user) {
      setToast({ message: 'You must be logged in to delete products.', type: 'error', isVisible: true });
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setToast({ message: 'Product deleted successfully!', type: 'success', isVisible: true });
      } catch (error) {
        console.error("Error deleting product:", error);
        setToast({ message: `Failed to delete product: ${error.message}`, type: 'error', isVisible: true });
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600 bg-[#f0f2f5]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 font-sans antialiased">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-6 py-3 text-white bg-[#2edc86] rounded-full shadow-lg hover:bg-[#25b36b] transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:ring-opacity-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Add New Product</span>
        </button>
      </header>

      {products.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <p className="text-lg font-medium text-gray-600">No products yet. Click the button to add your first product!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full table-auto">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <img 
                          className="object-cover w-10 h-10 rounded-full" 
                          src={product.imageUrl || `https://placehold.co/40x40/f0f2f5/a0a0a0?text=${product.name.charAt(0)}`}
                          alt={product.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    UGX {product.price ? product.price.toLocaleString() : '0'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-[#2edc86] hover:text-[#25b36b] transition-colors mr-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 transition-colors hover:text-red-800"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProductForm onSubmit={handleFormSubmitted} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ProductForm onSubmit={handleFormSubmitted} initialData={editingProduct} />
      </Modal>

      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
