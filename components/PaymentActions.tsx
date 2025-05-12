

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { deletePayment } from "@/action/deletePayment";
import Modal from "./ModalComponent";
import UpdatePayment from "./UpdatePayment";
import { deleteSale } from "@/action/deleteSale";
import UpdateSales from "./UpdateSales";


type ActionType = {
  payment?: any;
  sale?: any;
  isSales?: boolean,
  // id: number
}

export default function PaymentActions({ payment, sale, isSales = false }: ActionType) {
  const router = useRouter();
  const [modal, showModal] = useState(false);

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

    const res = isSales ? await deleteSale(sale.id) : await deletePayment(payment.id);
    alert(res.success ? res.message : "Failed to Delete");

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

  return (
    <div className="flex space-x-4">
      {/* Edit Button (Pencil Icon) */}
      <button
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
            <UpdateSales sale={sale} />
  
          </div>
  
          ): (
          <div className="bg-red-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Update Payment</h2>
            <UpdatePayment payment={payment} />
  
          </div>
  
          )

        }
      </Modal>
    </div>
  );
}
