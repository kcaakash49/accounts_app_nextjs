"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react"; // optional icon
import { searchCustomer } from "@/action/searchCustomer";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    const router = useRouter();

    const queryClient = useQueryClient();

    const searchMutation = useMutation({
        mutationFn: searchCustomer,
        onSuccess: (data) => {
            toast.success("Search Successful");
            queryClient.setQueryData(["searchResult"], data)
            router.push(`/dashboard/results?query=${encodeURIComponent(search)}`);
            
        }, onError: (error) => {
            toast.error(error.message || "Operation Unsuccessful!!!")
        }
    })

    const handleSearch = async () => {
          if (!search.trim()) {
            toast.error("Please Enter a valid term!!!")
            return;
        }
        searchMutation.mutate(search);
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
        
    }

    return (
        <div >
            <form onSubmit={handleSubmit} className="relative w-full sm:w-64">
                {searchMutation.isPending ? (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>

                ) : (

                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:text-blue-600 cursor-pointer" onClick={handleSearch} aria-disabled={searchMutation.isPending} />
                )}
                <input
                    type="text"
                    value={search}
                    disabled={searchMutation.isPending}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    placeholder="Search Customer..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-800 placeholder-gray-500"
                />

            </form>

        </div>
    );
}
