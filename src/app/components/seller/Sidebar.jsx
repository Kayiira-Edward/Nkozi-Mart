'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Assuming cn is a utility function for Tailwind class merging
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Import the shared Firebase instance
import { auth } from '@/app/firebase/config';

import {
  LucideLayoutDashboard,
  LucidePackagePlus,
  LucideUser,
  LucideLogOut,
  LucideArrowLeft, // Import the back arrow icon
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
        // Redirect to login if not authenticated, if needed
        // router.push('/login');
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
    { name: 'DashBoard', href: '/seller', icon: <LucideLayoutDashboard /> },
    { name: 'Manage Products', href: '/seller/manage-products', icon: <LucidePackagePlus /> },
    { name: 'Profile', href: '/seller/profile', icon: <LucideUser /> },
  ];

  const shareProfileUrl = sellerId ? `/seller/${sellerId}` : '#';

  return (
    <>
      {/* Desktop Sidebar (one side) */}
      <div className="fixed top-0 left-0 flex-col hidden w-64 h-full bg-white shadow-md md:flex" style={{ borderRight: '1px solid #e0e0e0' }}>
        <Link href="/" className="flex items-center justify-center h-20">
          <img src="/logo.png" alt="Ugbuy Logo" className="w-auto h-12" />
        </Link>
        
        {/* Main Nav Section */}
        <div className="flex-grow p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="block">
                <div
                  className={cn(
                    'flex items-center rounded-md px-4 py-3 transition-colors',
                    pathname === item.href
                      ? 'bg-[#e6fcf0] text-[#25d366] font-semibold'
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

        {/* Logout Button for Desktop */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors rounded-md hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            title="Logout"
          >
            <LucideLogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Top Nav */}
      <div className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-md md:hidden">
        <nav className="flex items-center justify-between h-16 px-4">
          {/* Back button for mobile */}
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100"
            title="Go Back"
          >
            <LucideArrowLeft className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center justify-center h-full">
            <img src="/logo.png" alt="Ugbuy Logo" className="w-auto h-10" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 transition-colors rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
              title="Logout"
            >
              <LucideLogOut className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Nav (Icons Only) */}
      <div className="fixed bottom-0 z-50 w-full bg-white border-t border-gray-200 shadow-lg md:hidden">
        <nav className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center flex-1">
              <div
                className={cn(
                  'flex flex-col items-center justify-center p-2 transition-colors',
                  pathname === item.href ? 'text-[#25d366]' : 'text-gray-500 hover:text-[#25d366]'
                )}
              >
                <span className="text-xl">{item.icon}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
