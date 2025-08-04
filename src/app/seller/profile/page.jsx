// seller/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import ProfileDisplay from "../../components/seller/ProfileDisplay";
import ToastNotification from "../../components/ToastNotification";

export default function SellerProfilePage() {
  const [profile, setProfile] = useState({
    shopName: "",
    whatsapp: "",
    description: "",
    location: "",
    profileImage: "", // Added to match the ProfileDisplay component
  });
  const [isEditing, setIsEditing] = useState(false);

  // State for managing the toast notification
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Load profile from local storage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sellerProfile"));
    if (saved) {
      setProfile(saved);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("sellerProfile", JSON.stringify(profile));
    setIsEditing(false);

    // Show success toast notification instead of a browser alert
    setToast({
      message: "Profile updated successfully!",
      type: "success",
      isVisible: true,
    });
  };
  
  const handleCancel = () => {
    // Reset to saved state on cancel
    const saved = JSON.parse(localStorage.getItem("sellerProfile"));
    if (saved) {
      setProfile(saved);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50">
      <div className="w-full max-w-sm p-6 mx-auto bg-white shadow-lg rounded-3xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">Your Profile</h1>
        
        {!isEditing ? (
          // Display Mode
          <div className="space-y-6">
            <ProfileDisplay profile={profile} />
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 bg-green-500 rounded-full shadow-md hover:bg-green-600"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Shop Name</label>
              <input
                name="shopName"
                value={profile.shopName}
                onChange={handleChange}
                className="w-full p-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="e.g. Brin Store"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">WhatsApp Number</label>
              <input
                name="whatsapp"
                value={profile.whatsapp}
                onChange={handleChange}
                className="w-full p-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="e.g. +2567XXXXXXXX"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Short Description</label>
              <textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                className="w-full p-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                rows={3}
                placeholder="What do you sell?"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Location</label>
              <input
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="w-full p-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="e.g. Nkozi Trading Centre"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Profile Image URL</label>
              <input
                name="profileImage"
                value={profile.profileImage}
                onChange={handleChange}
                className="w-full p-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Paste an image link"
              />
            </div>
            <div className="flex justify-between mt-8 space-x-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 font-semibold text-white transition-colors duration-200 bg-green-500 rounded-full hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render the Toast Notification component */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
