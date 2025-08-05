'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Edit, Share2 } from "lucide-react"; // Added Share2 icon
import ToastNotification from "@/app/components/ToastNotification"; // Assuming this path is correct

// Import shared Firebase instances
import { auth, db } from "@/app/firebase/config";
import ProfileDisplay from "@/app/components/seller/ProfileDisplay";
import ProfileForm from "@/app/components/seller/ProfileForm";

export default function SellerProfilePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                router.push('/auth?mode=login'); // Redirect to centralized login
            }
        });
        return () => unsubscribeAuth();
    }, [router]);

    useEffect(() => {
        if (!user) return;

        const profileRef = doc(db, "sellers", user.uid);
        const unsubscribeFirestore = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            } else {
                setProfile(null); // Profile does not exist
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching seller profile:", error);
            setLoading(false);
            setToast({ message: 'Error loading profile.', type: 'error', isVisible: true });
        });

        return () => unsubscribeFirestore();
    }, [user]);

    const handleSaveProfile = async (formData) => {
        if (!user) return;

        setLoading(true);
        try {
            const profileRef = doc(db, "sellers", user.uid);
            await updateDoc(profileRef, formData);
            setIsEditing(false);
            setToast({ message: 'Profile updated successfully!', type: 'success', isVisible: true });
        } catch (error) {
            console.error("Error updating seller profile:", error);
            setToast({ message: 'Failed to update profile. Please try again.', type: 'error', isVisible: true });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyStoreLink = async () => {
        if (!user) {
            setToast({ message: 'Please log in to share your store.', type: 'error', isVisible: true });
            return;
        }
        // Construct the public store URL using the user's UID as storeId
        const storeUrl = `${window.location.origin}/seller/${user.uid}`;
        try {
            // Use document.execCommand('copy') for better iframe compatibility
            const textarea = document.createElement('textarea');
            textarea.value = storeUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            setToast({ message: 'Store link copied to clipboard!', type: 'success', isVisible: true });
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setToast({ message: 'Failed to copy link. Please try manually.', type: 'error', isVisible: true });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-600 bg-[#f0f2f5]">
                Loading profile...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[#f0f2f5]">
                <h1 className="mb-4 text-3xl font-bold text-gray-800">No Profile Found</h1>
                <p className="mb-6 text-center text-gray-600">
                    It looks like your seller profile hasn't been set up yet.
                </p>
                <button
                    onClick={() => setIsEditing(true)} // Directly open the form to create profile
                    className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-colors bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b]" // Styled to match theme
                >
                    Create My Seller Profile
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#f0f2f5] min-h-screen font-sans p-4 sm:p-8 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="relative p-6 bg-white shadow-lg rounded-3xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">Seller Profile</h1>
                    
                    {/* Edit and Share buttons */}
                    <div className="absolute flex space-x-2 top-6 right-6">
                        <button
                            onClick={handleCopyStoreLink}
                            className="p-2 transition-colors bg-gray-100 rounded-full hover:bg-gray-200"
                            aria-label="Copy store link"
                        >
                            <Share2 size={20} className="text-gray-600" />
                        </button>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-2 transition-colors bg-gray-100 rounded-full hover:bg-gray-200"
                            aria-label="Toggle edit mode"
                        >
                            <Edit size={20} className="text-gray-600" />
                        </button>
                    </div>
                    
                    {isEditing ? (
                        <ProfileForm 
                            initialData={profile} 
                            onSave={handleSaveProfile} 
                        />
                    ) : (
                        <ProfileDisplay profile={profile} />
                    )}
                </div>
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
