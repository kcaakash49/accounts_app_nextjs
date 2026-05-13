import React from "react";
import PaymentActions from "./PaymentActions";
import Link from "next/link";

export default function PaymentsList({ data }: any) {
  return (
    <div className="w-full">
      {/* Table view for medium and larger screens */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
        <table className="w-full table-auto border-collapse text-sm text-gray-600">
          <thead>
            <tr className="border-b border-blue-50 bg-blue-50/50 font-medium text-blue-900">
            
              <th className="px-5 py-3.5 text-left">Customer Name</th>
              <th className="px-5 py-3.5 text-left">Contact</th>
              <th className="px-5 py-3.5 text-left">Amount Paid</th>
              <th className="px-5 py-3.5 text-left">Method</th>
              <th className="px-5 py-3.5 text-left hidden lg:inline-block">Paid At</th>
              <th className="px-5 py-3.5 text-left">Recorded By</th>
              <th className="px-5 py-3.5 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {data.map((payment: any, index: number) => (
              <tr key={payment.id} className="transition-colors hover:bg-blue-50/30">
              
                <td className="px-5 py-4 font-semibold text-gray-900">
                  <Link 
                    href={`/dashboard/customers/${payment.customer.id}`} 
                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                  >
                    {payment.customer.name}
                  </Link>
                </td>
                <td className="px-5 py-4 font-mono text-xs tracking-wider text-gray-500">
                  {payment.customer?.contact || "—"}
                </td>
                <td className="px-5 py-4 font-bold text-blue-600">
                  Rs. {Number(payment.amountPaid).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider">
                    {payment.paymentMethod}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap  hidden lg:inline-block">
                  {new Date(payment.paidAt).toLocaleString("en-US", {
                    timeZone: "Asia/Kathmandu",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-5 py-4 text-gray-500">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                    {payment?.recordedBy?.name || "System"}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <PaymentActions payment={payment} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked view for small screens */}
      <div className="block md:hidden space-y-4">
        {data.map((payment: any, index: number) => (
          <div
            key={payment.id}
            className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm text-sm text-gray-600 space-y-3"
          >
            {/* Mobile Header Card */}
            <div className="flex justify-between items-center pb-2 border-b border-blue-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                  #{index + 1}
                </span>
                <h2 className="font-bold text-gray-900 text-base">
                  {payment.customer?.name || "Unknown"}
                </h2>
              </div>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase">
                {payment.paymentMethod}
              </span>
            </div>

            {/* Mobile Info Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-1">
              <div>
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                  Amount Paid
                </span>
                <span className="font-bold text-blue-600 text-base">
                  Rs. {Number(payment.amountPaid).toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                  Contact
                </span>
                <span className="font-mono text-xs text-gray-700 block mt-1">
                  {payment.customer?.contact || "—"}
                </span>
              </div>

              <div className="col-span-2">
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                  Paid At
                </span>
                <span className="text-xs text-gray-700">
                  {new Date(payment.paidAt).toLocaleString("en-US", {
                    timeZone: "Asia/Kathmandu",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {payment.note && (
                <div className="col-span-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Note
                  </span>
                  <p className="text-xs text-gray-600 italic">"{payment.note}"</p>
                </div>
              )}
            </div>

            {/* Mobile Actions Footer */}
            <div className="pt-3 border-t border-blue-50 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                By: {payment?.recordedBy?.name || "System"}
              </span>
              <PaymentActions payment={payment} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}