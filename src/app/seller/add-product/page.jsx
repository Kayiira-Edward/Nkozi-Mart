'use client';

import { useRouter } from 'next/navigation';
import ProductForm from "../../components/seller/ProductForm";
import ToastNotification from "../../components/ToastNotification";
import { useState } from 'react';

export default function AddProductPage() {
  const router = useRouter();
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // This function is called by the ProductForm after a successful product submission.
  const handleProductSubmitted = () => {
    // Show a success notification
    setToast({
      message: "Product added successfully!",
      type: "success",
      isVisible: true,
    });
    
    // Redirect to the dashboard after a short delay
    setTimeout(() => {
      router.push("/seller/dashboard");
    }, 1500);
  };

  return (
    <div className="flex justify-center min-h-screen p-6 font-sans antialiased bg-gray-100">
      <div className="w-full max-w-xl">
        <ProductForm onSubmit={handleProductSubmitted} />
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
