



"use client";

import React, { useState } from "react";

import { Edit, Trash2 } from "lucide-react";

import Modal from "./ModalComponent";
import { User } from "@/app/dashboard/customers/page";
import { deleteCustomer } from "@/action/deleteCustomer";
import Loading from "./Loading";
import UpdateCustomer from "./UpdateCustomer";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



export default function CustomerActions({customer}: any) {
  
  const [modal, showModal] = useState(false);
  const[loading,setLoading] = useState(false);

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (result) => {
      toast.success(result.message || "User Deleted Successfully !!!")
      router.replace("/dashboard/customers")
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't delete Customer!!!");
    }
  })

  

  const handleDelete = async () => {
    const isConfirmed = confirm("Do you really want to delete the customer record?");
    if(!isConfirmed) return;
    mutate(customer.id);

  };

  const handleUpdate = () => {
    try{
      showModal(true);
    }catch(e){
      showModal(false);
      toast.error("Couldn't open update page!!!")
    }
  };

  if (isPending){
    return (
      <div><Loading/></div>
    )
  }

  return (
    <div className="flex space-x-4">
      {/* Edit Button (Pencil Icon) */}
      <button
        onClick={handleUpdate}
        className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-200"
        disabled={loading}
      >
        <Edit
          size={20}
          className="shadow-lg hover:shadow-xl active:scale-95 transform-gpu transition-all duration-200"
        />
      </button>

      {/* Delete Button (Trash Icon) */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-200"
      >
        <Trash2
          size={20}
          className="shadow-lg hover:shadow-xl active:scale-95 transform-gpu transition-all duration-200"
        />
      </button>

      <Modal isOpen={modal} onClose={() => showModal(false)}>
        {
          
          <div className="bg-amber-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Update Customer</h2>
                <UpdateCustomer customer={customer} onClose={() => showModal(false)}/>
  
          </div>
        }
      </Modal>
    </div>
  );
}
