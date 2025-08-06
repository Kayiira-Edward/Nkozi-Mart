'use client';

import { useState, useEffect, Suspense, use } from 'react'; // Import 'use' hook
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { db } from '@/app/firebase/config'; // Ensure this correctly initializes Firebase and Firestore

// Component to display when data is loading
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-12 h-12 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      <p className="ml-4 text-gray-700">Loading store...</p>
    </div>
  );
}

// Component to display when store is not found
function NotFoundMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-red-700 bg-red-100">
      <h2 className="mb-4 text-2xl font-bold">Store Not Found</h2>
      <p className="text-lg text-center">
        The seller store you are looking for does not exist or has been removed.
      </p>
      <Link href="/" className="px-6 py-3 mt-6 text-white transition-colors bg-red-600 rounded-lg shadow hover:bg-red-700">
        Go to Homepage
      </Link>
    </div>
  );
}

// Main Public Store Page component
export default function PublicStorePage({ params }) {
  // Use React.use() to unwrap the params Promise directly
  // This is the recommended way to handle the Next.js warning for future compatibility.
  const { storeId } = use(params); 

  const [sellerProfile, setSellerProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure db and storeId are available before fetching data
    if (!db || !storeId) {
      setIsLoading(false);
      return;
    }

    const fetchSellerData = async () => {
      try {
        const sellerDocRef = doc(db, 'sellers', storeId);
        const sellerDocSnap = await getDoc(sellerDocRef);

        if (sellerDocSnap.exists()) {
          setSellerProfile({ id: sellerDocSnap.id, ...sellerDocSnap.data() });

          // Fetch products for this seller
          const productsQuery = query(
            collection(db, 'products'),
            where('sellerId', '==', storeId)
          );

          // Listen for real-time updates to products
          const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
            const fetchedProducts = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setProducts(fetchedProducts);
            setIsLoading(false); // Set loading to false once initial data is fetched
          }, (err) => {
            console.error("Error fetching products:", err);
            setError("Failed to load products.");
            setIsLoading(false);
          });

          // Return the unsubscribe function for cleanup
          return () => unsubscribeProducts(); 
        } else {
          setError("Store not found.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching seller profile:", err);
        setError("Failed to load store data.");
        setIsLoading(false);
      }
    };

    fetchSellerData();
  }, [db, storeId]); // Dependency array includes db and storeId

  // Render loading, error, or not found states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error === "Store not found.") {
    return <NotFoundMessage />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 text-red-700 bg-red-100 rounded-md">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!sellerProfile) {
    return <NotFoundMessage />; // Fallback if profile somehow becomes null after loading
  }

  // Generate WhatsApp link
  const whatsappLink = sellerProfile.contactNumber
    ? `https://wa.me/${sellerProfile.contactNumber.replace("+", "")}`
    : '#';

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-md">
        <Link href="/" className="flex items-center flex-shrink-0 space-x-2">
          <Image
            src="/assets/images/one.jpg" // Ensure this path is correct
            alt="Ugbuy Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-[#181a1f]">Ugbuy</span>
        </Link>
        <h1 className="hidden text-2xl font-bold text-gray-800 md:block">
          {sellerProfile.storeName}
        </h1>
        <Link
          href={whatsappLink}
          target="_blank"
          className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b] flex items-center"
        >
          <FaWhatsapp className="mr-2" /> Chat with Seller
        </Link>
      </nav>

      <header className="relative flex items-center justify-center w-full h-48 text-white shadow-lg bg-gradient-to-r from-teal-400 to-green-600">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10%" cy="10%" r="15" fill="currentColor" className="text-emerald-300" />
            <circle cx="90%" cy="20%" r="20" fill="currentColor" className="text-orange-300" />
            <circle cx="20%" cy="80%" r="18" fill="currentColor" className="text-blue-300" />
            <circle cx="70%" cy="90%" r="25" fill="currentColor" className="text-purple-300" />
            <rect x="30%" y="40%" width="40" height="40" rx="10" fill="currentColor" className="text-yellow-300" />
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-extrabold">{sellerProfile.storeName}</h1>
          <p className="mt-2 text-lg">{sellerProfile.email}</p>
          <p className="mt-1 text-md">Contact: {sellerProfile.contactNumber}</p>
        </div>
      </header>

      <div className="p-4">
        <h2 className="mt-8 mb-6 text-2xl font-bold text-gray-800">
          Products from {sellerProfile.storeName}
        </h2>

        {products.length === 0 ? (
          <div className="p-10 text-center text-gray-500 bg-white shadow-md rounded-xl">
            <p className="text-lg">This seller currently has no products listed.</p>
            <p className="mt-2 text-sm">Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden transition-transform duration-200 bg-white shadow-md rounded-xl hover:scale-105"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={product.imageUrl || "https://placehold.co/400x400/E8F5E9/1E8449?text=No+Image"}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <p className="text-xl font-bold text-[#2edc86] mt-3">UGX {product.price.toLocaleString()}</p>
                  <Link
                    href={`https://wa.me/${sellerProfile.contactNumber.replace("+", "")}?text=Hello,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-[#2edc86] text-white rounded-lg shadow hover:bg-[#25b36b] transition-colors"
                  >
                    <FaWhatsapp className="mr-2" /> Buy on WhatsApp
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
