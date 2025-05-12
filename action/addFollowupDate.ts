"use server"

import client from '@/db';

export async function addFollowupDate(followUpDate : Date, userId: number){
    try {
        const customer = await client.customer.update({
            where: {
                id: userId
            }, data: {
                dueDate: followUpDate
            }
        })

        return {
            success: true,
            customer,
            message: "Follow up Added Successfully !!!"
        }

    }catch(e){  
        console.error(e);
        return {
            success: false,
            error: "Operation Unsuccessful !!!"
        }
    }
}