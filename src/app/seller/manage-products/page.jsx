'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, query, where, onSnapshot, deleteDoc } from "firebase/firestore"; // Import deleteDoc
import { Plus } from "lucide-react";

// Import shared Firebase instances and components
import { auth, db } from '@/app/firebase/config';
import ProductCard from '@/app/components/seller/ProductCard';
import ProductForm from '@/app/components/seller/ProductForm';
import Modal from '@/app/components/Modal';
import ToastNotification from "@/app/components/ToastNotification"; // Import ToastNotification

export default function ManageProductsPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false }); // Add toast state
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

  // Fetch products and profile in real-time
  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for seller's profile
    const profileRef = doc(db, "sellers", user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setSellerProfile(docSnap.data());
      }
    }, (error) => {
      console.error("Error fetching seller profile:", error);
      setToast({ message: 'Error loading seller profile.', type: 'error', isVisible: true });
    });

    // Set up real-time listener for products
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
      unsubscribeProfile();
      unsubscribeProducts();
    };
  }, [user]);

  const handleFormSubmitted = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditingProduct(null);
    // Toast messages are now handled within ProductForm itself
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

    // Instead of a simple confirm, use a custom modal or a toast with action if needed.
    // For now, we'll use a simple confirmation.
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
    <div className="min-h-screen bg-[#f0f2f5] p-6 font-sans antialiased"> {/* Updated background color */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1> {/* Updated text color */}
        <button
          onClick={() => {
            setEditingProduct(null); // Ensure no old data is in the form
            setIsModalOpen(true);
          }}
          className="flex items-center px-6 py-3 text-white bg-[#2edc86] rounded-full shadow-lg hover:bg-[#25b36b] transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:ring-opacity-50" // Updated button colors and focus ring
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Add New Product</span>
        </button>
      </header>

      {products.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <p className="text-lg font-medium text-gray-600">No products yet. Click the button to add your first product!</p> {/* Updated text color */}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              whatsapp={sellerProfile?.contactNumber} // Use contactNumber from sellerProfile
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
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
