'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Plus } from 'lucide-react';

// Import shared Firebase instances and components using relative paths
import { auth, db } from '../../firebase/config';
import ProductForm from '../../components/seller/ProductForm';
import ProductList from '../../components/seller/ProductList';
import Modal from '../../components/Modal';
import ToastNotification from '../../components/ToastNotification';

export default function ManageProductsPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
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
      } else {
        // If no user, redirect to login and stop loading
        router.push('/auth?mode=login');
      }
      setLoading(false);
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribeAuth();
  }, [router]);

  // Fetch seller profile and products only when the user object is available
  useEffect(() => {
    if (!user) {
      // If no user, we can't fetch data, so return and wait for auth state to change
      return;
    }

    // 1. Fetch seller profile in real-time
    const profileRef = doc(db, 'sellers', user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        console.log('No seller profile found!');
      }
    }, (error) => {
      console.error('Error fetching seller profile: ', error);
    });

    // 2. Fetch products in real-time
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

    // Cleanup function to unsubscribe from both listeners
    return () => {
      unsubscribeProfile();
      unsubscribeProducts();
    };
  }, [user]); // This useEffect runs only when the 'user' object changes

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

    // Use a custom modal instead of window.confirm
    // This is crucial because window.confirm does not work correctly in many modern contexts
    // For this example, we will add a simple modal UI later if you request it.
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

      <ProductList
        products={products}
        whatsapp={profile?.whatsapp}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProductForm onSubmit={handleFormSubmitted} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ProductForm onSubmit={handleFormSubmitted} initialData={editingProduct} />
      </Modal>

      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
