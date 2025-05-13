"use server"

import client from "@/db";
import { ActiveStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addcustomer({name, contact, address,activeStatus,secondContact} : {name: string, contact: string, address: string, activeStatus: ActiveStatus, secondContact: string } ){
    console.log(name,contact,address)

    try {
        const existingUser = await client.customer.findFirst({
            where: {
                OR: [{contact: contact}, {secondContact: contact}, {contact:secondContact},{secondContact:secondContact}]
            }
        })

        if(existingUser){
            return{
                error: "Contact Already Exist"
            }
        }

        const secondContacttoSave = secondContact.trim() === "" ? null : secondContact;

        const user = await client.customer.create({
            data: {
                name: name,
                contact: contact,
                address: address,
                activeStatus: activeStatus,
                secondContact: secondContacttoSave

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