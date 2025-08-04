// app/components/admin/StatCard.jsx
"use client";

import { cn } from "@/lib/utils";
import React from "react"; // Added React import for clarity

export default function StatCard({ title, value, icon, className }) {
  return (
    <div className={cn("bg-white rounded-2xl shadow p-4 flex items-center space-x-4", className)}>
      <div className="text-3xl text-blue-600">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
