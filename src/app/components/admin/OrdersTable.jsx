// orders
"use client";

import React, { useState } from "react";

export default function OrdersTable({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const confirmDelete = (id) => setDeleteCandidate(id);
  const cancelDelete = () => setDeleteCandidate(null);

  const handleDelete = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
    setDeleteCandidate(null);
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm border-separate border-spacing-y-2 sm:text-base">
        <thead>
          <tr className="bg-[#e8f5e9] text-[#1e8449]">
            <th className="px-4 py-2 text-left rounded-l-lg whitespace-nowrap">Order ID</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Customer</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Date</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Total</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
            <th className="px-4 py-2 text-left rounded-r-lg whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, customer, date, total, status }) => (
            <React.Fragment key={id}>
              <tr className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.05)]">
                <td className="px-4 py-2 rounded-l-lg whitespace-nowrap">{id}</td>
                <td className="px-4 py-2 whitespace-nowrap">{customer}</td>
                <td className="px-4 py-2 whitespace-nowrap">{date}</td>
                <td className="px-4 py-2 whitespace-nowrap">{total}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      status === "Delivered"
                        ? "bg-[#e8f5e9] text-[#1e8449]"
                        : "bg-[#fffde7] text-[#fbc02d]"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-4 py-2 rounded-r-lg whitespace-nowrap">
                  <button
                    onClick={() => confirmDelete(id)}
                    className="text-[#e57373] hover:text-[#c62828]"
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {deleteCandidate === id && (
                <tr>
                  <td colSpan="6" className="py-2">
                    <div className="flex items-center justify-between p-4 my-2 text-red-800 transition-colors duration-200 border border-red-300 rounded-lg bg-red-50">
                      <span>
                        Are you sure you want to delete order <strong>{id}</strong>?
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleDelete(id)}
                          className="px-4 py-2 text-white transition-colors duration-200 bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-4 py-2 text-red-700 transition-colors duration-200 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
