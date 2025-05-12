"use client";

import { getCustomerbyId } from "@/action/getCustomerbyId";
import AddSalesForm from "@/components/AddSales";
import AddPayment from "@/components/AddPayment";
import Modal from "@/components/ModalComponent";
import SignUp from "@/components/SignUp";
import TransactionLog from "@/components/TransactionLogs";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AddFollowUp from "@/components/AddFollowUp";



export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isPayment, setIsPayement] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {

      try {
        const res: any = await getCustomerbyId(Number(id));

        if (res?.message && res?.user) {
          setUser(res.user);
          setError(null);



        } else if (res?.error) {
          setError(res.error);

        }
      } catch (e) {
        console.error("failed to fetch data", e);
        setError("Failed to fetch user data");

      } finally {
        setLoading(false)
      }
    };

    if (!isNaN(Number(id))) {
      fetchUser();
    }
  }, [id, refreshKey]);

  const totalSales = useMemo(() => {
    if (!user) return 0;

    return user?.sales.reduce((sum: number, sale: any) => {
      return sum + parseFloat(sale.amount || "0");
    }, 0) || 0;
  }, [user?.sales]);

  const totalPayment = useMemo(() => {
    if (!user) return 0;
    return user?.payments.reduce((sum: number, payment: any) => {
      return sum + parseFloat(payment.amountPaid || "0");
    }, 0) || 0;
  }, [user?.payments]);

  const remainingDue = useMemo(() => {
    if (!user) return 0;
    return totalSales - totalPayment;
  }, [totalSales, totalPayment]);

  const logs = useMemo(() => {
    if (!user) return [];

    const salesLogs = user.sales?.map((sale: any) => ({
      type: "sale" as const,
      amount: parseFloat(sale.amount || "0"),
      date: new Date(sale.createdAt),
      description: sale.note || "",
    })) || [];

    const paymentLogs = user.payments?.map((payment: any) => ({
      type: "payment" as const,
      amount: parseFloat(payment.amountPaid || "0"),
      date: new Date(payment.paidAt),
      description: payment.note || "",
    })) || [];

    return [...salesLogs, ...paymentLogs].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [user?.sales, user?.payments]);


  if (error) {
    return <div className="p-6 text-red-600 h-full flex items-center justify-center">{error}</div>;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse p-6 md:p-10">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-20 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="p-6 text-red-600 h-full flex items-center justify-center">
        No User Found
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

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                setIsPayement(false);
                setShowModal(true);
                setIsFollowUp(false);
              }}
              className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md text-sm"
            >
              Add Sales
            </button>
            <button
              onClick={() => {
                setIsPayement(true);
                setShowModal(true);
                setIsFollowUp(false);
              }}
              className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Add Payment
            </button>
            <button
              onClick={() => {
                setIsPayement(false);
                setIsFollowUp(true);
                setShowModal(true);
              }}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Add FollowUp
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="text-xl font-semibold text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Contact</p>
            <p className="text-lg font-medium text-gray-800">{user.contact}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Address</p>
            <p className="text-lg text-gray-800">{user.address || "Not Provided"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Customer Since</p>
            <p className="text-lg text-gray-800">
              {new Date(user.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p>Total Sales </p>
            <p>{totalSales.toFixed(2)}</p>
          </div>
          <div>
            <p>Total payment</p>
            <p>{totalPayment.toFixed(2)}</p>
          </div>
          <div>
            <p>Remaining Dues</p>
            <p>{remainingDue.toFixed(2)}</p>
          </div>
          {
            user?.dueDate && <div>
              <p>Follow Up</p>
              <p>{user?.dueDate.toLocaleDateString()}</p>
            </div>
          }

        </div>
      </section>

      <TransactionLog logs={logs} />

      {/* Add Due Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {
          isPayment ? (
            <div className="bg-green-200 p-6 rounded-lg">

              <h2 className="text-xl font-semibold mb-4">Add Payment for {user.name}</h2>
              <AddPayment userID={user.id} setRefreshKey={() => setRefreshKey(prev => !prev)} />
            </div>
          ) : (
            isFollowUp ? (
              <div className="bg-yellow-200 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Add Followup for {user.name}</h2>
                <AddFollowUp userId={user.id} setRefreshKey={() => setRefreshKey(prev => !prev)} />

              </div>


            ) : (

              <div className="bg-red-200 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Add Sales for {user.name}</h2>
                <AddSalesForm userID={user.id} setRefreshKey={() => setRefreshKey(prev => !prev)} />

              </div>
            )

          )
        }

      </Modal>
    </main>
  );
}
