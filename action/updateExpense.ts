

"use server"

import client from "@/db";
import { revalidatePath } from "next/cache";

type UpdateType = {
    amount: number,
    title: string,
    expenseType: string,
    note: string,
    expenseId: number
}

export async function updateExpense(updateData : UpdateType){
    try {
        await client.expenses.update({
            where: {
                id: updateData.expenseId
            }, 
            data: {
                amount: updateData.amount,
                title: updateData.title,
                expenseType: updateData.expenseType,
                note: updateData.note

            }
        })

        revalidatePath("/dashboard/expenses");

        return {
            message: "Update Successful!!!",
            success: true
        }
    }catch(e){
        console.error(e);
        return {
            success: false
        }
    }
}