'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FaPlusCircle } from 'react-icons/fa';

// Import the shared Firebase instances
import { auth, db } from '@/app/firebase/config';
import ProductForm from '@/app/components/seller/ProductForm';
import ProductList from '@/app/components/seller/ProductList';
import Header from '@/app/components/Header'; // Assuming you have a Header component

export default function SellerDashboardPage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Set up auth state listener
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

  useEffect(() => {
    if (!user) return;

    // Set up a real-time Firestore listener for products
    const q = query(collection(db, 'products'), where('sellerId', '==', user.uid));
    const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
      const productsArray = [];
      querySnapshot.forEach((doc) => {
        productsArray.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsArray);
    }, (error) => {
      console.error('Error fetching products: ', error);
    });

    return () => unsubscribeFirestore();
  }, [user]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleDelete = (productId) => {
    // The ProductCard component now handles its own deletion logic,
    // so this function can be empty or used for other actions if needed.
  };

  const handleFormSubmit = () => {
    // Hide the form after a successful submission
    setIsFormVisible(false);
    setEditingProduct(null); // Reset editing state
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">Loading...</div>;
  }

  return (
    <div className="bg-[#F0F2F5] min-h-screen font-sans">
      <Header />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Products</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormVisible(!isFormVisible);
            }}
            className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors bg-green-500 rounded-lg shadow-md hover:bg-green-600"
          >
            <FaPlusCircle />
            <span>{isFormVisible ? 'Close' : 'Add New Product'}</span>
          </button>
        </div>

        {isFormVisible && (
          <div className="mb-8">
            <ProductForm initialData={editingProduct} onSubmit={handleFormSubmit} />
          </div>
        )}

        {products.length > 0 ? (
          <ProductList
            products={products}
            whatsapp={user?.phoneNumber || ''} // Pass a placeholder or real number
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="p-8 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-xl">
            <p>You have not added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
