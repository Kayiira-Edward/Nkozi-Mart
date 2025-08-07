import React from 'react';

// This is a simple, reusable loading spinner component.
// It uses Tailwind CSS for styling.
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-75">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-[#2edc86] rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
