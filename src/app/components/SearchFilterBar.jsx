"use client";
import { useState } from "react";

const categories = ["Phones", "Clothes", "Electronics", "Shoes", "Groceries", "Others"];

export default function SearchFilterBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="w-full bg-gray-100 px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Category buttons - hidden on small screens */}
        <div className="hidden md:flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-green-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input - always visible */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products, color, categories..."
          className="flex-1 min-w-[200px] px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
}
