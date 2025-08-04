"use client";
import React, { useState } from "react";

export default function ProductsTable({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Function to set the product ID for the confirmation prompt
  const confirmDelete = (id) => setDeleteCandidate(id);

  // Function to cancel the delete action
  const cancelDelete = () => setDeleteCandidate(null);

  // Function to handle the actual deletion from the local state
  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    setDeleteCandidate(null);
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm border-separate border-spacing-y-2 sm:text-base">
        <thead>
          <tr className="bg-[#e8f5e9] text-[#1e8449]">
            <th className="px-4 py-2 text-left rounded-l-lg whitespace-nowrap">ID</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Name</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Price</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Stock</th>
            <th className="px-4 py-2 text-left whitespace-nowrap">Category</th>
            <th className="px-4 py-2 text-left rounded-r-lg whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(({ id, name, price, stock, category }) => (
            <React.Fragment key={id}>
              <tr className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.05)]">
                <td className="px-4 py-2 rounded-l-lg whitespace-nowrap">{id}</td>
                <td className="px-4 py-2 whitespace-nowrap">{name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{price}</td>
                <td className="px-4 py-2 whitespace-nowrap">{stock}</td>
                <td className="px-4 py-2 whitespace-nowrap">{category}</td>
                <td className="px-4 py-2 rounded-r-lg whitespace-nowrap">
                  <button
                    onClick={() => confirmDelete(id)}
                    className="text-[#e57373] hover:text-[#c62828]"
                    aria-label={`Delete product ${name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {deleteCandidate === id && (
                <tr>
                  <td colSpan="6" className="py-2">
                    <div className="flex flex-col gap-2 p-4 my-2 text-red-700 border border-red-300 rounded-lg sm:flex-row sm:items-center sm:justify-between bg-red-50">
                      <span>
                        Are you sure you want to delete product <strong>{name}</strong>?
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(id)}
                          className="px-4 py-2 text-white bg-red-600 rounded-full hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
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
