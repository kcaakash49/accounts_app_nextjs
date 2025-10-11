

import React from "react";
import PaymentActions from "./PaymentActions";

export default function PaymentsList({ data }: any) {

  return (
    <div className="">
      {/* Table view for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Customer Name</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Amount Paid</th>
              <th className="px-4 py-2 border">Payment Method</th>
              <th className="px-4 py-2 border">Note</th>
              <th className="px-4 py-2 border">Paid At</th>
              <th className="px-4 py-2 border">Recorded By</th>
              <th className="px-4 py-2 border">Actions</th>

            </tr>
          </thead>
          <tbody>
            {data.map((payment: any, index: number) => (
              <tr key={payment.id} className="border-t">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{payment.customer?.name}</td>
                <td className="p-2 border">{payment.customer?.contact}</td>
                <td className="p-2 border">Rs. {payment.amountPaid}</td>
                <td className="p-2 border">{payment.paymentMethod}</td>
                <td className="p-2 border">
                  {payment.note && payment.note.length > 20
                    ? payment.note.slice(0, 20) + "..."
                    : payment.note || "—"}
                </td>
                <td className="p-2 border">{new Date(payment.paidAt).toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })}</td>
                <td className="p-2 border">{payment?.recordedBy?.name}</td>
                <td className="p-2 border">
                  <PaymentActions payment={payment} />
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked view for small screens */}
      <div className="block md:hidden space-y-4 p-2">
        {data.map((payment: any) => (
          <div
            key={payment.id}
            className="rounded-2xl shadow-md p-4 bg-white dark:bg-gray-900"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{payment.customer?.name}</h2>

            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 overflow-auto">
              <p><strong>Name:</strong> {payment.customer?.name}</p>
              <p><strong>Contact:</strong> {payment.customer?.contact}</p>
              <p><strong>Amount Paid:</strong> Rs. {payment.amountPaid}</p>
              <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
              <p><strong>Note: </strong>
                {payment.note && payment.note.length > 20
                  ? payment.note.slice(0, 20) + "..."
                  : payment.note || "—"}
              </p>
              <p><strong>Paid At:</strong> {new Date(payment.paidAt).toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })}</p>
              <div className="pt-2">
                <PaymentActions payment={payment} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



