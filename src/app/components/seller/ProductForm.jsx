
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '@/app/firebase/config';
import ToastNotification from "../ToastNotification";
import LoadingSpinner from "../LoadingSpinner";

// Use your actual Cloudinary cloud name and upload preset here
const CLOUDINARY_CLOUD_NAME = 'dzflajft3';
const CLOUDINARY_UPLOAD_PRESET = 'marketplace_products_upload'; // Replace with your upload preset

// Define a list of categories for the dropdown
const categories = [
  'Snacks & Beverages',
  'Toiletries & Personal Care',
  'Stationery & Office Supplies',
  'Electronics & Gadgets',
  'Groceries & Fresh Produce',
  'Fashion & Apparel',
  'Home & Kitchen',
  'Books & Media',
  'Health & Wellness',
  'Other',
];

export default function ProductForm({ onSubmit, initialData }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [category, setCategory] = useState(''); // New state for category

  const [toast, setToast] = useState({
    message: '',
    type: 'error',
    isVisible: false,
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price || '');
      setDescription(initialData.description || '');
      setPreviewURL(initialData.image || '');
      setCategory(initialData.category || ''); // Set category from initial data
      setImageFile(null);
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setPreviewURL('');
      setCategory(''); // Reset category for new products
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

  /**
   * Uploads the image file to Cloudinary.
   * @param {File} file - The image file to upload.
   * @returns {Promise<string|null>} The URL of the uploaded image, or null on failure.
   */
  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

    setToast({ message: 'Uploading image...', type: 'info', isVisible: true });
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Cloudinary upload failed.');
      }

      const data = await response.json();
      setToast({ message: 'Image uploaded successfully!', type: 'success', isVisible: true });
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      setToast({ message: `Image upload failed: ${error.message}`, type: 'error', isVisible: true });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ ...toast, isVisible: false });

    if (!name || !price || !category) { // Added category validation
      setToast({
        message: 'Product name, price, and category are required.',
        type: 'error',
        isVisible: true,
      });
      setLoading(false);
      return;
    }

    try {
      if (initialData?.id) {
        // --- Logic for Updating an Existing Product ---
        let imageUrl = initialData.image;
        if (imageFile) {
          imageUrl = await uploadImageToCloudinary(imageFile);
          if (!imageUrl) {
            setLoading(false);
            return;
          }
        }

        const productRef = doc(db, 'products', initialData.id);
        await updateDoc(productRef, {
          name,
          price: parseFloat(price),
          description,
          image: imageUrl,
          category, // <-- Added category to the update
          updatedAt: serverTimestamp(),
        });
        setToast({
          message: 'Product updated successfully!',
          type: 'success',
          isVisible: true,
        });

      } else {
        // --- Logic for Adding a New Product ---
        if (!imageFile) {
          setToast({
            message: 'Please select an image for your new product.',
            type: 'error',
            isVisible: true,
          });
          setLoading(false);
          return;
        }

        const imageUrl = await uploadImageToCloudinary(imageFile);
        if (!imageUrl) {
          setLoading(false);
          return;
        }

        const productsCollection = collection(db, 'products');
        await addDoc(productsCollection, {
          sellerId: userId,
          name,
          price: parseFloat(price),
          description,
          image: imageUrl,
          category, // <-- Added category to the new product
          createdAt: serverTimestamp(),
        });

        setToast({
          message: 'Product added successfully!',
          type: 'success',
          isVisible: true,
        });

        setName('');
        setPrice('');
        setDescription('');
        setPreviewURL('');
        setCategory(''); // Reset category after adding
        setImageFile(null);
      }

      if (onSubmit) {
        onSubmit();
      }

    } catch (error) {
      console.error('Error submitting product:', error);
      setToast({
        message: `Failed to submit product: ${error.message}`,
        type: 'error',
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#f0f2f5] p-4 sm:p-6 lg:p-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-3xl sm:p-8 lg:p-10 max-h-[95vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            {initialData ? 'Update Product' : 'Add Product'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white text-gray-800 placeholder-gray-400"
                placeholder="e.g., iPhone 14"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (UGX)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white text-gray-800 placeholder-gray-400"
                placeholder="e.g., 1200000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white text-gray-800 placeholder-gray-400"
                placeholder="Write a short product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-1 text-gray-700 file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#2edc86] file:text-white hover:file:bg-[#25b36b] transition-colors cursor-pointer"
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

            {/* NEW: Category Dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white text-gray-800"
                    required
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-white bg-[#2edc86] rounded-2xl font-bold hover:bg-[#25b36b] transition-colors shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <LoadingSpinner /> : (initialData ? 'Update Product' : 'Add Product')}
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

