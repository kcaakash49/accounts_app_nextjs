

import React from "react";

type LogEntry = {
  type: "sale" | "payment";
  amount: number;
  date: Date;
  description?: string;
};

type Props = {
  logs: LogEntry[];
};

const TransactionLog: React.FC<Props> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <section className="w-full mt-10 bg-white rounded-xl shadow-md p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction Logs</h2>
        <p className="text-gray-500">No logs available.</p>
      </section>
    );
  }

  return (
    <section className="w-full mt-10 bg-white rounded-xl shadow-md p-6 md:p-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction Logs</h2>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`border-l-4 pl-4 py-2 ${log.type === "sale" ? "border-red-500" : "border-green-500"
              }`}
          >
            <p className="text-sm text-gray-500">
              {log.date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            <p className="text-md font-medium">
              {log.type === "sale" ? "Sales Added" : "Payment Received"} -
              Rs. {log.amount.toFixed(2)}
            </p>
            {log.description && (
              <p className="text-gray-600 text-sm italic">{log.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TransactionLog;
