

'use client';


import { useState } from 'react';
import Loading from './Loading';
import { addExpense } from '@/action/addExpense';

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
  const [loading, setLoading] = useState(false);
  const [message,setMessage] = useState<null | String>(null)
  const [error,setError] = useState<null | String>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
        title,
        expenseType,
        note,
        amount: Number(amount)
    }
    try {
        setLoading(true);
        const res: ResponseType = await addExpense(expenseData);

        if(res.success && res.message){
            setMessage(res.message);
            setError(null)
        }else if(res.error){
            setError(res.error);
            setMessage(null)
        }

    }catch(e){
        setError("Internal Server Error");
        setMessage(null)

    }finally {
        setLoading(false);
    }
    
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
              setMessage(null);
              setError(null);
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
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition w-full md:w-auto cursor-pointer"
          > 
            {loading ? <Loading/> : 'Add Expense'}
          </button>
        </div>

        {message && (
          <p className="text-green-600 md:col-span-2 mt-2">
            ✅ Expense Added Successfully !!!
          </p>
        )}
        {error && (
          <p className="text-red-600 md:col-span-2 mt-2">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
