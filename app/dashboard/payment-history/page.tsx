"use client";

import { paymentHistory } from "@/action/paymentHistory"
import Pagination from "@/components/Pagination";
import PaymentsList from "@/components/PaymentLists";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";


export default function () {
    const [page, setPage] = useState(1);
    const router = useRouter();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["payment-history", page],
        queryFn: async () => {
            const res = await paymentHistory({ page, count: 20 })
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
  return (
    <Loading />
  );
}
    const payments = data?.data || [];
    const meta = data?.meta || { total: 0, page: 1, count: 20, totalPages: 1 };

     if (!payments.length) {
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
                   No payment history found. It seems you haven't made any transactions yet. Start exploring our services and make your first payment to see it here!
                </p>
            </div>
        );
    }

    return (
        <div>
            <PaymentsList data={payments} />

            <Pagination totalPages={meta.totalPages} currentPage={meta.page} changePage={setPage} />
        </div>
    )
}



