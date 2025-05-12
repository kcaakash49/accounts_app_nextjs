"use server"

import client from '@/db';
import { error } from 'console';
import { revalidatePath } from 'next/cache';

interface UpdateSchema {
    amountPaid: number,
    note: String;
    paymentMethod: PaymentMethodSchema,
    paymentId: number
}
type PaymentMethodSchema = 'CASH' | 'ONLINE';
export async function updatePayment(toUpdateData: any){
    try {
        await client.payment.update({
            where: {
                id: toUpdateData.paymentId
            },data: {
                amountPaid: toUpdateData.amountPaid,
                note: toUpdateData.note,
                paymentMethod: toUpdateData.paymentMethod
            }
        })

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/customers");
        revalidatePath("/dashboard/payment-history");

        return {
            success: true,
            message: "Payment Update Successfully !!!"
        }
    }catch(e){
        console.error(e);
        return {
            success: false,
            error: "Something Happened"

        }
    }
}