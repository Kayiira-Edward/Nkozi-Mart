'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Import the shared Firebase instances
import { auth, db, storage } from '@/app/firebase/config';
import ToastNotification from "../ToastNotification";

export default function ProductForm({ onSubmit, initialData }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // State for managing the toast notification
  const [toast, setToast] = useState({
    message: '',
    type: 'error',
    isVisible: false,
  });

  const router = useRouter();

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push('/auth/login'); // Redirect to login if not authenticated
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
    } else {
      // Reset form for adding new product
      setName('');
      setPrice('');
      setDescription('');
      setPreviewURL('');
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

  const uploadImage = async (file, productId) => {
    if (!file) return null;
    const storageRef = ref(storage, `products/${userId}/${productId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ ...toast, isVisible: false });

    if (!name || !price) {
      setToast({
        message: 'Product name and price are required.',
        type: 'error',
        isVisible: true,
      });
      setLoading(false);
      return;
    }

    try {
      if (initialData?.id) {
        // This is an update operation
        let imageUrl = initialData.image;
        if (imageFile) {
          imageUrl = await uploadImage(imageFile, initialData.id);
        }

        const productRef = doc(db, 'products', initialData.id);
        await updateDoc(productRef, {
          name,
          price: parseFloat(price),
          description,
          image: imageUrl,
          updatedAt: serverTimestamp(),
        });
        setToast({
          message: 'Product updated successfully!',
          type: 'success',
          isVisible: true,
        });
      } else {
        // This is an add new product operation
        const productsCollection = collection(db, 'products');
        // Add a temporary document to get a unique ID
        const newProductRef = doc(productsCollection);
        const productId = newProductRef.id;

        const imageUrl = await uploadImage(imageFile, productId);

        await setDoc(newProductRef, {
          sellerId: userId,
          name,
          price: parseFloat(price),
          description,
          image: imageUrl,
          createdAt: serverTimestamp(),
        });

        setToast({
          message: 'Product added successfully!',
          type: 'success',
          isVisible: true,
        });
        
        // Reset the form after successful addition
        setName('');
        setPrice('');
        setDescription('');
        setPreviewURL('');
        setImageFile(null);
      }
      
      // Call the onSubmit prop if it exists
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
    <div className="relative bg-[#f0f2f5] p-4 sm:p-6 lg:p-8"> {/* Updated background color */}
      <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-3xl sm:p-8 lg:p-10"> {/* Adjusted shadow for consistency */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800"> {/* Updated text color */}
            {initialData ? 'Update Product' : 'Add Product'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label> {/* Updated text color */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white text-gray-800 placeholder-gray-400" 

                placeholder="e.g., iPhone 14"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (UGX)</label> {/* Updated text color */}
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white text-gray-800 placeholder-gray-400" 
                placeholder="e.g., 1200000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label> {/* Updated text color */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 mt-1 border-2 border-gray-200 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#2edc86] bg-white text-gray-800 placeholder-gray-400" 

                placeholder="Write a short product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label> {/* Updated text color */}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-white bg-[#2edc86] rounded-2xl font-bold hover:bg-[#25b36b] transition-colors shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
          >
            {loading ? 'Submitting...' : (initialData ? 'Update Product' : 'Add Product')}
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
