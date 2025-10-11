

'use client';


import { useState } from 'react';
import Loading from './Loading';
import { addExpense } from '@/action/addExpense';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type ResponseType = {
    success: boolean;
    message? : string;
    error?: string;
}

export default function() {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [note, setNote] = useState('');
  const [quantity,setQuantity] = useState('');

  const resetForm = () => {
    setAmount("");
    setTitle("");
    setExpenseType("");
    setNote("");
    setQuantity("")
  }


  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addExpense,
    onSettled: (data) => {
      if (data?.success){
        toast.success(data.message || "✅Expense Added Successfully")
        queryClient.invalidateQueries({
          queryKey: ["daily-stats"]
        })
        resetForm();
      }else {
        toast.error(data?.error || "Operation Failed!!!")
      }
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
        title,
        expenseType,
        note,
        amount: Number(amount),
        quantity: Number(quantity)
    }
    mutate(expenseData);
    
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Add Expense</h1>
        <p className="text-gray-500 mt-1">Fill in the form below to register a new customer.</p>
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
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expense Type
          </label>
          <input
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            placeholder="e.g., Transportation"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition w-full md:w-auto cursor-pointer"
          > 
            {isPending ? <Loading/> : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
