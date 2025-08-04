'use client';

import { useState, useEffect } from 'react';

// This is a basic placeholder for your ProfileForm. You can expand on this.
export default function ProfileForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    storeName: '',
    phoneNumber: '',
    address: '',
    ...initialData,
  });

  useEffect(() => {
    // Update form data if initialData changes
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="storeName" className="block mb-1 text-sm font-medium text-gray-700">
          Store Name
        </label>
        <input
          type="text"
          id="storeName"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows="3"
          value={formData.address}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 font-medium text-white transition-colors bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
}
