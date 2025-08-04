"use client";

import { useState, useEffect } from "react";

export default function ProfileEditor() {
  const [profile, setProfile] = useState({
    shopName: "",
    whatsapp: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sellerProfile"));
    if (saved) setProfile(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("sellerProfile", JSON.stringify(profile));
    alert("Profile updated!");
  };

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
            type="text"
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
          className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

