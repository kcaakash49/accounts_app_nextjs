
'use server';

import client from "@/db";


export async function expenseHistory(){
    try {
        const data = await client.expenses.findMany({
            include: {
                recordedBy: true
            },orderBy: {
                createdAt: 'desc'
            }
        })

        const sanitizedData = data.map(expense => {
            const { password, ...safeUser } = expense.recordedBy || {};
            return {
                ...expense,
                recordedBy: safeUser
            };
        });

        
        return {
            success: true,
            data: sanitizedData
        };
    }catch(e){
        console.log(e);
        return {
            success: false
        }
    }
}