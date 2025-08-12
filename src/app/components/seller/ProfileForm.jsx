
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Camera, Image as ImageIcon, UploadCloud } from 'lucide-react';

import { auth, db } from '../../firebase/config';
import LoadingSpinner from '../LoadingSpinner';
import ToastNotification from '../ToastNotification';

const CLOUDINARY_CLOUD_NAME = 'dzflajft3';
const CLOUDINARY_UPLOAD_PRESET = 'marketplace_products_upload';

export default function ProfileForm({ initialData, onSave }) {
  const [storeName, setStoreName] = useState(initialData?.storeName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '');
  const [location, setLocation] = useState(initialData?.location || '');
  
  // State for profile image
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profilePreviewURL, setProfilePreviewURL] = useState(initialData?.profileImage || '');
  const [isProfileDragging, setIsProfileDragging] = useState(false);

  // State for banner image
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerPreviewURL, setBannerPreviewURL] = useState(initialData?.bannerImage || '');
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

  // NEW: State for whatsapp number validation error
  const [whatsappError, setWhatsappError] = useState('');

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
      setStoreName(initialData.storeName || '');
      setDescription(initialData.description || '');
      setWhatsapp(initialData.whatsapp || '');
      setLocation(initialData.location || '');
      setProfilePreviewURL(initialData.profileImage || '');
      setBannerPreviewURL(initialData.bannerImage || '');
      setProfileImageFile(null);
      setBannerImageFile(null);
    }
  }, [initialData]);

  // Handler for profile image file input
  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfilePreviewURL(URL.createObjectURL(file));
    }
  };

  // Handler for banner image file input
  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      setBannerPreviewURL(URL.createObjectURL(file));
    }
  };

  // Generic drag and drop handlers for both image inputs
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnterProfile = (e) => {
    e.preventDefault();
    setIsProfileDragging(true);
  };

  const handleDragLeaveProfile = (e) => {
    e.preventDefault();
    setIsProfileDragging(false);
  };

  const handleDropProfile = (e) => {
    e.preventDefault();
    setIsProfileDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfilePreviewURL(URL.createObjectURL(file));
    }
  };

  const handleDragEnterBanner = (e) => {
    e.preventDefault();
    setIsBannerDragging(true);
  };

  const handleDragLeaveBanner = (e) => {
    e.preventDefault();
    setIsBannerDragging(false);
  };

  const handleDropBanner = (e) => {
    e.preventDefault();
    setIsBannerDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setBannerImageFile(file);
      setBannerPreviewURL(URL.createObjectURL(file));
    }
  };

  /**
   * Uploads the image file to Cloudinary.
   * @param {File} file - The image file to upload.
   * @returns {Promise<string|null>} The URL of the uploaded image, or null on failure.
   */
  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

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
    setWhatsappError('');

    // NEW: Phone number validation
    if (whatsapp.startsWith('0')) {
        setWhatsappError('Please enter your WhatsApp number without the leading zero.');
        setLoading(false);
        setToast({ message: 'WhatsApp number should not start with zero.', type: 'error', isVisible: true });
        return;
    }

    let profileImageUrl = initialData?.profileImage || '';
    if (profileImageFile) {
      setToast({ message: 'Uploading profile image...', type: 'info', isVisible: true });
      profileImageUrl = await uploadImageToCloudinary(profileImageFile);
      if (!profileImageUrl) {
        setLoading(false);
        return;
      }
    }
    
    let bannerImageUrl = initialData?.bannerImage || '';
    if (bannerImageFile) {
      setToast({ message: 'Uploading banner image...', type: 'info', isVisible: true });
      bannerImageUrl = await uploadImageToCloudinary(bannerImageFile);
      if (!bannerImageUrl) {
        setLoading(false);
        return;
      }
    }
    
    if (onSave) {
      await onSave({
        storeName,
        description,
        whatsapp,
        location,
        profileImage: profileImageUrl,
        bannerImage: bannerImageUrl,
        userId
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          
          <div className="w-full md:w-2/3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Banner Image
            </label>
            <div
              className={`relative w-full h-32 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors ${isBannerDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnterBanner}
              onDragLeave={handleDragLeaveBanner}
              onDrop={handleDropBanner}
            >
              {bannerPreviewURL ? (
                <Image
                  src={bannerPreviewURL}
                  alt="Banner Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <p className="text-sm font-semibold">Drag & drop or click to upload banner</p>
                </div>
              )}
              <input
                type="file"
                id="bannerImage"
                name="bannerImage"
                accept="image/*"
                onChange={handleBannerImageChange}
                className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div
              className={`relative w-28 h-28 mx-auto rounded-full border-2 border-dashed overflow-hidden cursor-pointer transition-colors ${isProfileDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnterProfile}
              onDragLeave={handleDragLeaveProfile}
              onDrop={handleDropProfile}
            >
              {profilePreviewURL ? (
                <Image
                  src={profilePreviewURL}
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-2 text-gray-500">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <p className="text-xs text-center">Drag & drop or click</p>
                </div>
              )}
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="storeName" className="block mb-1 text-sm font-medium text-gray-700">Store Name</label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className="block mb-1 text-sm font-medium text-gray-700">WhatsApp Number</label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
            required
          />
          {whatsappError && <p className="mt-1 text-sm text-red-500">{whatsappError}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Please enter your number without the country code or a leading zero (e.g., 772123456).
          </p>
        </div>
        <div>
          <label htmlFor="location" className="block mb-1 text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 font-semibold text-white transition-colors bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2edc86] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Save Changes'}
          </button>
        </div>
        
        <ToastNotification
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onDismiss={() => setToast({ ...toast, isVisible: false })}
        />
      </form>
    </div>
  );
}