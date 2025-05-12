

import client from "@/db";

export async function salesHistory(){
    try {
        const salesHistory = await client.sales.findMany({
            include: {
                customer: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            success: true,
            sales: salesHistory,
            message: "Operation Successful !!!"
        }
    }catch(e){
        console.error(e);
        return {
            error: "Operation Unsuccessful"
        }
    }
}