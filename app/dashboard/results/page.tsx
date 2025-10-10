

"use client";

import { searchCustomer } from "@/action/searchCustomer";
import Loading from "@/app/loading";
import CustomerList from "@/components/CustomerList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function () {

    const router = useRouter();
    const searchParams = useSearchParams();
    const searchKey = searchParams.get("query");
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["searchResult"],
        queryFn: () => searchCustomer(searchKey!),
        staleTime: 10 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true
    })

    useEffect(() => {
        if (!searchKey) {
            router.push("/dashboard")
            return
        }

    }, [searchKey])

    console.log("Search Result", data);

    if (isLoading) {
        return <Loading/>
    }
    
    if(!data?.customers) return <div className="flex items-center justify-center ">No User Found!!!</div>;
    
    return (
        <div>
            <CustomerList users={data.customers}/>

        </div>



    )
}