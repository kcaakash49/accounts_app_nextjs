"use server"

import client from "@/db";

export async function totalDuesPayment() {
  try {
    const [salesAgg, paymentAgg, customerCount] = await Promise.all([
      client.sales.aggregate({
        _sum: { amount: true },
      }),
      client.payment.aggregate({
        _sum: { amountPaid: true },
      }),
      client.customer.count(),
    ]);

    const totalSales = salesAgg._sum.amount || 0;
    const totalPayment = paymentAgg._sum.amountPaid || 0;
    const remainingDues = totalSales - totalPayment;

    return {
      message: "Operation Successful!!!",
      totalSales,
      totalPayment,
      remainingDues,
      customerCount,
    };
  } catch (e) {
    return { error: "Something Happened!!!", err: e };
  }
}
