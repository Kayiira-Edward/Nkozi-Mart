

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, collection, query, where, onSnapshot, setDoc } from 'firebase/firestore';
import { Mail, Phone, MapPin, Share2, Pencil, X, Package, Save, Image as ImageIcon, UploadCloud } from 'lucide-react';


// IMPORTANT: These global variables are provided by the Canvas environment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase only once outside of the component to prevent re-initialization errors.
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}
const auth = getAuth(app);
const db = getFirestore(app);

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="w-12 h-12 border-4 border-gray-400 rounded-full animate-spin border-t-transparent"></div>
  </div>
);

// A simple ToastNotification component for this example
const ToastNotification = ({ message, type, isVisible, onDismiss }) => {
  if (!isVisible) return null;
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`fixed bottom-4 right-4 text-white p-4 rounded-lg shadow-lg ${bgColor}`}>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold">X</button>
    </div>
  );
};

// A simple Modal component for this example
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

// Use your actual Cloudinary cloud name and upload preset here
const CLOUDINARY_CLOUD_NAME = 'dzflajft3';
const CLOUDINARY_UPLOAD_PRESET = 'marketplace_products_upload'; // Replace with your upload preset


// INLINE ProfileForm component with image upload and drag-and-drop functionality
const ProfileForm = ({ initialData, onSave, onClose }) => {
  const [storeName, setStoreName] = useState(initialData?.storeName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '');
  const [location, setLocation] = useState(initialData?.location || '');
  
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profilePreviewURL, setProfilePreviewURL] = useState(initialData?.profileImage || '');
  const [isProfileDragging, setIsProfileDragging] = useState(false);

  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerPreviewURL, setBannerPreviewURL] = useState(initialData?.bannerImage || '');
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  
  // Update form fields if initialData changes
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
  
  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfilePreviewURL(URL.createObjectURL(file));
    }
  };
  
  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      setBannerPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDragEnterProfile = (e) => { e.preventDefault(); setIsProfileDragging(true); };
  const handleDragLeaveProfile = (e) => { e.preventDefault(); setIsProfileDragging(false); };
  const handleDropProfile = (e) => {
    e.preventDefault();
    setIsProfileDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) { setProfileImageFile(file); setProfilePreviewURL(URL.createObjectURL(file)); }
  };
  const handleDragEnterBanner = (e) => { e.preventDefault(); setIsBannerDragging(true); };
  const handleDragLeaveBanner = (e) => { e.preventDefault(); setIsBannerDragging(false); };
  const handleDropBanner = (e) => {
    e.preventDefault();
    setIsBannerDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) { setBannerImageFile(file); setBannerPreviewURL(URL.createObjectURL(file)); }
  };

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
        bannerImage: bannerImageUrl,
      });
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="w-full md:w-2/3">
            <label className="block mb-2 text-sm font-medium text-gray-700">Banner Image</label>
            <div
              className={`relative w-full h-32 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors ${isBannerDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnterBanner}
              onDragLeave={handleDragLeaveBanner}
              onDrop={handleDropBanner}
            >
              {bannerPreviewURL ? (
                <Image src={bannerPreviewURL} alt="Banner Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <p className="text-sm font-semibold">Drag & drop or click to upload banner</p>
                </div>
              )}
              <input type="file" id="bannerImage" name="bannerImage" accept="image/*" onChange={handleBannerImageChange} className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block mb-2 text-sm font-medium text-gray-700">Profile Picture</label>
            <div
              className={`relative w-28 h-28 mx-auto rounded-full border-2 border-dashed overflow-hidden cursor-pointer transition-colors ${isProfileDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnterProfile}
              onDragLeave={handleDragLeaveProfile}
              onDrop={handleDropProfile}
            >
              {profilePreviewURL ? (
                <Image src={profilePreviewURL} alt="Profile Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-2 text-gray-500">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <p className="text-xs text-center">Drag & drop or click</p>
                </div>
              )}
              <input type="file" id="profileImage" name="profileImage" accept="image/*" onChange={handleProfileImageChange} className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer" />
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
};


// A simple component to display a single product with only image and price
const ProductCard = ({ product }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 shadow-lg sm:p-6 rounded-2xl">
      <div className="mt-4">
        {product.imageUrls && product.imageUrls.length > 0 && (
          <div className="relative w-full h-48 mb-4 overflow-hidden bg-gray-100 rounded-xl">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-bold text-[#2edc86]">${product.price}</p>
        </div>
      </div>
    </div>
  );
};

// Main component to display the seller's profile
export default function SellerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
  const router = useRouter();

  // useEffect for authentication
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        console.log('User authenticated:', authUser.uid);
      } else {
        console.log('User not authenticated, attempting to sign in with custom token...');
        if (initialAuthToken) {
          try {
            await signInWithCustomToken(auth, initialAuthToken);
            console.log('Signed in with custom token.');
          } catch (authError) {
            console.error("Firebase auth error during sign-in:", authError);
            setError("Could not authenticate. Please try again.");
            setLoading(false);
          }
        } else {
          console.error('No custom auth token available.');
          try {
            await signInAnonymously(auth);
            console.log('Signed in anonymously.');
          } catch (anonError) {
            console.error("Firebase auth error during anonymous sign-in:", anonError);
            setError("Failed to sign in anonymously. Please try again.");
            setLoading(false);
          }
        }
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  // useEffect for fetching data once the user is authenticated
  useEffect(() => {
    if (!user) {
      console.log('Waiting for user authentication before fetching data...');
      setLoading(true);
      return;
    }
    setLoading(true);

    const profileRef = doc(db, 'sellers', user.uid);
    const productsQuery = query(collection(db, 'products'), where('sellerId', '==', user.uid));

    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching seller profile:', error);
      setError('Failed to load profile data. This could be a permissions issue.');
      setLoading(false);
    });

    const unsubscribeProducts = onSnapshot(productsQuery, (querySnapshot) => {
      const productsArray = [];
      querySnapshot.forEach((doc) => {
        productsArray.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsArray);
    }, (error) => {
      console.error('Error fetching products:', error);
      setError('Failed to load products. This could be a permissions issue.');
      setLoading(false);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeProducts();
    };
  }, [user]);

  const handleShareProfile = async () => {
    const publicUrl = `${window.location.origin}/seller/${user.uid}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(publicUrl);
        setToast({ message: 'Public profile link copied to clipboard!', type: 'success', isVisible: true });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = publicUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setToast({ message: 'Public profile link copied to clipboard!', type: 'success', isVisible: true });
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setToast({ message: 'Failed to copy link.', type: 'error', isVisible: true });
    }
  };

  const handleSaveProfile = async (profileData) => {
    setLoading(true);
    try {
      const profileRef = doc(db, 'sellers', user.uid);
      await setDoc(profileRef, {
        ...profileData,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      setToast({ message: 'Profile saved successfully!', type: 'success', isVisible: true });
      setIsProfileEditModalOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setToast({ message: 'Failed to save profile. Check your network and permissions.', type: 'error', isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="px-4 font-medium text-center text-red-500">{error}</p>
      </div>
    );
  }

  const defaultProfile = {
    storeName: 'New Seller',
    description: 'No description provided.',
    location: 'Unknown',
    profileImage: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=P',
    bannerImage: 'https://placehold.co/1200x400/CCCCCC/333333?text=Banner',
    whatsapp: '',
    joinDate: new Date().toISOString(),
  };
  const currentProfile = profile || defaultProfile;

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100">
      <div className="relative pb-24 bg-white shadow-md rounded-b-3xl">
        <div className="relative w-full h-40 overflow-hidden bg-gray-300">
          <img
            src={currentProfile.bannerImage}
            alt="Banner Image"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="container flex items-end justify-between px-6 mx-auto -mt-16 sm:-mt-20">
          <div className="relative w-32 h-32 overflow-hidden bg-gray-200 border-4 border-white rounded-full shadow-md">
            <img
              src={currentProfile.profileImage}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col mt-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:mt-0">
                <button
                    onClick={() => setIsProfileEditModalOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 text-sm font-semibold text-white bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b] transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:ring-opacity-50"
                >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                </button>
                {/* <button
                    onClick={handleShareProfile}
                    className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                </button> */}
          </div>
        </div>

        <div className="container px-6 mx-auto mt-4">
          <h1 className="text-3xl font-bold">{currentProfile.storeName}</h1>
          <p className="mt-1 text-lg text-gray-500">{currentProfile.description}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-gray-600">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-500" />
              {currentProfile.location}
            </span>
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-1 text-gray-500" />
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>
          <div className="flex items-center mt-3 space-x-4 text-gray-500">
            {currentProfile.whatsapp && (
              <a
                href={`https://wa.me/${currentProfile.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#2edc86] hover:text-[#25b36b] transition-colors"
              >
                <Phone className="w-4 h-4 mr-1" />
                {currentProfile.whatsapp}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* <div className="container px-6 mx-auto mt-6">
        <h2 className="mb-4 text-xl font-bold">Products Listed</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 text-center text-gray-500 bg-white shadow-inner rounded-2xl">
            <p>U gat no products listed yet.</p>
          </div>
        )}
      </div> */}

      <Modal isOpen={isProfileEditModalOpen} onClose={() => setIsProfileEditModalOpen(false)}>
        <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Edit Your Profile</h2>
            <button onClick={() => setIsProfileEditModalOpen(false)}><X/></button>
          </div>
          <ProfileForm initialData={currentProfile} onSave={handleSaveProfile} onClose={() => setIsProfileEditModalOpen(false)}/>
        </div>
      </Modal>

      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
