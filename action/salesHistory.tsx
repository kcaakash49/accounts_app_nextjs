"use server"

import client from "@/db";

export async function salesHistory({page=1, count=10}: {page?: number, count?: number}){
    try {
        const [data,total] = await Promise.all([
            client.sales.findMany({
                skip: (page - 1) * count,
                take: count,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    customer: true,
                }     
            }),
            client.sales.count()
        ]);
        return {
            status: true,
            sales: data,
            meta: {
                total,
                page,
                count,
                totalPages: Math.ceil(total / count)
            }
        }
    }catch(e){
        console.error(e);
        return {
            status: false,
            error: "Operation Unsuccessful"
        }
    }
}