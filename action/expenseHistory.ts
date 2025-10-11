
'use server';

import client from "@/db";


export async function expenseHistory(){
    try {
        const data = await client.expenses.findMany({
            include: {
                recordedBy: {
                    select: {
                        id: true, name: true
                    }
                }
            },orderBy: {
                createdAt: 'desc'
            }
        })
        
        return {
            success: true,
            data
        };
    }catch(e){
        console.log(e);
        return {
            success: false
        }
    }
}