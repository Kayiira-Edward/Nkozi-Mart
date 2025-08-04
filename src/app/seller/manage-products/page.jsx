'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { Plus } from 'lucide-react';

// Import shared Firebase instances and components
import { auth, db } from '@/app/firebase/config';
import ProductCard from '@/app/components/seller/ProductCard';
import ProductForm from '@/app/components/seller/ProductForm';
import Modal from '@/app/components/Modal';

export default function ManageProductsPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();

  // Handle Authentication State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);
      } else {
        router.push('/auth/login');
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
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    // The ProductCard component now handles its own deletion logic, so no action is needed here.
    // The onSnapshot listener will automatically update the product list after deletion.
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] p-6 font-sans antialiased">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#2C3E50]">Manage Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null); // Ensure no old data is in the form
            setIsModalOpen(true);
          }}
          className="flex items-center px-6 py-3 text-white bg-[#5CB85C] rounded-full shadow-lg hover:bg-[#4CAF50] transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:ring-opacity-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Add New Product</span>
        </button>
      </header>

      {products.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <p className="text-lg text-[#7F8C8D] font-medium">No products yet. Click the button to add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              whatsapp={sellerProfile?.whatsapp}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct} // The `ProductCard` now handles the actual deletion
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
    </div>
  );
}
