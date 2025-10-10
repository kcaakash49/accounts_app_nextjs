
"use server"

import client from "@/db";
import { revalidatePath } from "next/cache";

export async function updateDueStatus(id: number){
    try {
        const updateUser = await client.customer.update({
            where: {id},
            data: {
                dueDate: null,
                status: "PAID"
            }
        })
        revalidatePath("/dashboard");

        return {
            success: true,
        }
    }catch(e){
        return {
            success: false
        }
    }
}