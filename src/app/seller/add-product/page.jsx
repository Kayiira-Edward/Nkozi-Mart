// app/seller/add-product/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../components/seller/ProductForm";
import ToastNotification from "../../components/ToastNotification";

export default function AddProductPage() {
  const router = useRouter();
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  const handleAddProduct = (newProduct) => {
    // In a real app, you would send this data to a backend API.
    // For this example, we save it to local storage.
    const savedProducts = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
    
    // Check for a file, if it exists, save it with a unique ID
    let imageUrl = null;
    if (newProduct.file) {
      imageUrl = URL.createObjectURL(newProduct.file);
      // For this example, we'll store the URL as the image path.
      // In a real app, you'd upload the file to a server and get back a URL.
    }
    
    const productToAdd = {
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        image: imageUrl || newProduct.image,
    };

    const updatedProducts = [...savedProducts, productToAdd];
    localStorage.setItem("sellerProducts", JSON.stringify(updatedProducts));

    // Show a success notification
    setToast({
      message: "Product added successfully!",
      type: "success",
      isVisible: true,
    });
    
    // Redirect to the manage products page after a short delay
    setTimeout(() => {
      router.push("/seller/manage-products");
    }, 1500);
  };

  return (
    <div className="flex justify-center min-h-screen p-6 font-sans antialiased bg-gray-100">
      <div className="w-full max-w-xl">
        <ProductForm onSubmit={handleAddProduct} />
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
