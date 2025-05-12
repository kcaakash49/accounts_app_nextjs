"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react"; // optional icon
import { searchCustomer } from "@/action/searchCustomer";
import { useRouter } from "next/navigation";

type ResponseType = {
    message?: string;
    success: boolean;
    error?: string;
    customers?: Customer[];

}

type SaleType = {
    id: number;
    amount: number;
    note?: string | null,
    createdAt: Date;
    customerId: number;
    
}

type PaymentType = {
    id: number;
    customerId: number;
    amountPaid: number;
    paidAt: Date;
    note?: string | null;
}

type Customer = {
    id: number;
    name: string;
    contact: string;
    address?: string | null;
    status: DueStatus;
    createdAt: Date;
    dueDate?: Date | null;
    sales: SaleType[] | [];
    payments: PaymentType[] | [];

}
type DueStatus = "UNPAID" | "PARTIAL" | "PAID";
type SaleStatus = "UNPAID" | "PAID";

export default function SearchComponent() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null)
    const router = useRouter();

    const handleSearch = async () => {


        if (!search.trim()) {
            setError("Please enter a valid search term");
            return;
        }
        try {
            setLoading(true);
            const res: ResponseType = await searchCustomer(search);

            if (!res.success && res.error) {
                setError(res.error);
            } else if (res.success && res.customers?.length === 0) {
                setError("No Customer Found!!!")
            } else if (res.success) {
                sessionStorage.setItem("searchResults", JSON.stringify(res.customers));
                setError(null);
                router.push(`/dashboard/results?query=${encodeURIComponent(search)}`);
            }
        } catch (e) {
            setError("An unExpected Error Occured")
        } finally {
            setLoading(false);
        }
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    }

    return (
        <div >
            <form onSubmit={handleSubmit} className="relative w-full sm:w-64">
                {loading ? (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>

                ) : (

                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:text-blue-600 cursor-pointer" onClick={handleSearch} aria-disabled={loading} />
                )}
                <input
                    type="text"
                    value={search}
                    disabled={loading}
                    onChange={(e) => {
                        setError(null);
                        setSearch(e.target.value);
                    }}
                    placeholder="Search Customer..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-800 placeholder-gray-500"
                />

            </form>
            {error && <div className="mt-2 text-red-600 text-sm text-center">{error}</div>}

        </div>
    );
}
