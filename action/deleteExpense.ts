
"use server";

import client from '@/db';
import { revalidatePath } from 'next/cache';

export async function deleteExpense(id: number){
    try {
        await client.expenses.delete({
            where : {
                id
            }
        })

        revalidatePath('/dashboard/expenses')

        return {
            success: true,
            message: "Record Deleted Successfully!!!"

        }
    }catch(e){
        console.log(e);
        return {
            success: false,
            error: "Something Happened!!!"
        }
    }
}