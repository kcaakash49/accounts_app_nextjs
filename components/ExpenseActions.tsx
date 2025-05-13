



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

  const handleDelete = async () => {
    const ifActionCanBePerformed = ifCanPerfromAction();
    if (!ifActionCanBePerformed) {
        alert("You cannot delete expenses older than 2 days!!!")
        return;
    }

    const confirmed = confirm("Delete this expense record?");
    if (!confirmed) return;

    try {
        setLoading(true);
        const res = await deleteExpense(expense.id);
        alert(res.success ? res.message : "Operation Failed!!!")
    }catch(e){
        alert("Failed to Delete.!!!");
    }finally {
      setLoading(false);
    }
  

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

  if(loading){
    return (
      <div className="flex items-center justify-center"><Loading/></div>
    )
  }

  return (
    <div className="flex space-x-4">
      {/* Edit Button (Pencil Icon) */}
      <button
        onClick={handleUpdate}
        disabled={loading}
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
        disabled={loading}
      >
        <Trash2
          size={20}
          className="shadow-lg hover:shadow-xl active:scale-95 transform-gpu transition-all duration-200"
        />
      </button>

      <Modal isOpen={modal} onClose={() => showModal(false)}>
        {
          
          <div className="bg-amber-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Update Expense</h2>
                <UpdateExpense expense={expense}/>
  
          </div>
  
        
          

        }
      </Modal>
    </div>
  );
}
