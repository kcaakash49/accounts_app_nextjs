"use server";

import client from '@/db';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';


interface DecodedSchema extends JwtPayload {
    id: number;
    username: string;
  }

interface FormType {
    title: string,
    expenseType: string,
    note: string,
    amount: number
    quantity: number
}

export async function addExpense(formData: FormType) {

    try {
        const token = (await cookies()).get("token")?.value;
        if (!token) throw new Error("Missing token");

        const decoded = jwt.verify(token!, process.env.JWT_SECRET!);


        const { id } = decoded as DecodedSchema;

        await client.expenses.create({
            data : {
                title: formData.title,
                amount: formData.amount,
                expenseType: formData.expenseType,
                note: formData.note,
                adminUserId: id,
                quantity: formData.quantity,
                total: formData.quantity * formData.amount
            }
        })


        revalidatePath("/dashboard/expenses");
        revalidatePath("/dashboard");

        return {
            success: true,
            message: "Expense Added Successfully"
        }





    }catch(e){
        console.error(e);
        return {
            success: false,
            error: "Something Happened !!!"
        }
    }
}