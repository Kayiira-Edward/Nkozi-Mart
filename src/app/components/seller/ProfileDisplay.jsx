'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Import shared Firebase instances
import { db, auth } from '@/app/firebase/config';
import ToastNotification from "../ToastNotification";

export default function ProfileForm({ initialData, onSave }) {
    const [shopName, setShopName] = useState(initialData?.shopName || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [toast, setToast] = useState({ message: '', type: 'error', isVisible: false });

    // Ensure the form is pre-populated with initial data
    useEffect(() => {
        if (initialData) {
            setShopName(initialData.shopName || '');
            setDescription(initialData.description || '');
            setWhatsapp(initialData.whatsapp || '');
        }
    }, [initialData]);

    // Get the current user's ID
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setToast({ ...toast, isVisible: false });

        if (!userId) {
            setToast({ message: 'You must be logged in to update your profile.', type: 'error', isVisible: true });
            setLoading(false);
            return;
        }
        
        try {
            const sellerRef = doc(db, 'sellers', userId);
            await updateDoc(sellerRef, {
                shopName,
                description,
                whatsapp,
            });

            setToast({ message: 'Profile updated successfully!', type: 'success', isVisible: true });
            if (onSave) {
                onSave();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setToast({ message: 'Failed to update profile. Please try again.', type: 'error', isVisible: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative p-6 bg-white shadow-lg rounded-3xl">
            <h3 className="mb-4 text-2xl font-bold text-gray-800">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                    <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                    <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onDismiss={() => setToast({ ...toast, isVisible: false })}
            />
        </div>
    );
}
