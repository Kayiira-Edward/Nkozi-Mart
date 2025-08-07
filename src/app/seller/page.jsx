'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';

// Corrected import paths
import { auth, db } from '../firebase/config';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastNotification from '../components/ToastNotification';
import Sidebar from '../components/seller/Sidebar';
import DashboardStats from '../components/seller/DashboardStats';
import ProductForm from '../components/seller/ProductForm'; // Assuming this is also a dashboard component

/**
 * The main component for the seller's dashboard.
 * It handles authentication, fetches real-time data from Firestore,
 * and manages the UI state based on the fetched data.
 */
export default function SellerDashboardHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
  const router = useRouter();

  // 1. Listen for authentication state changes to get the user object.
  // This listener runs once when the component mounts.
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        router.push('/auth?mode=login');
      }
      // The loading state is now managed by the data-fetching useEffect below
    });

    return () => unsubscribeAuth();
  }, [router]);

  // 2. Fetch and listen for real-time data only when the user object is available.
  // This is the key fix for the runtime error.
  useEffect(() => {
    // Exit if there is no authenticated user yet.
    if (!user) {
      setLoading(true); // Ensure loading state is true while waiting for user
      return;
    }

    setLoading(true); // Start loading data for the authenticated user

    // Firestore listener for the seller's profile
    const profileRef = doc(db, 'sellers', user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setSellerProfile(docSnap.data());
      } else {
        setSellerProfile(null);
        console.log("Seller profile not found. The user might be new.");
      }
      // No longer setting loading to false here, to wait for all data
    }, (error) => {
      console.error('Error fetching seller profile:', error);
      setToast({ message: 'Error loading profile.', type: 'error', isVisible: true });
    });

    // Firestore listener for the seller's products
    const productsQuery = query(collection(db, 'products'), where('sellerId', '==', user.uid));
    const unsubscribeProducts = onSnapshot(productsQuery, (querySnapshot) => {
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArray);
    }, (error) => {
      console.error('Error fetching products:', error);
      setToast({ message: 'Error loading products.', type: 'error', isVisible: true });
    });

    // Firestore listener for the seller's orders
    const ordersQuery = query(collection(db, 'orders'), where('sellerId', '==', user.uid));
    const unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
      const ordersArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersArray);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setToast({ message: 'Error loading orders.', type: 'error', isVisible: true });
    });

    // Final cleanup function for all listeners.
    return () => {
      unsubscribeProfile();
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, [user]); // This effect re-runs only when 'user' changes.

  // 3. Unified loading state check after all data has been fetched.
  useEffect(() => {
    // Check if both user and sellerProfile are loaded before setting loading to false.
    if (user && sellerProfile) {
      setLoading(false);
    }
  }, [user, sellerProfile]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated but no profile exists, show a different message.
  if (!sellerProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg text-gray-600 bg-[#f0f2f5] p-6 text-center">
        <p className="mb-4">Welcome to your dashboard! Please create your seller profile to get started.</p>
        <div className="w-full max-w-2xl">
          <ProductForm />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-shrink-0 hidden w-64 lg:block">
        <Sidebar sellerProfile={sellerProfile} />
      </div>
      <div className="flex flex-col flex-grow">
        <header className="flex items-center justify-between p-4 bg-white shadow lg:hidden">
          <h1 className="text-xl font-bold text-gray-800">Seller Dashboard</h1>
        </header>
        <main className="flex-grow p-6 overflow-auto">
          <div className="p-6">
            <h1 className="mb-6 text-3xl font-bold">Seller Dashboard</h1>
            <DashboardStats products={products} orders={orders} />
            <div className="mt-8">
              {/* You can add another component here, e.g., a list of products */}
            </div>
          </div>
        </main>
      </div>
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
