'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

// Import the shared Firebase instance
import { auth } from '@/app/firebase/config';

import {
  LucideLayoutDashboard,
  LucidePackagePlus,
  LucideListOrdered,
  LucideUser,
  LucideSettings,
  LucideLogOut,
  LucideQrCode,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    // Set up an authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, get their UID
        setSellerId(user.uid);
      } else {
        // User is signed out
        setSellerId(null);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Dynamically create the navigation items based on the sellerId
  const navItems = [
    { name: 'Dashboard', href: '/seller', icon: <LucideLayoutDashboard /> },
    { name: 'Add Product', href: '/seller/add-product', icon: <LucidePackagePlus /> },
    { name: 'Manage Products', href: '/seller/dashboard', icon: <LucideListOrdered /> },
    // Use sellerId to create a dynamic link
    { name: 'My Store', href: sellerId ? `/store/${sellerId}` : '#', icon: <LucideUser /> },
    { name: 'Edit Profile', href: '/seller/profile', icon: <LucideSettings /> },
    { name: 'Share Store', href: '/seller/share', icon: <LucideQrCode /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed top-0 left-0 flex-col hidden w-64 h-full bg-white shadow-md md:flex" style={{ borderRight: '1px solid #e0e0e0' }}>
        <Link href="/" className="flex items-center justify-center h-20">
          <img src="/logo.png" alt="Logo" className="w-auto h-12" />
        </Link>
        <div className="flex-grow p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="block">
                <div
                  className={cn(
                    'flex items-center rounded-md px-4 py-3 transition-colors',
                    pathname === item.href
                      ? 'bg-emerald-50 text-emerald-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <LucideLogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 z-50 w-full bg-white border-t border-gray-200 shadow-lg md:hidden">
        <nav className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center">
              <div
              className={cn(
                'flex flex-col items-center justify-center p-2 transition-colors',
                pathname === item.href ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="mt-1 text-xs font-medium">{item.name}</span>
            </div>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-red-600"
          >
            <LucideLogOut className="text-xl" />
            <span className="mt-1 text-xs font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}
