// seller/store/page.jsx (or wherever your main store page is)
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import ProductList from "../../components/seller/ProductList"; // Import the ProductList component

export default function SellerStorePage() {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const params = useSearchParams();
  const storeId = params.get("id") || "demo-store";

  useEffect(() => {
    // Simulate fetching seller profile & products by ID
    const fetchStore = async () => {
      // TODO: Replace with real API/localStorage fetch later
      setStore({
        id: storeId,
        name: "Namugongo Fresh Fruits",
        description: "Best local fruits straight from the farm 🍉🍍",
        whatsapp: "+256701234567",
        logo: "/public/logo.png",
      });

      setProducts([
        {
          id: 1,
          name: "Pineapples (3pcs)",
          price: 10000,
          image: "/pineapple.jpg",
        },
        {
          id: 2,
          name: "Mango Basket",
          price: 12000,
          image: "/mango.jpg",
        },
      ]);
    };

    fetchStore();
  }, [storeId]);

  if (!store) return <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">Loading store...</div>;

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 font-sans text-gray-800 antialiased">
      <div className="max-w-md mx-auto">
        {/* Store Header */}
        <div className="flex items-center gap-4 p-6 mb-6 bg-white shadow-lg rounded-3xl">
          <Image
            src={store.logo}
            alt="Store Logo"
            width={72}
            height={72}
            className="p-1 border-4 border-green-400 rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-gray-900">{store.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{store.description}</p>
          </div>
          <Link
            href={`https://wa.me/${store.whatsapp.replace("+", "")}`}
            target="_blank"
            className="flex items-center justify-center text-white transition-transform transform rounded-full shadow-xl w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 hover:scale-110 active:scale-95"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp size={28} />
          </Link>
        </div>

        {/* Products section using the ProductList component */}
        {products.length > 0 ? (
          <ProductList products={products} whatsapp={store.whatsapp} />
        ) : (
          <p className="text-center text-gray-500">No products available in this store.</p>
        )}
      </div>
    </div>
  );
}