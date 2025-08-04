// app/components/seller/ProductForm.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ToastNotification from "../ToastNotification"; // Import the ToastNotification component

export default function ProductForm({ onSubmit, initialData }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  // State for managing the toast notification
  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false,
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPrice(initialData.price || "");
      setDescription(initialData.description || "");
      setPreviewURL(initialData.image || "");
    } else {
      // Reset form for adding new product
      setName("");
      setPrice("");
      setDescription("");
      setPreviewURL("");
      setImageFile(null);
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) {
      // Show an error toast notification
      setToast({
        message: "Product name and price are required.",
        type: "error",
        isVisible: true,
      });
      return;
    }

    const product = {
      id: initialData?.id || Date.now(),
      name,
      price: parseFloat(price),
      description,
      image: previewURL,
      file: imageFile,
    };

    onSubmit(product);
  };

  return (
    <div className="relative bg-[#E8F8F0] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl p-6 bg-white shadow-[0_0px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl sm:p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-[#2F4F4F]">
            {initialData ? "Update Product" : "Add Product"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#7D7D7D] font-['Roboto']">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#85D4A2] bg-[#F7F7F7] text-[#2F4F4F] placeholder-[#B0B0B0] font-['Roboto']"
                placeholder="e.g., iPhone 14"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7D7D7D] font-['Roboto']">Price (UGX)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#85D4A2] bg-[#F7F7F7] text-[#2F4F4F] placeholder-[#B0B0B0] font-['Roboto']"
                placeholder="e.g., 1200000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7D7D7D] font-['Roboto']">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl h-24 resize-none focus:outline-none focus:ring-4 focus:ring-[#85D4A2] bg-[#F7F7F7] text-[#2F4F4F] placeholder-[#B0B0B0] font-['Roboto']"
                placeholder="Write a short product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7D7D7D] font-['Roboto']">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-1 text-[#7D7D7D] font-['Roboto'] file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#A6D4A2] file:text-white hover:file:bg-[#91C89F] transition-colors cursor-pointer"
              />
              {previewURL && (
                <div className="relative w-full h-40 mt-4 overflow-hidden shadow-inner rounded-xl">
                  <Image
                    src={previewURL}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-white bg-[#5CB85C] rounded-2xl font-bold font-['Roboto'] hover:bg-[#4CAF50] transition-colors shadow-lg transform active:scale-95"
          >
            {initialData ? "Update Product" : "Add Product"}
          </button>
        </form>
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