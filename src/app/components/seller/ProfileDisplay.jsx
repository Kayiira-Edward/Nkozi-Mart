// components/seller/ProfileDisplay.jsx
"use client";

import Image from "next/image";

export default function ProfileDisplay({ profile }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        {/* Profile Image Display */}
        {profile.profileImage ? (
          <div className="relative w-24 h-24 overflow-hidden rounded-full">
            <Image
              src={profile.profileImage}
              alt="Profile"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-24 h-24 text-gray-400 bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2zM7.07 18.28c.43-.91 1.77-1.47 4.93-1.47c3.16 0 4.51.56 4.93 1.47C16.92 16.91 17.5 16.14 18 15.2c-1.39-1.92-3.83-3.2-6-3.2s-4.61 1.28-6 3.2c.5.94 1.08 1.71 1.93 3.08zM12 11c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4z" />
            </svg>
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">{profile.shopName || "Shop Name"}</h2>
          <p className="text-base text-gray-500">{profile.description || "Short description"}</p>
          
          {/* Location */}
          {profile.location && (
            <div className="flex items-center mt-2 space-x-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>{profile.location}</span>
            </div>
          )}

          {/* WhatsApp Number */}
          {profile.whatsapp && (
            <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>{profile.whatsapp}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}