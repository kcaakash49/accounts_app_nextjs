"use client"

import { getCustomer } from "@/action/getCustomer";
import AddCustomer from "@/components/AddCustomer";
import CustomerList from "@/components/CustomerList";
import LinkButton from "@/components/LinkButton";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import { ActiveStatus, DueStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";

export type User = {
    id: number;
    name: string;
    contact: string;
    address: string | null;
    createdAt: Date;
    dueDate: Date | null;
    activeStatus: ActiveStatus;
    status: DueStatus;
    secondContact: string | null;
};

type UserSchema =
    | { users: User[]; error?: undefined; err?: undefined }
    | { error: string; err: unknown; users: User[] };


export default function () {
    const [page, setPage] = useState(1);
    const router = useRouter();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["customer-list", page],
        queryFn: async () => {
            const res = await getCustomer({ page, count: 20 })
            if (!res.status) throw new Error(res.error)
            return res;;
        },
        retry: 1,
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000
    })

    useEffect(() => {
        if (isError) {
            toast.error("Something Happened");
            router.replace("/dashboard")
            return;
        }
    }, [isError])

    if (isLoading) {
        return <Loading/>
    }
    const users = data?.users || [];
    const meta = data?.meta;
    // if (users?.length === 0 || !users) {
    //     return <div className="text-center text-4xl">
    //         No Records Found
    //     </div>
    // }
     if (!users.length) {
        return (
            /* --- BEAUTIFUL EMPTY STATE (Server Side) --- */
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative mb-6">
                    <div className="h-24 w-24 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-4xl">
                        🏙️
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg border-4 border-white dark:border-secondary-900">
                        <span className="text-white text-xs font-bold">?</span>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">
                    No Matches <span className="text-gold">Found</span>
                </h2>

                <p className="mt-4 max-w-md text-secondary-500 dark:text-secondary-400 leading-relaxed">
                    No customers have been added yet. Start building your customer base by adding new customers to your dashboard. Click the button below to get started!
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

                    <Link
                        href="/dashboard/add-customer"
                        className="px-10 py-4 border border-secondary-200 text-secondary-900 rounded-full font-bold hover:bg-secondary-100 transition-all"
                    >
                        Add Customer
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-6">
                {/* Clean Dashboard Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-blue-50 pb-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                            Customers
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Manage and monitor your customer base.
                        </p>
                    </div>

                    {/* Styled Add Customer Button */}
                    <button
                        onClick={() => router.push("/dashboard/add-customer")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all self-start sm:self-auto"
                    >
                        {/* Modern Plus Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Customer
                    </button>
                </div>

                {/* Table & Component Layout */}
                <div className="space-y-6">
                    <CustomerList users={users} page={page} pageSize={20} />

                    <div className="pt-2 border-t border-blue-50">
                        <Pagination
                            totalPages={meta?.totalPages || 1}
                            currentPage={page}
                            changePage={(p) => setPage(p)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}

