
"use server"

import client from '@/db';
import { revalidatePath } from 'next/cache';

export async function deletePayment(id:number){
    try{
        const response = await client.payment.delete({
            where: {
                id: id
            }
        })


        revalidatePath("/dashboard");
        revalidatePath("/dashboard/customers");
        revalidatePath("/dashboard/payment-history");

        return {
            success: true,
            message: "Deleted Successfully"
        }
    }catch(e){
        console.error(e);
        return {
            success: false,
            error: "Somethign Happened!!!"
        }
    }
}