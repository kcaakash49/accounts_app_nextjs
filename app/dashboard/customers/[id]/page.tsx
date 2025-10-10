"use client";

import { getCustomerbyId } from "@/action/getCustomerbyId";
import AddSalesForm from "@/components/AddSales";
import AddPayment from "@/components/AddPayment";
import Modal from "@/components/ModalComponent";
import TransactionLog from "@/components/TransactionLogs";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import AddFollowUp from "@/components/AddFollowUp";
import { useQuery } from "@tanstack/react-query";
import CustomerActions from "@/components/CustomerActions";
import CustomerLoading from "@/components/CustomerLaoding";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["data-detail", id],
    queryFn: async () => {
      const res = await getCustomerbyId(Number(id));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const user = data?.user;
  const totalSales = data?.totals?.totalSales ?? 0;
  const totalPayment = data?.totals?.totalPayment ?? 0;
  const remainingDue = data?.totals?.remainingDue ?? 0;

  const logs = useMemo(() => {
    if (!data) return [];
    const salesLogs =
      user?.sales?.map((sale: any) => ({
        type: "sale" as const,
        amount: parseFloat(sale.amount || "0"),
        date: new Date(sale.createdAt),
        description: sale.note || "",
      })) || [];

    const paymentLogs =
      user?.payments?.map((payment: any) => ({
        type: "payment" as const,
        amount: parseFloat(payment.amountPaid || "0"),
        date: new Date(payment.paidAt),
        description: payment.note || "",
      })) || [];

    return [...salesLogs, ...paymentLogs].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }, [user?.sales, user?.payments]);

  if (isLoading) {
    return (
      <CustomerLoading />
    );
  }

  if (isError || !data) {
    return (
      <div className="p-10 flex items-center justify-center text-red-600 text-lg">
        No data found
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <section className="w-full bg-white rounded-xl shadow-md p-6 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Customer Details
          </h1>

          {/* Dropdown for Actions */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all flex items-center gap-2"
            >
              Add Action
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transform transition-transform ${dropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  onClick={() => {
                    setIsPayment(false);
                    setIsFollowUp(false);
                    setShowModal(true);
                    setDropdownOpen(false);
                  }}
                >
                  Add Sales
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-green-100 text-green-600"
                  onClick={() => {
                    setIsPayment(true);
                    setIsFollowUp(false);
                    setShowModal(true);
                    setDropdownOpen(false);
                  }}
                >
                  Add Payment
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-600"
                  onClick={() => {
                    setIsFollowUp(true);
                    setIsPayment(false);
                    setShowModal(true);
                    setDropdownOpen(false);
                  }}
                >
                  Add FollowUp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customer info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="text-xl font-semibold text-gray-900">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Contact</p>
            <p className="text-lg font-medium text-gray-800">{user?.contact}</p>
          </div>
          {user?.secondContact && (
            <div>
              <p className="text-gray-500 text-sm">Secondary Contact</p>
              <p className="text-lg font-medium text-gray-800">
                {user?.secondContact}
              </p>
            </div>
          )}
          <div>
            <p className="text-gray-500 text-sm">Address</p>
            <p className="text-lg text-gray-800">
              {user?.address || "Not Provided"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Customer Since</p>
            <p className="text-lg text-gray-800">
              {user?.createdAt ? (
                new Date(user.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              ) : (
                "N/A"
              )}
            </p>
          </div>
          <div>
            <p>Total Sales </p>
            <p>{totalSales.toFixed(2)}</p>
          </div>
          <div>
            <p>Total Payment</p>
            <p>{totalPayment.toFixed(2)}</p>
          </div>
          <div>
            <p>Remaining Dues</p>
            <p>{remainingDue.toFixed(2)}</p>
          </div>
          {user?.dueDate && (
            <div>
              <p>Follow Up</p>
              <p>{user?.dueDate.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
            </div>
          )}<div>
            <p className="pb-2 font-bold">Edit User</p>
            <CustomerActions customer={data} />
          </div>
        </div>
      </section>

      <TransactionLog logs={logs} />

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {isPayment ? (
          <div className="bg-green-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Add Payment for {user?.name}
            </h2>
            {user?.id && (
              <AddPayment userID={user.id} onClose={() => setShowModal(false)} />
            )}

          </div>
        ) : isFollowUp ? (
          <div className="bg-yellow-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Add FollowUp for {user?.name}
            </h2>
            {user?.id && (
              <AddFollowUp userId={user.id} onClose={() => setShowModal(false)} />
            )}

          </div>
        ) : (
          <div className="bg-red-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Add Sales for {user?.name!}
            </h2>
            {user?.id && (
              <AddSalesForm userID={user.id} onClose={() => setShowModal(false)} />
            )}

          </div>
        )}
      </Modal>
    </main>
  );
}
