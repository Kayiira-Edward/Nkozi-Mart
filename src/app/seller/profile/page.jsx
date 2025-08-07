'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken, getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getCountFromServer, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

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

// Initialize Firebase only once outside of the component to prevent re-initialization
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
    // State to hold the fetched data and UI status
    const [profile, setProfile] = useState(null);
    const [productCount, setProductCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    // useEffect for handling user authentication state
    // This runs only once on component mount.
    useEffect(() => {
        let isMounted = true;
        
        const authenticate = async () => {
            try {
                // First, attempt to sign in with the provided token or anonymously
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }

                // Now, set up the authentication state change listener.
                // This is the most reliable way to know the user's status.
                const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                    if (isMounted) {
                        if (user) {
                            setUserId(user.uid);
                            console.log("User authenticated:", user.uid);
                        } else {
                            setUserId(null);
                            setLoading(false); // Stop loading if no user is found
                            console.log("User not authenticated.");
                        }
                    }
                });
                
                // Return a cleanup function to unsubscribe the listener
                return () => {
                    unsubscribeAuth();
                    isMounted = false;
                };

            } catch (authError) {
                if (isMounted) {
                    console.error("Firebase auth error:", authError);
                    setError("Could not authenticate. Please try again.");
                    setLoading(false);
                }
            }
        };

        authenticate();

    }, []); // Empty dependency array ensures this runs once

    // useEffect for fetching data, dependent on userId.
    // This will run whenever the userId state changes.
    useEffect(() => {
        // Only fetch data if a user ID is available
        if (userId) {
            const fetchProfileAndCount = async () => {
                setLoading(true);
                try {
                    // Fetch the seller's profile
                    const profileRef = doc(db, `artifacts/${appId}/users/${userId}/profiles`, userId);
                    const profileSnap = await getDoc(profileRef);

                    if (profileSnap.exists()) {
                        setProfile(profileSnap.data());
                    } else {
                        setProfile(null);
                    }

                    // Fetch the count of products for this seller
                    const productsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/products`);
                    const productsQuery = query(productsCollectionRef, where('sellerId', '==', userId));
                    const snapshot = await getCountFromServer(productsQuery);
                    setProductCount(snapshot.data().count);
                    
                } catch (dataError) {
                    console.error("Error fetching data:", dataError);
                    setError("Could not fetch profile data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProfileAndCount();
        }
    }, [userId]); // This effect runs whenever userId changes

    // Conditional rendering based on the component state
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <p className="font-medium text-red-500">{error}</p>
            </div>
        );
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

// NOTE: Ensure that ProfileDisplay.jsx is a separate file that you have created.
// This example assumes it exists and takes 'profile' and 'productCount' as props.
const ProfileDisplay = ({ profile, productCount }) => {
    return (
        <div className="p-6 bg-white shadow-lg rounded-xl sm:p-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">Seller Profile</h1>
            {profile ? (
                <div>
                    <h2 className="mb-2 text-2xl font-semibold text-gray-700">{profile.name}</h2>
                    <p className="mb-4 text-lg text-gray-600">{profile.description}</p>
                    <div className="flex items-center mb-4 space-x-2 text-sm text-gray-500">
                        <p>Number of products listed:</p>
                        <span className="font-semibold text-gray-800">{productCount}</span>
                    </div>
                </div>
            ) : (
                <p className="text-lg text-gray-600">No profile found. Please complete your profile information.</p>
            )}
        </div>
    );
};
