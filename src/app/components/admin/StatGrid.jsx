"use client";

import React, { useState } from "react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

const statsData = [
  { id: 1, title: "Total Sales", value: 12345, icon: "💰", trend: 12 },
  { id: 2, title: "Orders", value: 1234, icon: "📦", trend: 8 },
  { id: 3, title: "New Users", value: 345, icon: "👤", trend: -2 },
  { id: 4, title: "Revenue", value: 23456, icon: "📈", trend: 5 },
];

export default function StatGrid() {
  const [query, setQuery] = useState("");

  const filteredStats = statsData.filter((stat) =>
    stat.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* Search Input for Stats */}
      <input
        type="text"
        placeholder="Search stats..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 text-sm transition-all duration-200 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
      />

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredStats.map(({ id, title, value, icon, trend }) => (
          <div key={id} className="flex flex-col justify-between p-4 bg-white shadow-md rounded-2xl">
            {/* Top section with icon and trend */}
            <div className="flex items-center justify-between">
              <div className="text-2xl">{icon}</div>
              <div className={`text-sm font-semibold ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
                {trend >= 0 ? `+${trend}%` : `${trend}%`}
              </div>
            </div>

            {/* Middle section with title and value */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-xl font-bold text-gray-800">
                {title.includes("Revenue") || title.includes("Sales") ? "UGX " : ""}
                {value.toLocaleString()}
              </p>
            </div>

            {/* Bottom section with a small chart */}
            <div className="h-[50px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ value }]}>
                  <Bar dataKey="value" fill={trend >= 0 ? "#22c55e" : "#ef4444"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
