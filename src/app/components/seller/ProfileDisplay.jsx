'use client';

import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon

/**
 * Displays the seller's profile details.
 * @param {object} profile - The seller's profile object.
 * @param {number} productCount - The total number of products the seller has.
 */
export default function ProfileDisplay({ profile, productCount = 0 }) {
    // This console.log will show you the value of productCount being passed in.
    // It will likely be 0 until a parent component fetches the real count from Firestore.
    console.log("ProfileDisplay received productCount:", productCount);

    if (!profile) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white border-2 border-gray-300 border-dashed shadow-md rounded-xl">
                <p>No profile data available to display.</p>
            </div>
        );
    }

    // Construct WhatsApp URL
    const whatsappUrl = profile.whatsapp 
        ? `https://wa.me/${profile.whatsapp.replace("+", "")}`
        : null;

    return (
        <div className="p-6 bg-white rounded-3xl"> {/* Consistent card styling */}
            <h3 className="mb-4 text-2xl font-bold text-gray-800">My Shop Details</h3> {/* Consistent text color */}
            
            <div className="flex items-center mb-6 space-x-4">
                {/* Placeholder for seller avatar, matching the homepage product card seller avatar */}
                <Image
                    src={profile.profileImage || "/assets/images/seller-placeholder.png"} // Use actual profile image if available
                    alt={`${profile.storeName} Avatar`}
                    width={64} // Slightly larger for profile display
                    height={64}
                    className="rounded-full border-2 border-[#2edc86] shadow-sm" // Green border and subtle shadow
                />
                <div>
                    <p className="text-xl font-semibold text-gray-900">{profile.storeName}</p>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                </div>
            </div>

            <div className="space-y-3 text-gray-700">
                <p>
                    <span className="font-medium text-gray-800">Description:</span> {profile.description || 'No description provided.'}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Location:</span> {profile.location || 'Not provided.'}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Products Listed:</span> {productCount}
                </p>
                <p>
                    <span className="font-medium text-gray-800">WhatsApp:</span> {profile.whatsapp || 'Not provided'}
                    {whatsappUrl && (
                        <a 
                            href={whatsappUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="ml-2 text-green-500 transition-colors hover:text-green-600"
                            aria-label="Chat on WhatsApp"
                        >
                            <FaWhatsapp className="inline-block text-xl" />
                        </a>
                    )}
                </p>
                {/* Add other profile details here as needed, e.g., social links */}
            </div>
        </div>
    );
}
