// 'use client';

// import { useState, useEffect } from 'react';
// import { onAuthStateChanged, getAuth } from 'firebase/auth';
// import { doc, getDoc, collection, query, where, getCountFromServer, onSnapshot, getFirestore } from 'firebase/firestore';
// import { initializeApp, getApps } from 'firebase/app';
// import { useRouter } from 'next/navigation';

// // This is a placeholder component for the loading state.
// function LoadingSpinner() {
//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="w-12 h-12 border-4 border-gray-400 rounded-full animate-spin border-t-transparent"></div>
//     </div>
//   );
// }

// // NOTE: I've included a basic ProfileDisplay here so the code is self-contained.
// // You should use the one you've defined in your components folder.
// const ProfileDisplay = ({ profile, productCount, userId }) => {
//     return (
//         <div className="p-6 bg-white shadow-lg rounded-xl sm:p-8">
//             <h1 className="mb-4 text-3xl font-bold text-gray-800">Seller Profile</h1>
//             {profile ? (
//                 <div>
//                     <h2 className="mb-2 text-2xl font-semibold text-gray-700">{profile.name}</h2>
//                     <p className="mb-4 text-lg text-gray-600">{profile.description}</p>
//                     <div className="flex items-center mb-4 space-x-2 text-sm text-gray-500">
//                         <p>Number of products listed:</p>
//                         <span className="font-semibold text-gray-800">{productCount}</span>
//                     </div>
//                     <p className="p-2 mt-4 font-mono text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg">
//                         Your User ID: <span className="font-semibold text-blue-600 break-words">{userId}</span>
//                     </p>
//                 </div>
//             ) : (
//                 <p className="text-lg text-gray-600">No profile found. Please complete your profile information.</p>
//             )}
//         </div>
//     );
// };

// // IMPORTANT: These global variables are provided by the Canvas environment.
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
// const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
// const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// // Initialize Firebase only once outside of the component
// let app;
// if (!getApps().length) {
//     app = initializeApp(firebaseConfig);
// }
// const auth = getAuth(app);
// const db = getFirestore(app);

// /**
//  * A parent component that fetches seller data and passes it to ProfileDisplay.
//  */
// export default function SellerProfilePage() {
//     const [profile, setProfile] = useState(null);
//     const [productCount, setProductCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [user, setUser] = useState(null);
//     const router = useRouter();

//     // Effect for handling user authentication state and data fetching
//     useEffect(() => {
//       // Set up the authentication state change listener
//       const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
//           if (authUser) {
//               setUser(authUser);
//               // Now that we have the user, we can set up the data listeners
//               setupDataListeners(authUser.uid);
//           } else {
//               setUser(null);
//               setLoading(false);
//               // You might want to redirect to a login page here
//               // router.push('/auth?mode=login');
//               console.log("User not authenticated.");
//           }
//       });

//       // Function to set up the real-time Firestore listeners
//       const setupDataListeners = (uid) => {
//           setLoading(true);

//           // 1. Listen for real-time changes to the seller's profile
//           const profileRef = doc(db, 'sellers', uid);
//           const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
//               if (docSnap.exists()) {
//                   setProfile(docSnap.data());
//               } else {
//                   setProfile(null);
//               }
//               // Once profile is loaded, we can stop the initial loading state
//               setLoading(false);
//           }, (error) => {
//               console.error('Error fetching seller profile: ', error);
//               setLoading(false);
//           });

//           // 2. Listen for real-time changes to the product count
//           const productsQuery = query(collection(db, 'products'), where('sellerId', '==', uid));
//           const unsubscribeProducts = onSnapshot(productsQuery, (querySnapshot) => {
//               setProductCount(querySnapshot.size);
//           }, (error) => {
//               console.error('Error fetching products count: ', error);
//           });

//           // Return a cleanup function to unsubscribe from all listeners
//           return () => {
//               unsubscribeAuth();
//               unsubscribeProfile();
//               unsubscribeProducts();
//           };
//       };

//       // This is the cleanup for the main useEffect hook.
//       // It handles the case where the component unmounts before auth is complete.
//       return () => unsubscribeAuth();
//     }, []);

//     if (loading || !user) {
//         return <LoadingSpinner />;
//     }

//     return (
//         <div className="min-h-screen p-6 bg-gray-100">
//             <div className="max-w-2xl mx-auto">
//                 {/* Render the ProfileDisplay component with fetched data */}
//                 <ProfileDisplay profile={profile} productCount={productCount} userId={user.uid} />
//             </div>
//         </div>
//     );
// }
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Mail, Phone, MapPin, Share2, Pencil, X, Calendar, Package } from 'lucide-react';

import Modal from '../../components/Modal';
import ProfileForm from '../../components/seller/ProfileForm';
import ToastNotification from '../../components/ToastNotification';

// IMPORTANT: These global variables are provided by the Canvas environment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase only once outside of the component
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
}
const auth = getAuth(app);
const db = getFirestore(app);

// A simple loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-12 h-12 border-4 border-gray-400 rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
}

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
    // State to control the profile edit modal
    const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
    const router = useRouter();

    useEffect(() => {
      // Set up the authentication state change listener
      const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
              setUser(authUser);
              // Now that we have the user, we can set up the data listeners
              setupDataListeners(authUser.uid);
          } else {
              setUser(null);
              setLoading(false);
              // Redirect to login if not authenticated
              router.push('/auth?mode=login');
          }
      });

      // Function to set up the real-time Firestore listeners
      const setupDataListeners = (uid) => {
          setLoading(true);

          // 1. Listen for real-time changes to the seller's profile
          const profileRef = doc(db, 'sellers', uid);
          const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
              if (docSnap.exists()) {
                  setProfile(docSnap.data());
              } else {
                  setProfile(null);
              }
              setLoading(false);
          }, (error) => {
              console.error('Error fetching seller profile: ', error);
              setLoading(false);
          });

          // 2. Listen for real-time changes to the products
          const productsQuery = query(collection(db, 'products'), where('sellerId', '==', uid));
          const unsubscribeProducts = onSnapshot(productsQuery, (querySnapshot) => {
              const productsArray = [];
              querySnapshot.forEach((doc) => {
                productsArray.push({ id: doc.id, ...doc.data() });
              });
              setProducts(productsArray);
          }, (error) => {
              console.error('Error fetching products: ', error);
          });

          // Return a cleanup function to unsubscribe from all listeners
          return () => {
              unsubscribeProfile();
              unsubscribeProducts();
          };
      };
      
      // Cleanup for the main useEffect hook.
      return () => unsubscribeAuth();
    }, [router]);
    
    // Function to handle the share button click
    const handleShareProfile = async () => {
        const publicUrl = `${window.location.origin}/seller/${user.uid}`; // This is an example public URL structure
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(publicUrl);
                setToast({ message: 'Public profile link copied to clipboard!', type: 'success', isVisible: true });
            } else {
                // Fallback for browsers that don't support the modern clipboard API
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
    
    // Handle the save from the ProfileForm
    const handleSaveProfile = async (profileData) => {
      // In a real app, you would save the data to Firestore here
      // For this example, we just close the modal and show a toast
      console.log('Saving profile data:', profileData);
      setIsProfileEditModalOpen(false);
      setToast({ message: 'Profile saved successfully!', type: 'success', isVisible: true });
    };

    if (loading || !user) {
        return <LoadingSpinner />;
    }

    // Default values if no profile is found
    const defaultProfile = {
      storeName: 'Seller Profile',
      description: 'No description provided.',
      location: 'Unknown',
      profileImage: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=P',
      whatsapp: '',
      joinDate: new Date() // Placeholder for a default date
    };
    const currentProfile = profile || defaultProfile;
    const formattedJoinDate = currentProfile.joinDate ? new Date(currentProfile.joinDate.seconds * 1000).toLocaleDateString() : 'N/A';

    return (
        <div className="min-h-screen text-gray-800 bg-gray-100">
            {/* Profile Header section */}
            <div className="relative pb-24 bg-white shadow-md rounded-b-3xl">
                {/* Placeholder Cover Image */}
                <div className="w-full h-40 bg-gray-300"></div>

                <div className="container flex items-end justify-between px-6 mx-auto -mt-16 sm:-mt-20">
                    <div className="relative w-32 h-32 overflow-hidden bg-gray-200 border-4 border-white rounded-full shadow-md">
                      <Image
                        src={currentProfile.profileImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Updated button container for better responsiveness */}
                    <div className="flex flex-col mt-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:mt-0">
                         {/* This button opens the ProfileForm modal */}
                        <button
                            onClick={() => setIsProfileEditModalOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 text-sm font-semibold text-white bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b] transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:ring-opacity-50"
                        >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                        <button
                            onClick={handleShareProfile}
                            className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Profile
                        </button>
                    </div>
                </div>

                <div className="container px-6 mx-auto mt-4">
                    <h1 className="text-3xl font-bold">{currentProfile.storeName}</h1>
                    <p className="mt-1 text-lg text-gray-500">{currentProfile.description}</p>

                    {/* New section for location, join date, and product count */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-gray-600">
                        {/* Location */}
                        <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                            {currentProfile.location}
                        </span>
                        {/* Join Date */}
                        
                        {/* Number of Products */}
                        <span className="flex items-center">
                            <Package className="w-4 h-4 mr-1 text-gray-500" />
                            {products.length} {products.length === 1 ? 'Product' : 'Products'}
                        </span>
                    </div>

                    {/* Contact info */}
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

            {/* Products Feed section */}
            <div className="container px-6 mx-auto mt-6">
                <h2 className="mb-4 text-xl font-bold">Products Listed</h2>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-12 text-center text-gray-500 bg-white shadow-inner rounded-2xl">
                        <p>This seller has no products listed yet.</p>
                    </div>
                )}
            </div>
            
            {/* Modal for editing the profile */}
            <Modal isOpen={isProfileEditModalOpen} onClose={() => setIsProfileEditModalOpen(false)}>
                <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Edit Your Profile</h2>
                        <button onClick={() => setIsProfileEditModalOpen(false)}><X/></button>
                    </div>
                    <ProfileForm initialData={currentProfile} onSave={handleSaveProfile} />
                </div>
            </Modal>

            {/* Toast notification for user feedback */}
            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onDismiss={() => setToast({ ...toast, isVisible: false })}
            />
        </div>
    );
}
