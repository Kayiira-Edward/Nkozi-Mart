'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth"; // Import signOut from Firebase auth

// Import shared Firebase instances
import { auth } from '@/app/firebase/config';
import ToastNotification from "@/app/components/ToastNotification"; // Assuming this path is correct

export default function LogoutPage() {
  const router = useRouter();
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth); // Sign out the user from Firebase
        setToast({ message: 'You have been successfully logged out!', type: 'success', isVisible: true });
        // Clear any local storage items specific to the user session if necessary,
        // but avoid localStorage.clear() if other data needs to persist.
        localStorage.removeItem('currentSellerId'); // Example: clear specific seller ID
        localStorage.removeItem('sellerProfile'); // Example: clear seller profile
        localStorage.removeItem('sellerProducts'); // Example: clear seller products

        setTimeout(() => {
          router.push("/"); // Redirect to homepage after a short delay
        }, 1500); // Give time for toast to be seen
      } catch (error) {
        console.error("Error signing out:", error);
        setToast({ message: `Failed to log out: ${error.message}`, type: 'error', isVisible: true });
        // Even on error, redirect after a delay to prevent being stuck
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0f2f5] font-sans">
      <div className="p-8 text-center bg-white shadow-lg rounded-3xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Logging Out...</h1>
        <p className="text-lg text-gray-600">Please wait while we securely sign you out.</p>
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
