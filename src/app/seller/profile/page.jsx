'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken, getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getCountFromServer, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

import ProfileDisplay from '@/app/components/seller/ProfileDisplay';

// This is a placeholder component for the loading state.
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-12 h-12 border-4 border-gray-400 rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
}

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

/**
 * A parent component that fetches seller data and passes it to ProfileDisplay.
 */
export default function SellerProfilePage() {
    const [profile, setProfile] = useState(null);
    const [productCount, setProductCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Effect for handling user authentication state
    useEffect(() => {
      // Authenticate the user with the provided token
      const authenticate = async () => {
        try {
            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                await signInAnonymously(auth);
            }
        } catch (error) {
            console.error("Firebase auth error:", error);
        }
      };

      authenticate();

      // Set up the authentication state change listener
      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          if (user) {
              setUserId(user.uid);
              console.log("User authenticated:", user.uid);
              fetchProfileAndCount(user.uid);
          } else {
              setUserId(null);
              setLoading(false);
              console.log("User not authenticated.");
          }
      });

      return () => unsubscribeAuth();
    }, []);

    // Fetch profile and product count from Firestore
    const fetchProfileAndCount = async (uid) => {
        setLoading(true);
        try {
            // Fetch the seller's profile
            const profileRef = doc(db, 'profiles', uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                setProfile(profileSnap.data());
            } else {
                setProfile(null);
            }

            // Fetch the count of products for this seller
            const productsCollectionRef = collection(db, 'products');
            const productsQuery = query(productsCollectionRef, where('sellerId', '==', uid));
            const snapshot = await getCountFromServer(productsQuery);
            setProductCount(snapshot.data().count);
            
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-600">Please log in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <div className="max-w-2xl mx-auto">
                {/* Render the ProfileDisplay component with fetched data */}
                <ProfileDisplay profile={profile} productCount={productCount} />
            </div>
        </div>
    );
}
