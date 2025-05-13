
"use server"

import client from "@/db";
import { ActiveStatus, DueStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";


type UpdataType = {
    name: string;
    contact: string;
    address: string;
    activeStatus: ActiveStatus,
    status: DueStatus,
    customerId: number
}
export async function updateCustomer(updateData: UpdataType){
    try {
        await client.customer.update({
            where: {
                id: updateData.customerId
            }, 
            data: {
                name: updateData.name,
                contact: updateData.contact,
                address: updateData.address,
                status: updateData.status,
                activeStatus: updateData.activeStatus
            }
        })

        revalidatePath("/dashboard/customers");
        revalidatePath("/dashboard/payment-history");
        revalidatePath("/dashboard/sales");
        revalidatePath("/dashboard")

        return {
            success: true,
            message: "Customer Updated Successfully!"
        }

    }catch(e){
        console.error(e)
        return {
            success: false
        }
    }
}