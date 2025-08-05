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
    
    // Redirect to the manage products page after a short delay
    setTimeout(() => {
      router.push("/seller/manage-products"); // Changed to manage-products as per common flow
    }, 1500);
  };

  return (
    <div className="flex justify-center min-h-screen p-6 font-sans antialiased bg-[#f0f2f5]"> {/* Updated background color */}
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
