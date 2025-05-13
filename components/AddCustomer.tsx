'use client';

import { addcustomer } from '@/action/addcustomer';
import { useState } from 'react';
import Loading from './Loading';
import { ActiveStatus } from '@prisma/client';

export default function() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondContact, setSecondContact] = useState('');
  const [message,setMessage] = useState<null | String>(null)
  const [error,setError] = useState<null | String>(null)
  const [activeStatus, setActiveStatus] = useState<ActiveStatus>('ONLINE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    

    try {
      const res = await addcustomer({name, address, contact, activeStatus,secondContact});
      
      if(res.message){
        setMessage(res.message);
        setError(null);
        setName('');
        setContact("");
        setAddress("")
        setSecondContact("");
      }else if(res.error){
        setMessage(null);
        setError(res.error);
      }
    } catch (err) {
        setError("Internal Server Error")
        setMessage(null)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Add New Customer</h1>
        <p className="text-gray-500 mt-1">Fill in the form below to register a new Expense Record.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage(null);
              setError(null);
            }}
            placeholder="Customer name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact
          </label>
          <input
            required
            type='number'
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Phone or Mobile"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Contact(optional)
          </label>
          <input
            
            type='number'
            value={secondContact}
            onChange={(e) => setSecondContact(e.target.value)}
            placeholder="Phone or Mobile"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
        <label className="block">Active Status</label>
        <div>
          <select
            value={activeStatus}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm  focus:ring-blue-500 focus:border-blue-500 text-gray-600"
            onChange={(e) => setActiveStatus(e.target.value as ActiveStatus)}
          >
            <option value="ONLINE">ONLINE</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>

        </div>
        </div>

        <div className="block">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label> 
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., Kathmandu, Nepal"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition w-full md:w-auto cursor-pointer"
          >
            {loading ? <Loading/> : 'Add Customer'}
          </button>
        </div>

        {message && (
          <p className="text-green-600 md:col-span-2 mt-2">
            ✅ Customer added successfully!
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
