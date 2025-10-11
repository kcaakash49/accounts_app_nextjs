



"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";

import Modal from "./ModalComponent";

import UpdateSales from "./UpdateSales";
import { ExpenseType } from "@/types/expense";
import { deleteExpense } from "@/action/deleteExpense";
import UpdateExpense from "./UpdateExpense";
import Loading from "./Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export default function ExpenseActions({expense}: {expense: ExpenseType}) {
  
  const [modal, showModal] = useState(false);
  const [loading,setLoading] = useState(false);
  

  const ifCanPerfromAction = () => {
    const paymentDate = new Date(expense.createdAt); // Replace `createdAt` if named differently
    const now = new Date();
    const diffInMs = now.getTime() - paymentDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    if (diffInDays > 2) {
      return false;
    }

    return true;
  }

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteExpense,
    onSettled: (data) => {
      if (data?.success){
        toast.success(data.message || "Success!!!")
        queryClient.invalidateQueries({
          queryKey: ["daily-stats"]
        })
      }else {
        toast.error(data?.error || "Delete Operation Failed!!")
      }
    }
  })
  const handleDelete = async () => {
    const ifActionCanBePerformed = ifCanPerfromAction();
    if (!ifActionCanBePerformed) {
        alert("You cannot delete expenses older than 2 days!!!")
        return;
    }

    const confirmed = confirm("Delete this expense record?");
    if (!confirmed) return;
    mutate(expense.id);
  

  };

  const handleUpdate = () => {
    try {
      const ifActionCanBePerformed = ifCanPerfromAction();
      if (!ifActionCanBePerformed) {
        alert("You cannot Update expenses older than 2 days.");
        return;
      }
      showModal(true);
    } catch (e) {
      showModal(false);
    }
  };

  if(isPending){
    return (
      <div className="flex items-center justify-center"><Loading/></div>
    )
  }

  return (
    <div className="flex space-x-4">
      {/* Edit Button (Pencil Icon) */}
      <button
        onClick={handleUpdate}
        disabled={isPending}
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
        disabled={isPending}
      >
        <Trash2
          size={20}
          className="shadow-lg hover:shadow-xl active:scale-95 transform-gpu transition-all duration-200"
        />
      </button>

      <Modal isOpen={modal} onClose={() => showModal(false)}>
        {
          
          <div className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Update Expense</h2>
                <UpdateExpense expense={expense} onClose={() => showModal(false)}/>
  
          </div>
  
        
          

        }
      </Modal>
    </div>
  );
}
