

"use server"

import client from "@/db";
import { revalidatePath } from "next/cache";

export async function deleteSale(id: number){

    try {
        await client.sales.delete({
            where: {
                id
            }
        })

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/sales");
        revalidatePath("/dashboard/customers");

        return {
            success: true,
            message: "Sales Record Deleted Successfully !!!"
        }

    }catch(e){
        console.error(e);
        return {
            success: false
        }
    }
}