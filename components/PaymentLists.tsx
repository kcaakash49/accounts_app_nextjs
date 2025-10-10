

import React from "react";
import PaymentActions from "./PaymentActions";

export default function PaymentsList({ data }: any) {
  return (
    <div className="">
      {/* Table view for medium and larger screens */}
      <div className="hidden md:block">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Customer Name</th>
              <th className="p-2 text-left">Contact</th>
              <th className="p-2 text-left">Amount Paid</th>
              <th className="p-2 text-left">Payment Method</th>
              <th className="p-2 text-left">Note</th>
              <th className="p-2 text-left">Paid At</th>
              <th className="p-2 text-left">Recorded By</th>
              <th className="p-2 text-left">Actions</th>

            </tr>
          </thead>
          <tbody>
            {data.map((payment: any, index: number) => (
              <tr key={payment.id} className="border-b dark:border-gray-700">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{payment.customer?.name}</td>
                <td className="p-2">{payment.customer?.contact}</td>
                <td className="p-2">Rs. {payment.amountPaid}</td>
                <td className="p-2">{payment.paymentMethod}</td>
                <td className="p-2">{payment.note || "—"}</td>
                <td className="p-2">{new Date(payment.paidAt).toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })}</td>
                <td className="p-2">{payment?.recordedBy?.name}</td>
                <td className="p-2">
                  <PaymentActions payment = {payment}/>
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
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Name:</strong> {payment.customer?.name}</p>
              <p><strong>Contact:</strong> {payment.customer?.contact}</p>
              <p><strong>Amount Paid:</strong> Rs. {payment.amountPaid}</p>
              <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
              <p><strong>Note:</strong> {payment.note || "—"}</p>
              <p><strong>Paid At:</strong> {new Date(payment.paidAt).toLocaleString()}</p>
              <div className="pt-2">
                <PaymentActions payment={payment}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



