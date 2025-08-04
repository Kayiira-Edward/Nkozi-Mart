import React from "react";
import AdminSidebar from "../components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage platform data and insights",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Sidebar and bottom nav inside AdminSidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 overflow-auto bg-gray-50 sm:p-6">
        {children}
      </main>
    </div>
  );
}
