"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TotalTypes {
  sales: number;
  payment: number;
  expense: number;
}

export default function TodaySummary({ totals }: { totals: TotalTypes }) {
  const data = [
    { name: "Sales", amount: totals.sales },
    { name: "Payments", amount: totals.payment },
    { name: "Expenses", amount: totals.expense },
  ];

  return (
    <div className="w-full h-80 bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Today’s Summary
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#555" }} />
          <YAxis tick={{ fill: "#555" }} />
          <Tooltip
            formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Amount"]}
            contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "0.5rem" }}
          />
          <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
