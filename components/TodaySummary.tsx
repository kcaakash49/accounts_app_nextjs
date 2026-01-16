"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

  const colors = ["#6366f1", "#10b981", "#ef4444"]; // Indigo, Green, Red

  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Today's Overview
      </h2>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 13 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 13 }}
              tickFormatter={(v) => `Rs ${v}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: number | undefined) => [
                `Rs. ${value ? value.toLocaleString() : 0}`,
                "Amount"
              ]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            />

            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-around mt-6">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-sm text-gray-500">{item.name}</p>
            <p className="text-lg font-semibold" style={{ color: colors[index] }}>
              Rs. {item.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}