"use server"

import client from "@/db";
import { ActiveStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addcustomer({name, contact, address,activeStatus,secondContact} : {name: string, contact: string, address: string, activeStatus: ActiveStatus, secondContact: string } ){
    console.log(name,contact,address)

    try {
        await client.customer.create({
            data: {
                name: name,
                contact: contact,
                address: address,
                activeStatus: activeStatus,
                secondContact: secondContact

            }
        })
        revalidatePath('/dashboard/customers')
        revalidatePath("/dashboard")

        return {
            message: "Customer Added Successfully!!!"
        }
    }catch(e){
        return {
            error:"Something Happened!!!",
            err: e
        }
    }

}