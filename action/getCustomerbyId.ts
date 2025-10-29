"use server";
import client from "@/db";

export async function getCustomerbyId(id: number) {
  try {
    const [user, salesSum, paymentSum] = await Promise.all([
      client.customer.findUnique({
        where: { id },
        include: { sales: true, payments: true },
      }),
      client.sales.aggregate({
        where: { customerId: id },
        _sum: { amount: true },
      }),
      client.payment.aggregate({
        where: { customerId: id },
        _sum: { amountPaid: true },
      }),
    ]);

    if (!user) {
      return { success: false, user: null, message: "User not found" };
    }

    const totalSales = salesSum._sum.amount ?? 0;
    const totalPayment = paymentSum._sum.amountPaid ?? 0;
    const remainingDue = totalSales - totalPayment;

    return {
      success: true,
      user,
      totals: { totalSales, totalPayment, remainingDue },
      message: "Success",
    };
  } catch (e) {
    console.error(e);
    return { success: false, user: null, message: "Internal Server Error" };
  }
}
