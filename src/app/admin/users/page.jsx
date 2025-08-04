import React from "react";
import UsersTable from "../../components/admin/UsersTable";

export const metadata = {
  title: "Admin Users",
  description: "Manage platform users",
};

export default function UsersPage() {
  const users = [
    { id: "U001", name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: "U002", name: "Alice Kim", email: "alice@example.com", role: "Seller" },
    { id: "U003", name: "Brian Opio", email: "brian@example.com", role: "Customer" },
  ];

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Users</h1>
      <UsersTable users={users} />
    </main>
  );
}
