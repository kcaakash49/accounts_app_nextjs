"use server"

import client from '@/db';

export async function paymentHistory({page=1, count=10}: {page?: number, count?: number}){
    try {

        const [data,total] = await Promise.all([
            client.payment.findMany({
                skip: (page - 1) * count,
                take: count,
                orderBy: {
                    paidAt: 'desc'
                },
                include: {
                    customer: true,
                    recordedBy: true
                }     
            }),
            client.payment.count()
        ]);
        return {
            status: true,
            data,
            meta: {
                total,
                page,
                count,
                totalPages: Math.ceil(total / count)
            }
        }
    }catch(e) {
        console.error(e);
        return {
            status: false,
            error: "Something Happened",
        }
    }
}