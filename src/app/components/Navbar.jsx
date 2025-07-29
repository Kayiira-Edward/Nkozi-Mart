// src/app/components/Navbar.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // optional: install lucide-react

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <Link href="/" className="flex items-center flex-shrink-0 space-x-2">
        <Image src="/logo.png" alt="Ugbuy Logo" width={40} height={40} />
        <span className="text-xl font-bold text-green-600">Ugbuy</span>
      </Link>

      {/* Desktop Menu & Cart (grouped together and pushed to the right) */}
      <div className="items-center hidden space-x-6 md:flex">
        <Link href="/" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Home</Link>
        <Link href="/about" className="text-gray-700 transition-colors duration-200 hover:text-green-600">About</Link>

        {/* Cart Icon - Moved inside desktop menu group */}
        <Link href="/cart" className="relative ml-4"> {/* Added ml-4 for some spacing from About */}
          <FontAwesomeIcon icon={faShoppingCart} className="text-xl text-gray-700 transition-colors duration-200 hover:text-green-600" />
          <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full -top-2 -right-2">
            3
          </span>
        </Link>
        
        <Link href="/sell" className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg shadow-md hover:bg-green-700">Become a Seller</Link>
        <Link href="/login" className="px-4 py-2 text-sm font-medium text-green-600 transition-colors duration-200 border-2 border-green-600 rounded-lg hover:bg-green-50">Sign In</Link>
      </div>

      {/* Mobile Hamburger & Cart (for mobile, cart needs to be outside the menu for visibility) */}
      <div className="flex items-center space-x-4 md:hidden"> {/* Added space-x-4 for spacing */}
        <Link href="/cart" className="relative">
          <FontAwesomeIcon icon={faShoppingCart} className="text-xl text-gray-700" />
          <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full -top-2 -right-2">
            3
          </span>
        </Link>
        <button onClick={toggleMenu} className="text-gray-700 hover:text-green-600">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="absolute left-0 right-0 flex flex-col items-start p-4 space-y-4 bg-white border-t border-gray-100 shadow-lg top-16 md:hidden">
          <Link href="/" className="w-full px-3 py-2 text-lg text-gray-800 transition-colors duration-200 rounded-md hover:text-green-600 hover:bg-gray-50">Home</Link>
          <Link href="/shop" className="w-full px-3 py-2 text-lg text-gray-800 transition-colors duration-200 rounded-md hover:text-green-600 hover:bg-gray-50">Shop</Link>
          <Link href="/categories" className="w-full px-3 py-2 text-lg text-gray-800 transition-colors duration-200 rounded-md hover:text-green-600 hover:bg-gray-50">Categories</Link>
          <Link href="/about" className="w-full px-3 py-2 text-lg text-gray-800 transition-colors duration-200 rounded-md hover:text-green-600 hover:bg-gray-50">About</Link>
          <Link href="/sell" className="w-full px-4 py-2 font-semibold text-center text-green-600 transition-colors duration-200 border border-green-600 rounded-lg hover:bg-green-50">Become a Seller</Link>
          <Link href="/login" className="w-full px-3 py-2 text-lg font-semibold text-green-600 transition-colors duration-200 rounded-md hover:text-green-700 hover:bg-gray-50">Sign In</Link>
        </div>
      )}
    </nav>

  );
}
