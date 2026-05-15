

import { Download } from "lucide-react";
import React from "react";

type LogEntry = {
  type: "sale" | "payment";
  amount: number;
  date: Date;
  description?: string;
};

type Props = {
  logs: LogEntry[];
  userName:string;
};

const downloadCSV = (data: LogEntry[], userName: string) => {
  // 1. Define Headers
  const headers = ["Date", "Type", "Amount (Rs.)", "Description"];

  // 2. Format Rows
  const rows = data.map((log) => [
    // Format date as YYYY-MM-DD HH:mm
    log.date.toLocaleString("en-GB").replace(",", ""),
    log.type === "sale" ? "Sales" : "Payment",
    log.amount.toFixed(2),
    // Wrap description in quotes to handle internal commas
    `"${log.description?.replace(/"/g, '""') || ""}"`,
  ]);

  // 3. Combine into String
  const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

  // 4. Create Download Link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `Transactions_${userName}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const TransactionLog: React.FC<Props> = ({ logs, userName }) => {
  if (!logs || logs.length === 0) {
    return (
      <section className="w-full mt-10 bg-white rounded-xl shadow-md p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction Logs</h2>
        <p className="text-gray-500">No logs available.</p>
      </section>
    );
  }

  return (
    // <section className="w-full mt-10 bg-white rounded-xl shadow-md p-6 md:p-10">
    //   <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction Logs</h2>
    //   <div className="space-y-4">
    //     {logs.map((log, index) => (
    //       <div
    //         key={index}
    //         className={`border-l-4 pl-4 py-2 ${log.type === "sale" ? "border-red-500" : "border-green-500"
    //           }`}
    //       >
    //         <p className="text-sm text-gray-500">
    //           {log.date.toLocaleDateString("en-GB", {
    //             day: "2-digit",
    //             month: "short",
    //             year: "numeric",
    //             hour: "2-digit",
    //             minute: "2-digit",
    //             hour12: true,
    //           })}
    //         </p>
    //         <p className="text-md font-medium">
    //           {log.type === "sale" ? "Sales Added" : "Payment Received"} -
    //           Rs. {log.amount.toFixed(2)}
    //         </p>
    //         {log.description && (
    //           <p className="text-gray-600 text-sm italic">{log.description}</p>
    //         )}
    //       </div>
    //     ))}
    //   </div>
    // </section>
    <section className="w-full mt-10 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900 pr-12">Transaction Logs</h2>
          <p className="text-xs text-slate-500 font-medium">History of sales and payments</p>
        </div>
        
        <button
          onClick={() => downloadCSV(logs, userName)}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-blue-600" />
          Export CSV
        </button>
      </div>

      <div className="p-6 space-y-4">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`group border-l-4 pl-4 py-3 rounded-r-xl transition-colors ${
              log.type === "sale" 
                ? "border-rose-500 bg-rose-50/30 hover:bg-rose-50/60" 
                : "border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {log.date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {log.type === "sale" ? "Sales Invoice" : "Payment Received"}
                </p>
              </div>
              <p className={`font-black text-sm ${log.type === "sale" ? "text-rose-600" : "text-emerald-600"}`}>
                {log.type === "sale" ? "-" : "+"} Rs. {log.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            {log.description && (
              <p className="text-slate-500 text-xs mt-1 border-t border-slate-100/50 pt-1">
                <span className="font-semibold opacity-70">Note:</span> {log.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
    
  );
};

export default TransactionLog;
