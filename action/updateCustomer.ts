
"use server"

import client from "@/db";
import { ActiveStatus, DueStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";


export type UpdataCustomerType = {
    name: string;
    contact: string;
    address: string;
    activeStatus: ActiveStatus,
    status: DueStatus,
    customerId: number,
    secondContact: string | null;
}
export async function updateCustomer(updateData: UpdataCustomerType){
    
    try {

        const secondContacttoSave = !updateData.secondContact || updateData.secondContact?.trim() === "" ? null : updateData.secondContact;
        await client.customer.update({
            where: {
                id: updateData.customerId
            }, 
            data: {
                name: updateData.name,
                contact: updateData.contact,
                address: updateData.address,
                status: updateData.status,
                activeStatus: updateData.activeStatus,
                secondContact: secondContacttoSave
            }
        })

        revalidatePath("/dashboard/customers");
        revalidatePath("/dashboard/payment-history");
        revalidatePath("/dashboard/sales");
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/results")

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