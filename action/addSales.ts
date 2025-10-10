"use server";

import client from "@/db";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface SaleSchema {
  amount: string;
  note: string;
  customerId: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PayMethod;
}
type PaymentStatus = "PAID" | "UNPAID";
type PayMethod = "CASH" | "ONLINE";

interface DecodedSchema extends JwtPayload {
  id: number;
  username: string;
}

export async function addSales(formData: SaleSchema) {
  try {
    await client.$transaction(async (tx) => {
      const sale = await tx.sales.create({
        data: {
          amount: Number(formData.amount),
          customerId: formData.customerId,
          note: formData.note,
        },
      });

      if (formData.paymentStatus === "PAID") {
        const token = (await cookies()).get("token")?.value;
        const decoded = jwt.verify(token!, process.env.JWT_SECRET!);

        if (!token) throw new Error("Missing token");

        const { id } = decoded as DecodedSchema;

        await tx.payment.create({
          data: {
            amountPaid: Number(formData.amount),
            note: formData.note,
            adminUserId: id,
            customerId: formData.customerId,
            paymentMethod: formData.paymentMethod,
          },
        });
        revalidatePath("/dashboard/payment-history")
      }
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/sales")
    return { message: "Operation Successful" };
  } catch (e) {
    if (e instanceof Error){
      throw e;
    }
    throw new Error("Something Happened!!!")
  }
}
