'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';

// Corrected import paths based on your file structure
import { auth, db } from '../../firebase/config';
import LoadingSpinner from '../../components/LoadingSpinner';
import ToastNotification from '../../components/ToastNotification';
import Sidebar from '../../components/seller/Sidebar';

export default function StoreDashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  const router = useRouter();
  const params = useParams();
  const { storeId } = params;

  // Handles authentication state and checks for user ownership of the store
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Critical security check: Ensure the authenticated user owns this store
        if (authUser.uid === storeId) {
          setUser(authUser);
        } else {
          // If the user doesn't own this store, redirect them away.
          // You could redirect to their own dashboard or to a generic page.
          router.push('/seller');
        }
      } else {
        router.push('/auth?mode=login');
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [router, storeId]);

  // Handles data fetching for the specific store
  useEffect(() => {
    if (!user || !storeId) {
      return;
    }

    // 1. Fetch seller profile
    const profileRef = doc(db, 'sellers', user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const newProfile = docSnap.data();
        if (JSON.stringify(newProfile) !== JSON.stringify(sellerProfile)) {
          setSellerProfile(newProfile);
        }
      } else {
        setError('Seller profile not found.');
      }
    }, (err) => {
      console.error('Error fetching seller profile:', err);
      setError('Failed to load seller profile.');
      setToast({ message: 'Error loading profile.', type: 'error', isVisible: true });
    });

    // 2. Fetch products for the specific store
    const productsQuery = query(collection(db, 'products'), where('sellerId', '==', storeId));
    const unsubscribeProducts = onSnapshot(productsQuery, (querySnapshot) => {
      const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArray);
    }, (err) => {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
      setToast({ message: 'Error loading products.', type: 'error', isVisible: true });
    });

    // 3. Fetch orders for the specific store
    const ordersQuery = query(collection(db, 'orders'), where('sellerId', '==', storeId));
    const unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
      const ordersArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersArray);
    }, (err) => {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders.');
      setToast({ message: 'Error loading orders.', type: 'error', isVisible: true });
    });

    // Cleanup function
    return () => {
      unsubscribeProfile();
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, [user, storeId, sellerProfile]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-600 bg-[#f0f2f5]">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!user || !sellerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600 bg-[#f0f2f5]">
        <p>Please log in to view the dashboard.</p>
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
            <h1 className="mb-6 text-3xl font-bold">Store Dashboard for {sellerProfile.storeName || storeId}</h1>
            <p className="text-xl">You have {products.length} products listed.</p>
            <p className="text-xl">You have {orders.length} pending orders.</p>
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
