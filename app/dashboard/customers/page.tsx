"use client"

import { getCustomer } from "@/action/getCustomer";
import AddCustomer from "@/components/AddCustomer";
import CustomerList from "@/components/CustomerList";
import LinkButton from "@/components/LinkButton";
import Navbar from "@/components/Navbar";
import { ActiveStatus, DueStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
        const { data: users, isLoading, isError, error} = useQuery({
            queryKey: ["customer-list", page],
            queryFn: async () => {
                const res = await getCustomer({page, count:20})
                if (!res.status) throw new Error (res.error)
                return res.users;
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
        },[isError])
        
        if (isLoading) {
            return <div className="min-h-screen flex items-center justify-center">
                Loading.......
            </div>
        }

        if (users?.length === 0 || !users) {
            return <div className="text-center text-4xl">
                No Records Found
            </div>
        }

        return (
            <div>
                
                <div className="mt-5 md:sm-10">
                    <button onClick={() => router.push("/dashboard/add-customer")} className="bg-blue-400 px-4 py-2">Add Customer</button>
                    <CustomerList users={users} page = {page} setPage={setPage} pageSize={20}/>

                </div>

            </div>
        )

}

