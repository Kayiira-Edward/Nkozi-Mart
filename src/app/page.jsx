
// 'use client';

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
// import { useCart } from "./providers/CartProvider";
// import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
// import { db } from "./firebase/config.js";

// const banners = [
//   {
//     id: 1,
//     title: "Flash Sale!",
//     description: "Get up to 50% off on selected items!",
//     bgColor: "from-orange-400 to-orange-500",
//     img: "/logo.png", // Corrected path
//     sellerName: "Boda Bitez",
//   },
//   {
//     id: 2,
//     title: "Order via WhatsApp!",
//     description: "Chat with us for quick orders & support.",
//     bgColor: "from-green-500 to-green-600",
//     img: "/logo.png", // Corrected path
//     sellerName: "Campus Mart",
//   },
//   {
//     id: 3,
//     title: "New Arrivals!",
//     description: "Discover the latest products in our store.",
//     bgColor: "from-blue-400 to-blue-600",
//     img: "/logo.png", // Corrected path

//     sellerName: "Fresh Finds",
//   },
// ];

// const categories = [
//   "All",
//   "Snacks & Beverages",
//   "Toiletries & Personal Care",
//   "Stationery & Office Supplies",
//   "Electronics & Gadgets",
//   "Groceries & Fresh Produce",
//   "Fashion & Apparel",
//   "Home & Kitchen",
//   "Books & Media",
//   "Health & Wellness",
//   "Other",
// ];

// export default function HomePage() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   const { cartItems, addToCart } = useCart();
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
//   const [products, setProducts] = useState([]);
//   const searchInputRef = useRef(null);


//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentBannerIndex((prevIndex) =>
//         prevIndex === banners.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [banners.length]);

//   const goToNextBanner = () => {
//     setCurrentBannerIndex((prevIndex) =>
//       prevIndex === banners.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const goToPreviousBanner = () => {
//     setCurrentBannerIndex((prevIndex) =>
//       prevIndex === 0 ? banners.length - 1 : prevIndex - 1
//     );
//   };

//   useEffect(() => {
//     if (!db) {
//       console.error("Firestore is not initialized.");
//       return;
//     }
//     // Listen for real-time changes to the 'products' collection, ordered by creation date
//     const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetchedProducts = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setProducts(fetchedProducts);
//     }, (error) => {
//       console.error("Error fetching products from Firestore: ", error);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSellerClick = (sellerName, sellerId) => {
//     console.log(`Navigating to seller profile: ${sellerName} (ID: ${sellerId})`);
//   };

//   const handleCategoriesClick = () => {
//     if (searchInputRef.current) {
//       searchInputRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//       searchInputRef.current.focus();
//     }
//   };

//   let filteredProducts = products;
//   if (selectedCategory !== "All") {
//     filteredProducts = filteredProducts.filter(
//       (product) => product.category === selectedCategory
//     );
//   }
//   if (searchTerm) {
//     const lowerCaseSearchTerm = searchTerm.toLowerCase();
//     filteredProducts = filteredProducts.filter(
//       (product) =>
//         product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
//         (product.sellerName && product.sellerName.toLowerCase().includes(lowerCaseSearchTerm)) ||
//         (product.color && product.color.toLowerCase().includes(lowerCaseSearchTerm))
//     );
//   }

//   return (
//     <main className="min-h-screen pb-24 bg-[#f0f2f5] font-sans">
//       <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-md">
//         <Link href="/" className="flex items-center flex-shrink-0 space-x-2">
//           <Image
//             src="/public/logo.png"
//             alt="Ugbuy Logo"
//             width={40}
//             height={40}
//             className="rounded-full"
//           />
//           <span className="text-xl font-bold text-[#181a1f]">Ugbuy</span>
//         </Link>

//         <div className="items-center hidden space-x-6 md:flex">
//           <Link
//             href="/about"
//             className="text-[#4b5563] transition-colors duration-200 hover:text-[#2edc86]"
//           >
//             About
//           </Link>
//           <Link
//             href="/auth?mode=register"
//             className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b]"
//           >
//             Become a Seller
//           </Link>
//           <Link
//             href="/auth?mode=login"
//             className="text-[#4b5563] transition-colors duration-200 hover:text-[#2edc86]"
//           >
//             Sign In
//           </Link>

//           <Link href="/cart" className="relative ml-4">
//             <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f1f5f9] shadow-sm">
//               <FontAwesomeIcon
//                 icon={faShoppingCart}
//                 className="text-xl text-[#2edc86]"
//               />
//             </div>
//             {cartItems.length > 0 && (
//               <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full -top-1 -right-1">
//                 {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
//               </span>
//             )}
//           </Link>
//         </div>

//         <div className="flex items-center space-x-4 md:hidden">
//           <Link href="/cart" className="relative">
//             <div className="flex items-center justify-center w-10 h-10 bg-gray-100 shadow-sm rounded-xl">
//               <FontAwesomeIcon
//                 icon={faShoppingCart}
//                 className="text-xl text-[#2edc86]"
//               />
//             </div>
//             {cartItems.length > 0 && (
//               <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full -top-1 -right-1">
//                 {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
//               </span>
//             )}
//           </Link>
//           <button
//             onClick={toggleMenu}
//             className="w-10 h-10 flex items-center justify-center text-[#181a1f] rounded-xl bg-gray-100 shadow-sm"
//           >
//             {menuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {menuOpen && (
//           <div className="absolute left-0 right-0 flex flex-col items-start p-4 space-y-4 bg-white border-t border-gray-100 shadow-lg top-16 md:hidden">
//             <Link
//               href="/about"
//               className="w-full px-3 py-2 text-lg text-gray-800 transition-colors duration-200 rounded-md hover:text-[#2edc86] hover:bg-gray-50"
//             >
//               About
//             </Link>
//             <Link
//               href="/auth?mode=register"
//               className="w-full px-3 py-2 text-lg font-semibold text-white transition-colors duration-200 bg-[#2edc86] rounded-md shadow-md hover:bg-[#25b36b] text-center"
//             >
//               Become a Seller
//             </Link>
//             <Link
//               href="/auth?mode=login"
//               className="w-full px-3 py-2 text-lg font-semibold text-gray-800 transition-colors duration-200 rounded-md hover:text-[#2edc86] hover:bg-gray-50"
//             >
//               Sign In
//             </Link>
//           </div>
//         )}
//       </nav>

//       <div className="px-4 pt-6">
//         <div className="relative mb-6">
//           <input
//             ref={searchInputRef}
//             type="text"
//             placeholder="Search products, sellers, or colors..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-5 py-3 pl-12 text-sm border-2 border-gray-100 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white"
//           />
//           <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//         </div>

//         <div className="relative w-full h-40 mb-8 overflow-hidden shadow-lg rounded-2xl md:h-48 lg:h-56">
//           <div
//             className="flex h-full transition-transform duration-500 ease-in-out"
//             style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
//           >
//             {banners.map((banner) => (
//               <div
//                 key={banner.id}
//                 className={`flex-shrink-0 w-full h-full bg-gradient-to-r ${banner.bgColor} p-6 flex flex-col justify-between md:flex-row md:items-center`}
//               >
//                 <div>
//                   <p className="mb-1 text-xl font-bold text-white">
//                     {banner.title}
//                   </p>
//                   <p className="text-sm text-white text-opacity-80">
//                     {banner.description}
//                   </p>
//                   <button className="px-5 py-2 mt-4 text-sm font-semibold text-white transition-colors rounded-full shadow-md bg-white/20 hover:bg-white/40">
//                     Order from {banner.sellerName}
//                   </button>
//                 </div>
//                 <div className="relative hidden w-1/2 h-full md:block">
//                   <Image
//                     src={banner.img} // Replaced with banner.img
//                     alt={banner.title} // Replaced with a more descriptive alt text
//                     fill
//                     style={{ objectFit: 'cover' }}
//                     className="rounded-xl"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={goToPreviousBanner}
//             className="absolute p-2 text-gray-700 transition-colors -translate-y-1/2 bg-white rounded-full shadow-md left-2 top-1/2 bg-opacity-70 hover:bg-opacity-90"
//             aria-label="Previous banner"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <button
//             onClick={goToNextBanner}
//             className="absolute p-2 text-gray-700 transition-colors -translate-y-1/2 bg-white rounded-full shadow-md right-2 top-1/2 bg-opacity-70 hover:bg-opacity-90"
//             aria-label="Next banner"
//           >
//             <ChevronRight size={24} />
//           </button>
//           <div className="absolute flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
//             {banners.map((_, index) => (
//               <span
//                 key={index}
//                 className={`block w-2 h-2 rounded-full ${
//                   currentBannerIndex === index
//                     ? "bg-white"
//                     : "bg-white bg-opacity-50"
//                 }`}
//               ></span>
//             ))}
//           </div>
//         </div>

//         <div className="mb-8">
//           <h2 className="mb-3 text-lg font-semibold text-[#181a1f]">
//             Categories
//           </h2>
//           <div className="flex pb-2 space-x-3 overflow-x-auto scrollbar-hide">
//             {categories.map((cat, i) => (
//               <button
//                 key={i}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`flex-shrink-0 px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-colors duration-200 ${
//                     selectedCategory === cat
//                       ? "bg-[#2edc86] text-white"
//                       : "bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-[#2edc86] hover:text-[#2edc86]"
//                   }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h2 className="mb-3 text-lg font-semibold text-[#181a1f]">
//             Recommended for You
//           </h2>
//           <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
//           {filteredProducts.length > 0 ? (
//               filteredProducts.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex flex-col p-3 transition-shadow duration-200 bg-white border-2 border-gray-100 shadow-md rounded-3xl hover:shadow-lg"
//                 >
//                   <div className="relative w-full h-32 mb-3 overflow-hidden rounded-2xl">
//                     <Image
//                       src={item.imageUrl || "https://placehold.co/400x400/E8F5E9/1E8449?text=No+Image"}
//                       alt={item.name}
//                       fill
//                       style={{ objectFit: 'cover' }}
//                       className="rounded-2xl"
//                     />
//                   </div>
//                   <p className="text-base font-semibold text-gray-900 truncate">
//                     {item.name}
//                   </p>
//                   <button
//                     onClick={() => handleSellerClick(item.shop, item.sellerId)}
//                     className="flex items-center mt-1 mb-2 space-x-1 group focus:outline-none"
//                   >
//                     <div className="flex-shrink-0 w-6 h-6 overflow-hidden rounded-full">
//                       <Image
//                         src={item.sellerAvatar || "/public/logo.png"}
//                         alt={`${item.sellerName} Avatar`}
//                         width={24}
//                         height={24}
//                         className="rounded-full"
//                       />
//                     </div>
//                     <p className="text-xs text-gray-500 truncate transition-colors group-hover:text-[#2edc86] text-sm">
//                       {item.sellerName}
//                     </p>
//                   </button>
//                   <div className="flex items-center justify-between mt-auto">
//                     <p className="font-bold text-[#2edc86] text-lg">
//                       UGX {item.price.toLocaleString()}
//                     </p>
//                     <button
//                       onClick={() => addToCart(item)}
//                       className="p-2 text-white transition-colors bg-[#2edc86] rounded-full hover:bg-[#4ade80]"
//                       title="Add to Cart"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="w-5 h-5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 col-span-full">
//                 No products found. Try a different search or category.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t-2 border-gray-100 shadow-lg sm:hidden">
//         <div className="flex justify-around py-3">
//           <Link
//             href="/"
//             className="flex flex-col items-center text-[#2edc86] font-medium"
//           >
//             <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#e6fcf0]">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2 2v10a1 1 0 001 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//                 />
//               </svg>
//             </div>
//             <span className="mt-1 text-xs">Home</span>
//           </Link>
//           <button
//             onClick={handleCategoriesClick}
//             className="flex flex-col items-center text-gray-500 transition-colors hover:text-[#2edc86]"
//           >
//              <div className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
//                 />
//               </svg>
//             </div>
//             <span className="mt-1 text-xs">Categories</span>
//           </button>
//           <Link
//             href="/cart"
//             className="relative flex flex-col items-center text-gray-500 transition-colors hover:text-[#2edc86]"
//           >
//              <div className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.701.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                 />
//               </svg>
//             </div>
//             {cartItems.length > 0 && (
//               <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-600 rounded-full -top-1 right-5">
//                 {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
//               </span>
//             )}
//             <span className="mt-1 text-xs">Cart</span>
//           </Link>
//         </div>
//       </nav>
//     </main>
//   );
// }

'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./providers/CartProvider";
import { collection, onSnapshot, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "./firebase/config.js";

const banners = [
  {
    id: 1,
    title: "Flash Sale!",
    description: "Get up to 50% off on selected items!",
    bgColor: "from-orange-400 to-orange-500",
    img: "/logo.png",
    sellerName: "Boda Bitez",
  },
  {
    id: 2,
    title: "Order via WhatsApp!",
    description: "Chat with us for quick orders & support.",
    bgColor: "from-green-500 to-green-600",
    img: "/logo.png",
    sellerName: "Campus Mart",
  },
  {
    id: 3,
    title: "New Arrivals!",
    description: "Discover the latest products in our store.",
    bgColor: "from-blue-400 to-blue-600",
    img: "/logo.png",
    sellerName: "Fresh Finds",
  },
];

const categories = [
  "All",
  "Snacks & Beverages",
  "Toiletries & Personal Care",
  "Stationery & Office Supplies",
  "Electronics & Gadgets",
  "Groceries & Fresh Produce",
  "Fashion & Apparel",
  "Home & Kitchen",
  "Books & Media",
  "Health & Wellness",
  "Other",
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const { cartItems, addToCart } = useCart();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState({});
  const searchInputRef = useRef(null);

  // Auto-scroll banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToNextBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  // Fetch products and sellers from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch all products
        const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const productsSnapshot = await getDocs(productsQuery);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // 2. Get unique seller IDs from the fetched products
        const sellerIds = [...new Set(productsList.map(p => p.sellerId))];

        // 3. Fetch all relevant sellers in a single query
        const sellersMap = {};
        if (sellerIds.length > 0) {
          const sellersQuery = query(collection(db, "sellers"), where("uid", "in", sellerIds));
          const sellersSnapshot = await getDocs(sellersQuery);
          sellersSnapshot.forEach(doc => {
            sellersMap[doc.data().uid] = doc.data();
          });
        }
        
        setProducts(productsList);
        setSellers(sellersMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSellerClick = (sellerName, sellerId) => {
    console.log(`Navigating to seller profile: ${sellerName} (ID: ${sellerId})`);
  };

  const handleCategoriesClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      searchInputRef.current.focus();
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm || 
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (product.sellerInfo && product.sellerInfo.shopName.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (product.color && product.color.toLowerCase().includes(lowerCaseSearchTerm));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen pb-24 bg-[#f0f2f5] font-sans">
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-md">
        <Link href="/" className="flex items-center flex-shrink-0 space-x-2">
          <Image
            src="/logo.png"
            alt="Ugbuy Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-[#181a1f]">Ugbuy</span>
        </Link>
        {/* ... (rest of your nav is unchanged) ... */}
        <div className="items-center hidden space-x-6 md:flex">
          <Link
            href="/about"
            className="text-[#4b5563] transition-colors duration-200 hover:text-[#2edc86]"
          >
            About
          </Link>
          <Link
            href="/auth?mode=register"
            className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b]"
          >
            Become a Seller
          </Link>
          <Link
            href="/auth?mode=login"
            className="text-[#4b5563] transition-colors duration-200 hover:text-[#2edc86]"
          >
            Sign In
          </Link>
          <Link href="/cart" className="relative ml-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f1f5f9] shadow-sm">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-xl text-[#2edc86]"
              />
            </div>
            {cartItems.length > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full -top-1 -right-1">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center space-x-4 md:hidden">
          <Link href="/cart" className="relative">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 shadow-sm rounded-xl">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-xl text-[#2edc86]"
              />
            </div>
            {cartItems.length > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full -top-1 -right-1">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center text-[#181a1f] rounded-xl bg-gray-100 shadow-sm"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute left-0 right-0 flex flex-col items-start p-4 space-y-4 bg-white border-t border-gray-100 shadow-lg top-16 md:hidden">
            <Link
              href="/about"
              className="w-full px-3 py-2 text-lg text-gray-800 transition-colors duration-200 rounded-md hover:text-[#2edc86] hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              href="/auth?mode=register"
              className="w-full px-3 py-2 text-lg font-semibold text-white transition-colors duration-200 bg-[#2edc86] rounded-md shadow-md hover:bg-[#25b36b] text-center"
            >
              Become a Seller
            </Link>
            <Link
              href="/auth?mode=login"
              className="w-full px-3 py-2 text-lg font-semibold text-gray-800 transition-colors duration-200 rounded-md hover:text-[#2edc86] hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>

      <div className="px-4 pt-6">
        <div className="relative mb-6">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products, sellers, or colors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pl-12 text-sm border-2 border-gray-100 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="relative w-full h-40 mb-8 overflow-hidden shadow-lg rounded-2xl md:h-48 lg:h-56">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`flex-shrink-0 w-full h-full bg-gradient-to-r ${banner.bgColor} p-6 flex flex-col justify-between md:flex-row md:items-center`}
              >
                <div>
                  <p className="mb-1 text-xl font-bold text-white">
                    {banner.title}
                  </p>
                  <p className="text-sm text-white text-opacity-80">
                    {banner.description}
                  </p>
                  <button className="px-5 py-2 mt-4 text-sm font-semibold text-white transition-colors rounded-full shadow-md bg-white/20 hover:bg-white/40">
                    Order from {banner.sellerName}
                  </button>
                </div>
                <div className="relative hidden w-1/2 h-full md:block">
                  <Image
                    src={banner.img}
                    alt={banner.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-xl"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={goToPreviousBanner}
            className="absolute p-2 text-gray-700 transition-colors -translate-y-1/2 bg-white rounded-full shadow-md left-2 top-1/2 bg-opacity-70 hover:bg-opacity-90"
            aria-label="Previous banner"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNextBanner}
            className="absolute p-2 text-gray-700 transition-colors -translate-y-1/2 bg-white rounded-full shadow-md right-2 top-1/2 bg-opacity-70 hover:bg-opacity-90"
            aria-label="Next banner"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
            {banners.map((_, index) => (
              <span
                key={index}
                className={`block w-2 h-2 rounded-full ${
                  currentBannerIndex === index
                    ? "bg-white"
                    : "bg-white bg-opacity-50"
                }`}
              ></span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-[#181a1f]">
            Categories
          </h2>
          <div className="flex pb-2 space-x-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-colors duration-200 ${
                    selectedCategory === cat
                      ? "bg-[#2edc86] text-white"
                      : "bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-[#2edc86] hover:text-[#2edc86]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-[#181a1f]">
            Recommended for You
          </h2>
          <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => {
                const seller = sellers[item.sellerId] || {};
                return (
                  <div
                    key={item.id}
                    className="flex flex-col p-3 transition-shadow duration-200 bg-white border-2 border-gray-100 shadow-md rounded-3xl hover:shadow-lg"
                  >
                    <div className="relative w-full h-32 mb-3 overflow-hidden rounded-2xl">
                      <Image
                        src={item.image || "https://placehold.co/400x400/E8F5E9/1E8449?text=No+Image"}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl"
                      />
                    </div>
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <button
                      onClick={() => handleSellerClick(seller.shopName, item.sellerId)}
                      className="flex items-center mt-1 mb-2 space-x-1 group focus:outline-none"
                    >
                      <div className="flex-shrink-0 w-6 h-6 overflow-hidden rounded-full">
                        <Image
                          src={seller.profileImage || "/logo.png"}
                          alt={`${seller.shopName} Avatar`}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                      <p className="text-xs text-gray-500 truncate transition-colors group-hover:text-[#2edc86] text-sm opacity-70">
                        {seller.shopName}
                      </p>
                    </button>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-bold text-[#2edc86] text-lg">
                        UGX {item.price.toLocaleString()}
                      </p>
                      <button
                        onClick={() => addToCart(item)}
                        className="p-2 text-white transition-colors bg-[#2edc86] rounded-full hover:bg-[#4ade80]"
                        title="Add to Cart"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No products found. Try a different search or category.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* ... (rest of your footer nav is unchanged) ... */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t-2 border-gray-100 shadow-lg sm:hidden">
        <div className="flex justify-around py-3">
          <Link
            href="/"
            className="flex flex-col items-center text-[#2edc86] font-medium"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#e6fcf0]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2 2v10a1 1 0 001 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="mt-1 text-xs">Home</span>
          </Link>
          <button
            onClick={handleCategoriesClick}
            className="flex flex-col items-center text-gray-500 transition-colors hover:text-[#2edc86]"
          >
             <div className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <span className="mt-1 text-xs">Categories</span>
          </button>
          <Link
            href="/cart"
            className="relative flex flex-col items-center text-gray-500 transition-colors hover:text-[#2edc86]"
          >
             <div className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.701.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            {cartItems.length > 0 && (
              <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-600 rounded-full -top-1 right-5">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
            <span className="mt-1 text-xs">Cart</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}