'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Edit } from "lucide-react";

// Import shared Firebase instances
import { auth, db } from "@/app/firebase/config";
import ProfileDisplay from "@/app/components/seller/ProfileDisplay";
import ProfileForm from "@/app/components/seller/ProfileForm";

export default function SellerProfilePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                router.push("/auth/login");
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
        });

        return () => unsubscribeFirestore();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
                Loading profile...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[#F0F2F5]">
                <h1 className="mb-4 text-3xl font-bold text-gray-800">No Profile Found</h1>
                <p className="mb-6 text-center text-gray-600">
                    Please ensure you are registered as a seller.
                </p>
                <button
                    onClick={() => router.push("/auth/register")}
                    className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-colors bg-purple-500 rounded-full shadow-md hover:bg-purple-600"
                >
                    Create Seller Profile
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#F0F2F5] min-h-screen font-sans p-4 sm:p-8 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="relative p-6 bg-white shadow-lg rounded-3xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-800">Seller Profile</h1>
                    
                    {/* Edit button */}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="absolute p-2 transition-colors bg-gray-100 rounded-full top-6 right-6 hover:bg-gray-200"
                        aria-label="Toggle edit mode"
                    >
                        <Edit size={20} className="text-gray-600" />
                    </button>
                    
                    {isEditing ? (
                        <ProfileForm 
                            initialData={profile} 
                            onSave={() => setIsEditing(false)} 
                        />
                    ) : (
                        <ProfileDisplay profile={profile} />
                    )}
                </div>
            </div>
        </div>
    );
}
