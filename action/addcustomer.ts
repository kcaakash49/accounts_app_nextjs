"use server"

import client from "@/db";
import { revalidatePath } from "next/cache";

export async function addcustomer({name, contact, address} : {name: string, contact: string, address: string} ){
    console.log(name,contact,address)

    try {
        await client.customer.create({
            data: {
                name: name,
                contact: contact,
                address: address
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