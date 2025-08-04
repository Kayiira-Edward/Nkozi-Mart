'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Import shared Firebase instances
import { db, auth } from '@/app/firebase/config';
import ToastNotification from "../ToastNotification";

export default function ProfileEditor({ onSave }) {
    const [profile, setProfile] = useState({
        shopName: "",
        whatsapp: "",
        description: "",
        location: "",
    });
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const [toast, setToast] = useState({
        message: "",
        type: "error",
        isVisible: false,
    });

    useEffect(() => {
        // Set up auth state listener
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                router.push('/auth/login');
            }
        });
        return () => unsubscribeAuth();
    }, [router]);

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        // Set up a real-time Firestore listener for the seller profile
        const profileRef = doc(db, 'sellers', userId);
        const unsubscribeFirestore = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            }
            setLoading(false);
        }, (error) => {
            console.error('Error fetching seller profile: ', error);
            setLoading(false);
        });

        return () => unsubscribeFirestore();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setToast({ ...toast, isVisible: false });

        if (!userId) {
            setToast({ message: 'You must be logged in to update your profile.', type: 'error', isVisible: true });
            setIsSaving(false);
            return;
        }

        try {
            const sellerRef = doc(db, 'sellers', userId);
            await setDoc(sellerRef, profile, { merge: true });

            setToast({
                message: "Profile updated successfully!",
                type: "success",
                isVisible: true,
            });

            if (onSave) {
                onSave();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setToast({
                message: `Failed to update profile: ${error.message}`,
                type: "error",
                isVisible: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">Loading profile...</div>;
    }

    return (
        <div className="max-w-xl p-6 mx-auto bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Edit Profile</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                    <input
                        type="text"
                        name="shopName"
                        value={profile.shopName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border rounded"
                        placeholder="e.g. Brin Mart"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                    <input
                        type="tel"
                        name="whatsapp"
                        value={profile.whatsapp}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border rounded"
                        placeholder="+256 7..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Business Description</label>
                    <textarea
                        name="description"
                        value={profile.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border rounded"
                        placeholder="Short business bio or what you sell"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border rounded"
                        placeholder="e.g. Nkozi Campus"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
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
