"use client"

import { User } from "@/app/dashboard/customers/page";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { updateCustomer } from "@/action/updateCustomer";

export default function UpdateCustomer({ customer }: { customer: User }) {

    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<null | string>(null);
    const [error, setError] = useState<null|string>(null);


    useEffect(() => {
        setData(customer);
    }, [customer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updateData = {
            name: data?.name,
            contact: data?.contact,
            activeStatus: data?.activeStatus,
            status: data?.status,
            address:data?.address,
            customerId: data?.id
        }

        try{
            setLoading(true);
            const res = await updateCustomer(updateData);
            setMessage(res.success && res.message ? res.message : null);
            setError(!res.success ? "Failed to Update" : null);
        }catch(e){
            setError("Internal Server Error!")
            setMessage(null);
        }finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prev: User) => prev ? { ...prev, [name]: value } : prev);
    };
 

    return (
        <div className="w-full h-full overflow-y-auto">
            <div className="mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Update Customer</h1>
                <p className="text-gray-500 mt-1">Fill in the form below to update customer.</p>
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
                        value={data?.name || ""}
                        onChange={handleChange}
                        name='name'
                        placeholder="Customer Name"
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
                        value={data?.contact || ""}
                        name='contact'
                        onChange={handleChange}
                        placeholder="Contact"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        value={data?.address || ""}
                        onChange={handleChange}
                        name='address'
                        placeholder="e.g., Kathhmandu,Nepal"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block">Active Status</label>
                    <div>
                        <select
                            value={data?.activeStatus || ''}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm  focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                            onChange={handleChange}
                            name="activeStatus"
                        >
                            <option value="ONLINE">ONLINE</option>
                            <option value="EXPIRED">EXPIRED</option>
                        </select>

                    </div>
                </div>
                <div>
                    <label className="block">Due Status</label>
                    <div>
                        <select
                            value={data?.status || ''}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm  focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                            onChange={handleChange}
                            name="status"
                        >
                            <option value="PAID">PAID</option>
                            <option value="UNPAID">UNPAID</option>
                            <option value = "PARTIAL">PARTIAL</option>
                        </select>

                    </div>
                </div>


                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-900 text-white font-semibold px-6 py-3 rounded-lg transition w-full md:w-auto cursor-pointer"
                    >
                        {loading ? <Loading /> : 'Update Customer'}
                    </button>
                </div>

                {message && (
                    <p className="text-green-600 md:col-span-2 mt-2">
                        ✅ Customer Updated Successfully !!!
                    </p>
                )}
                {error && (
                    <p className="text-red-600 md:col-span-2 mt-2">
                        {error}
                    </p>
                )}
            </form>
        </div>
    )
}



