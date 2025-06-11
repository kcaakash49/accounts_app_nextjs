"use server";

import client from "@/db";
import { revalidatePath } from "next/cache";

export async function deleteCustomer(id: number) {
  try {
    await client.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: {
          id,
        },
        include: {
          sales: true,
          payments: true,
        },
      });

      if (!customer) throw new Error("Customer Not Found");

      const trashCustomer = await tx.trashCustomer.create({
        data: {
          name: customer.name,
          contact: customer.contact,
          address: customer.address,
          activeStatus: customer.activeStatus,
          status: customer.status,
          createdAt: customer.createdAt,
          dueDate: customer.dueDate,
          
        },
      });

      await tx.trashSales.createMany({
        data: customer.sales.map((sale) => ({
          trashCustomerId: trashCustomer.id,
          amount: sale.amount,
          note: sale.note,
          createdAt: sale.createdAt,
        })),
      });

      await tx.trashPayment.createMany({
        data: customer.payments.map((payment) => ({
          trashCustomerId: trashCustomer.id,
          amountPaid: payment.amountPaid,
          paymentMethod: payment.paymentMethod,
          paidAt: payment.paidAt,
          note: payment.note,
          adminUserId: payment.adminUserId,
        })),
      });

      await tx.payment.deleteMany({ where: { customerId: id } });
      await tx.sales.deleteMany({ where: { customerId: id } });
      await tx.customer.delete({ where: { id } });

    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/payment-history");
    revalidatePath("/dashboard/sales");
    revalidatePath("/results");

    return {
        success: true,
        message: "Customer Deleted Successfully!"
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
    };
  }
}
