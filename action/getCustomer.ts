"use server"

import client from "@/db"

interface Props {
    page?: number;
    count?: number;
}

export async function getCustomer({page=1, count=10}: Props){
    
    try {
        const [users, total] = await Promise.all([
            client.customer.findMany({
                skip: (page - 1) * count,
                take: count,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            client.customer.count()
        ])
      

        return {
            users,
            status: 200,
            meta: {
                page,
                count,
                total,
                totalPages: Math.ceil(total / count)
            }
        }

    }catch(e){
        return {
            error: "Something Happened",
            err: e,
            users:[]
        };
    }
}

