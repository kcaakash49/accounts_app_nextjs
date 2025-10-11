



"use server"

import client from '@/db';
import { revalidatePath } from 'next/cache';

type UpdateDataType = {
    amount: number;
    note: string;
    salesId: number;
}
export async function updateSales(toUpdateData: UpdateDataType){
    try {
        await client.sales.update({
            where : {
                id: toUpdateData.salesId
            },
            data: {
                amount: toUpdateData.amount,
                note: toUpdateData.note
            }
        })

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/customers");
        revalidatePath("/dashboard/sales");

        return {
            success: true,
            message: "Updated Successfully !!!"
        }
    }catch(e){
        console.error(e);
        return {
            success: false,
            error: "Operation Failed!!!"
        }

    }
}