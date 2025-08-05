'use client';

import { useState, useEffect } from 'react';

export default function ProfileForm({ initialData, onSave }) {
  // Initialize state with data matching the seller profile structure
  const [shopName, setShopName] = useState(initialData?.shopName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '');
  // No loading or toast state here; these are handled by the parent component (SellerProfilePage)

  // Update form data if initialData changes (e.g., when switching from display to edit mode)
  useEffect(() => {
    if (initialData) {
      setShopName(initialData.shopName || '');
      setDescription(initialData.description || '');
      setWhatsapp(initialData.whatsapp || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onSave prop with the current form data
    if (onSave) {
      onSave({ shopName, description, whatsapp });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="shopName" className="block mb-1 text-sm font-medium text-gray-700">
          Shop Name
        </label>
        <input
          type="text"
          id="shopName"
          name="shopName"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
          required
        />
      </div>
      <div>
        <label htmlFor="whatsapp" className="block mb-1 text-sm font-medium text-gray-700">
          WhatsApp Number
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2edc86] focus:border-transparent transition-all"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 font-semibold text-white transition-colors bg-[#2edc86] rounded-full shadow-md hover:bg-[#25b36b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2edc86]"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
