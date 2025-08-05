'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { FaBox, FaDollarSign, FaShoppingCart } from 'react-icons/fa';

// Import the shared Firebase instances
import { auth, db } from '@/app/firebase/config';

export default function SellerDashboardHome() {
  const [user, setUser] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle Authentication and Data Fetching
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        // Redirect to the centralized login page
        router.push('/auth?mode=login');
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch and calculate dashboard metrics in real-time from Firestore
    setLoading(true);

    // Real-time listener for products
    const productsQuery = query(collection(db, 'products'), where('sellerId', '==', user.uid));
    const unsubscribeProducts = onSnapshot(productsQuery, (querySnapshot) => {
      setTotalProducts(querySnapshot.size);
    });

    // Real-time listener for orders
    const ordersQuery = query(collection(db, 'orders'), where('sellerId', '==', user.uid));
    const unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setTotalOrders(ordersData.length);
      
      // Calculate total revenue from the fetched orders
      const revenue = ordersData.reduce((sum, order) => {
        // Assuming each order item has a 'price' field
        const orderTotal = order.items ? order.items.reduce((itemSum, item) => itemSum + item.price, 0) : 0;
        return sum + orderTotal;
      }, 0);
      setTotalRevenue(revenue);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    });
    
    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, [user]);

  // Format the revenue as a currency string
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const cardData = [
    {
      title: 'Total Products',
      count: totalProducts,
      icon: <FaBox size={24} />,
      iconColor: 'bg-green-100 text-green-600', // Updated to match theme
    },
    {
      title: 'Total Revenue',
      count: formatCurrency(totalRevenue),
      icon: <FaDollarSign size={24} />,
      iconColor: 'bg-yellow-100 text-yellow-600', // Updated to match theme
    },
    {
      title: 'Total Orders',
      count: totalOrders,
      icon: <FaShoppingCart size={24} />,
      iconColor: 'bg-blue-100 text-blue-600', // Updated to match theme
    },
  ];

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600 bg-[#f0f2f5]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 font-sans bg-[#f0f2f5] md:p-10"> {/* Updated background color */}
      <div className="mx-auto space-y-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
            Welcome Back, Seller 👋
          </h1>

          {/* Search */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#2edc86] transition-all" 

            />
            <svg
              className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Description */}
        <p className="max-w-2xl leading-relaxed text-gray-600">
          This is your control center. Use the side menu to manage products, track orders, and update your profile.
        </p>

        {/* Cards */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {cardData.map(({ title, count, icon, iconColor }, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md transition-transform transform hover:scale-[1.03] hover:shadow-xl duration-300"
            >
              <div className="flex items-center gap-3">
                <span className={`p-3 rounded-2xl ${iconColor}`}>
                  {icon}
                </span>
                <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">{title}</h2>
              </div>
              <p className="mt-6 text-4xl font-extrabold text-gray-900">{count}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
