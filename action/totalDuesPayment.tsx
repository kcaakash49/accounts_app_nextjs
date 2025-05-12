"use server"

import client from "@/db";

export async function totalDuesPayment(){
    try {
        const [sales, payments, customerCount] = await Promise.all([
            client.sales.findMany({}),
            client.payment.findMany({}),
            client.customer.count()
        ]);

        const totalSales = sales.reduce((sum, sale) => {
            return sum + sale.amount;
        }, 0);

        const totalPayment = payments.reduce((sum, payment) => {
            return sum + payment.amountPaid;
        }, 0);

        const remainingDues = totalSales - totalPayment;

        return {
            message: "Operation Successful!!!",
            totalSales,
            totalPayment,
            remainingDues: remainingDues,
            customerCount
        };
    } catch (e) {
        return {
            error: "Something Happened!!!",
            err: e
        };
    }
}
