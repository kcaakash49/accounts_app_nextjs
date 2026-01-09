"use server"

import client from "@/db"

interface Props {
    page?: number;
    count?: number;
}

export async function getCustomer({page=1, count=10}: Props){
    
    try {
        const users = await client.customer.findMany({
            orderBy: {
                createdAt: "desc"
            },
            skip: (page-1) * count,
            take: count
        });
      

        return {
            users,
            status: 200
        }

    }catch(e){
        return {
            error: "Something Happened",
            err: e,
            users:[]
        };
    }
}

