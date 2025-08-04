// app/components/ToastNotification.jsx
"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

export default function ToastNotification({ message, type, isVisible, onDismiss }) {
  // Automatically dismisses the toast after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-auto min-w-[200px] max-w-sm px-4 py-3 rounded-xl shadow-lg border-2 z-[100] transition-all duration-300 transform
      ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
      ${typeStyles[type]}`}
    >
      <div className="flex items-center space-x-3">
        {icons[type]}
        <div className="flex-1 text-sm font-semibold">{message}</div>
        <button onClick={onDismiss} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
