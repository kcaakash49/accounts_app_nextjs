"use server"

import client from "@/db";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface PayForm {
    amount: string,
    note: string,
    paymentMethod: PaymentMethod,
    customerId: number
}

interface DecodedSchema extends JwtPayload{
    id: number,
    username: string
}

export async function addPayment(formData : PayForm){
    const token = (await cookies()).get("token")?.value;
    if(!token){
        throw new Error("Unauthorized!!!")
    }
    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET!);
        
        if (typeof decoded === "object" && "id" in decoded && "username" in decoded) {
            const { id } = decoded as DecodedSchema;
            
            await client.payment.create({
                data: {
                    amountPaid: Number(formData.amount),
                    note: formData.note,
                    adminUserId: id,
                    customerId: formData.customerId,
                    paymentMethod: formData.paymentMethod
                }
            })
            revalidatePath("/dashboard");
            revalidatePath("/dashboard/payment-history");
            revalidatePath("/dashboard/customers");
            
            return ({
                message: "Payment Added Successfully !!!"
            })
        }

        throw new Error("Payment Unsuccessful!!!")

    }catch(e){
        if (e instanceof Error){
            throw e
        }
        throw new Error("Something Happened!!!");
    }
}