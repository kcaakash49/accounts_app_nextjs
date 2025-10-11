

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { deletePayment } from "@/action/deletePayment";
import Modal from "./ModalComponent";
import UpdatePayment from "./UpdatePayment";
import { deleteSale } from "@/action/deleteSale";
import UpdateSales from "./UpdateSales";
import Loading from "./Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


type ActionType = {
  payment?: any;
  sale?: any;
  isSales?: boolean,
  // id: number
}

export default function PaymentActions({ payment, sale, isSales = false }: ActionType) {
  
  const [modal, showModal] = useState(false);

  const queryClient = useQueryClient();
  const saleMutation = useMutation({
    mutationFn: deleteSale,
    onSettled: (data) => {
      if (data?.success) {
        toast.success(data.message || 'Operation Success');
        queryClient.invalidateQueries({
          queryKey: ["daily-stats"]
        }),
          queryClient.invalidateQueries({
            queryKey: ["data-detail", sale?.customer?.id.toString()]
          })
      } else {
        toast.error(data?.error || "Failed!!!")
      }
    }

  })

  const paymentMutation = useMutation({
    mutationFn: deletePayment,
    onSettled: (data) => {
      if (data?.success) {
        toast.success(data.message || 'Operation Success');
        queryClient.invalidateQueries({
          queryKey: ["daily-stats"]
        }),
          queryClient.invalidateQueries({
            queryKey: ["data-detail", payment?.customer?.id.toString()]
          })
      } else {
        toast.error(data?.error || "Failed!!!")
      }
    }
  })

  const ifCanPerfromAction = () => {
    const paymentDate = !isSales ? new Date(payment.paidAt) : new Date(sale.createdAt); // Replace `createdAt` if named differently
    const now = new Date();
    const diffInMs = now.getTime() - paymentDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    if (diffInDays > 2) {
      return false;
    }

    return true;
  }

  const handleDelete = async () => {

    const ifActionCanBePerformed = ifCanPerfromAction();
    if (!ifActionCanBePerformed) {
      alert("You cannot delete payments older than 2 days.");
      return;
    }
    const confirmed = confirm(`Delete this ${isSales ? 'Sale Record ?' : "Payment ?"}`);
    if (!confirmed) return;

    isSales ? saleMutation.mutate(sale.id) : paymentMutation.mutate(payment.id);
  };

  const handleUpdate = () => {
    try {
      const ifActionCanBePerformed = ifCanPerfromAction();
      if (!ifActionCanBePerformed) {
        alert("You cannot Update payments older than 2 days.");
        return;
      }
      showModal(true);
    } catch (e) {
      showModal(false);
    }
  };

  if (saleMutation.isPending || paymentMutation.isPending) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  return (
    <div className="flex space-x-4">
      {/* Edit Button (Pencil Icon) */}
      <button
        disabled={saleMutation.isPending || paymentMutation.isPending}
        onClick={handleUpdate}
        className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-200"
      >
        <Edit
          size={20}
          className="shadow-lg hover:shadow-xl active:scale-95 transform-gpu transition-all duration-200"
        />
      </button>

      {/* Delete Button (Trash Icon) */}
      <button
        onClick={handleDelete}
        disabled={saleMutation.isPending || paymentMutation.isPending}
        className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-200"
      >
        <Trash2
          size={20}
          className="shadow-lg hover:shadow-xl active:scale-95 transform-gpu transition-all duration-200"
        />
      </button>

      <Modal isOpen={modal} onClose={() => showModal(false)}>
        {
          isSales ? (
            <div className="bg-red-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Update Sale</h2>
              <UpdateSales sale={sale} onClose={() => showModal(false)} />

            </div>

          ) : (
            <div className="bg-red-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Update Payment</h2>
              <UpdatePayment payment={payment} onClose={() => showModal(false)} />

            </div>

          )

        }
      </Modal>
    </div>
  );
}
