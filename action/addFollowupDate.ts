"use server"

import client from '@/db';
import { revalidatePath } from 'next/cache';

interface typeDate {
    followUpDate: Date;
    userId: number;
}
export async function addFollowupDate({followUpDate, userId}: typeDate){
    try {
        const customer = await client.customer.update({
            where: {
                id: userId
            }, data: {
                dueDate: followUpDate
            }
        })

        revalidatePath("/dashboard");
        return {
            success: true,
            customer,
            message: "Follow up Added Successfully !!!"
        }

    }catch(e){  
        console.error(e);
        throw new Error("Something Happened!!!")
    }
}