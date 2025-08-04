// app/seller/manage-products/page.jsx
"use client";

import { useState, useEffect } from "react";
import ProductCard from "../../components/seller/ProductCard";
import ProductForm from "../../components/seller/ProductForm";
import Modal from "../../components/Modal";
import { Plus } from "lucide-react";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Load products from local storage on component mount
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("sellerProducts")) || [];
    setProducts(savedProducts);
  }, []);

  // Save products to local storage whenever the products state changes
  useEffect(() => {
    localStorage.setItem("sellerProducts", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setIsModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) => 
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter(p => p.id !== productId));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };
  
  // NOTE: You'll also need to get the seller's whatsapp number to pass to the ProductCard
  // This is a placeholder for now
  const [sellerProfile, setSellerProfile] = useState(null);
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("sellerProfile"));
    if (savedProfile) {
      setSellerProfile(savedProfile);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7F9] p-6 font-sans antialiased">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#2C3E50]">Manage Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-6 py-3 text-white bg-[#5CB85C] rounded-full shadow-lg hover:bg-[#4CAF50] transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#5CB85C] focus:ring-opacity-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">Add New Product</span>
        </button>
      </header>

      {products.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <p className="text-lg text-[#7F8C8D] font-medium">No products yet. Click the button to add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              whatsapp={sellerProfile?.whatsapp}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProductForm onSubmit={handleAddProduct} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ProductForm onSubmit={handleUpdateProduct} initialData={editingProduct} />
      </Modal>
    </div>
  );
}
