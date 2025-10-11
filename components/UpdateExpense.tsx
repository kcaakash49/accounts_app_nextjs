
"use client"

import { ExpenseType } from "@/types/expense";
import { FormEvent, useEffect, useState } from "react"
import Loading from "./Loading";
import { updateExpense } from "@/action/updateExpense";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function({expense, onClose}: {expense: ExpenseType, onClose: () => void}){
    const [data, setData] = useState<any>({});
    
    const queryClient = useQueryClient();
    const { mutate, isPending} = useMutation({
      mutationFn: updateExpense,
      onSettled: (data) => {
        if(data?.success){
          toast.success(data.message || "Update Successful!!!")
          queryClient.invalidateQueries({
            queryKey: ["daily-stats"]
          })
          onClose();
        }else {
          toast.error(data?.error || "Update Failed!!!")
        }
      }
    })

    useEffect(() => {
        setData(expense);
    },[expense]);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
            
        const updateData = {
            title: data.title,
            amount: data.amount,
            expenseType: data.expenseType,
            note: data.note,
            expenseId: data.id,
            quantity: data.quantity
         }
         mutate(updateData);

    

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        const updateValue = (name === "amount" || name ==='quantity') ? parseFloat(value) : value;

        setData((prev:ExpenseType) => ({
            ...prev,
            [name]: updateValue
        }))
    }
    return (
        <div className="w-full h-full overflow-y-auto">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Update Expense</h1>
          <p className="text-gray-500 mt-1">Fill in the form below to Update the record.</p>
        </div>
  
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              required
              value={data.title || ""}
              onChange={handleChange}
              name = 'title'
              placeholder="Expense Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              required
              type='number'
              value={data.amount || ""}
              name = 'amount'
              onChange={handleChange}
              placeholder="Amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              required
              type='number'
              value={data.quantity || ""}
              name = 'quantity'
              onChange={handleChange}
              placeholder="Quantity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Type
            </label>
            <input
              value={data.expenseType || ""}
              onChange={handleChange}
              name = 'expenseType'
              placeholder="e.g., Transportation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <input
              value={data.note || ""}
              onChange={handleChange}
              name = 'note'
              placeholder="Explain..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-red-600 hover:bg-red-900 text-white font-semibold px-6 py-3 rounded-lg transition w-full md:w-auto cursor-pointer"
            > 
              {isPending ? <Loading/> : 'Update Expense'}
            </button>
          </div>
  
         
        </form>
      </div>
    )
    
}