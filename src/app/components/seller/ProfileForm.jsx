// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// import { auth } from '../../firebase/config';
// import LoadingSpinner from '../LoadingSpinner';
// import ToastNotification from '../ToastNotification';

// // Use your actual Cloudinary cloud name and upload preset here
// const CLOUDINARY_CLOUD_NAME = 'dzflajft3';
// const CLOUDINARY_UPLOAD_PRESET = 'marketplace_products_upload'; // Replace with your upload preset

// /**
//  * A form component to handle creating or editing a seller's profile.
//  * @param {object} initialData - The initial profile data to populate the form.
//  * @param {function} onSave - A callback function to be executed on form submission.
//  */
// export default function ProfileForm({ initialData, onSave }) {
//   const [storeName, setStoreName] = useState(initialData?.storeName || '');
//   const [description, setDescription] = useState(initialData?.description || '');
//   const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '');
//   const [location, setLocation] = useState(initialData?.location || '');
//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const [previewURL, setPreviewURL] = useState(initialData?.profileImage || '');
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//       } else {
//         router.push('/auth/login');
//       }
//     });
//     return () => unsubscribe();
//   }, [router]);

//   useEffect(() => {
//     if (initialData) {
//       setStoreName(initialData.storeName || '');
//       setDescription(initialData.description || '');
//       setWhatsapp(initialData.whatsapp || '');
//       setLocation(initialData.location || '');
//       setPreviewURL(initialData.profileImage || '');
//       setProfileImageFile(null);
//     }
//   }, [initialData]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileImageFile(file);
//       setPreviewURL(URL.createObjectURL(file));
//     }
//   };

//   /**
//    * Uploads the image file to Cloudinary.
//    * @param {File} file - The image file to upload.
//    * @returns {Promise<string|null>} The URL of the uploaded image, or null on failure.
//    */
//   const uploadImageToCloudinary = async (file) => {
//     if (!file) return null;

//     setToast({ message: 'Uploading image...', type: 'info', isVisible: true });
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       // CORRECTED: Use CLOUDINARY_UPLOAD_PRESET here
//       formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

//       // CORRECTED: Use CLOUDINARY_CLOUD_NAME variable in the URL
//       const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error.message || 'Cloudinary upload failed.');
//       }

//       const data = await response.json();
//       setToast({ message: 'Image uploaded successfully!', type: 'success', isVisible: true });
//       return data.secure_url;
//     } catch (error) {
//       console.error('Error uploading image to Cloudinary:', error);
//       setToast({ message: `Image upload failed: ${error.message}`, type: 'error', isVisible: true });
//       return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     let imageUrl = initialData?.profileImage || '';
//     if (profileImageFile) {
//       imageUrl = await uploadImageToCloudinary(profileImageFile);
//       if (!imageUrl) {
//         setLoading(false);
//         return;
//       }
//     }
    
//     if (onSave) {
//       await onSave({
//         storeName,
//         description,
//         whatsapp,
//         location,
//         profileImage: imageUrl,
//         userId
//       });
//     }

//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label htmlFor="storeName" className="block mb-1 text-sm font-medium text-gray-700">
//           Store Name
//         </label>
//         <input
//           type="text"
//           id="storeName"
//           name="storeName"
//           value={storeName}
//           onChange={(e) => setStoreName(e.target.value)}
//           className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
//           Description
//         </label>
//         <textarea
//           id="description"
//           name="description"
//           rows="3"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="whatsapp" className="block mb-1 text-sm font-medium text-gray-700">
//           WhatsApp Number
//         </label>
//         <input
//           type="tel"
//           id="whatsapp"
//           name="whatsapp"
//           value={whatsapp}
//           onChange={(e) => setWhatsapp(e.target.value)}
//           className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="location" className="block mb-1 text-sm font-medium text-gray-700">
//           Location
//         </label>
//         <input
//           type="text"
//           id="location"
//           name="location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="profileImage" className="block mb-1 text-sm font-medium text-gray-700">
//           Profile Picture
//         </label>
//         <input
//           type="file"
//           id="profileImage"
//           name="profileImage"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="w-full mt-1 text-gray-700 file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#2edc86] file:text-white hover:file:bg-[#25b36b] transition-colors cursor-pointer"
//         />
//         {previewURL && (
//           <div className="relative w-24 h-24 mt-4 overflow-hidden rounded-full shadow-inner">
//             <Image
//               src={previewURL}
//               alt="Profile Preview"
//               fill
//               style={{ objectFit: 'cover' }}
//             />
//           </div>
//         )}
//       </div>
//       <div className="flex justify-end">
//         <button
//           type="submit"
//           className="px-6 py-3 font-semibold text-white transition-colors bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2edc86] disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? <LoadingSpinner /> : 'Save Changes'}
//         </button>
//       </div>
//       <ToastNotification
//         message={toast.message}
//         type={toast.type}
//         isVisible={toast.isVisible}
//         onDismiss={() => setToast({ ...toast, isVisible: false })}
//       />
//     </form>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Camera, Image as ImageIcon, UploadCloud } from 'lucide-react';

import { auth } from '../../firebase/config';
import { db } from '../../firebase/config'; // Assuming db is also in this config file
import LoadingSpinner from '../LoadingSpinner';
import ToastNotification from '../ToastNotification';

// Use your actual Cloudinary cloud name and upload preset here
const CLOUDINARY_CLOUD_NAME = 'dzflajft3';
const CLOUDINARY_UPLOAD_PRESET = 'marketplace_products_upload'; // Replace with your upload preset

/**
 * A form component to handle creating or editing a seller's profile.
 * @param {object} initialData - The initial profile data to populate the form.
 * @param {function} onSave - A callback function to be executed on form submission.
 */
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

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Redirect to login if not authenticated
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
        bannerImage: bannerImageUrl, // Include the new banner image URL
        userId
      });
    }

    setLoading(false);
  };

  return (
    // The main container now has a fixed height and is scrollable
    <div className="max-h-[60vh] overflow-y-auto pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Container for banner and profile picture inputs */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          
          {/* Banner Image Upload */}
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
          
          {/* Profile Picture Upload */}
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
        
        {/* Existing form fields */}
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
