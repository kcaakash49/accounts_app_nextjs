"use server";

import client from "@/db";
import { fromZonedTime } from "date-fns-tz";

export async function followUp() {
  try {
    const timeZone = "Asia/Kathmandu";

    // Nepal start and end of today
    const nowNepal = new Date();
    const todayNepal = new Date(nowNepal);
    todayNepal.setHours(0, 0, 0, 0);
    const tomorrowNepal = new Date(todayNepal);
    tomorrowNepal.setDate(todayNepal.getDate() + 1);

    // Convert Nepal-local times to UTC
    const todayUTC = fromZonedTime(todayNepal, timeZone);
    const tomorrowUTC = fromZonedTime(tomorrowNepal, timeZone);

    // 1️⃣ Fetch customers with dueDate in today
    const customers = await client.customer.findMany({
      where: {
        dueDate: { gte: todayUTC, lt: tomorrowUTC }
      }
    });

    const customerIds = customers.map(c => c.id);

    // 2️⃣ Get total sales per customer
    const salesTotals = await client.sales.groupBy({
      by: ["customerId"],
      where: {
        customerId: { in: customerIds },
      },
      _sum: { amount: true }
    });

    // 3️⃣ Get total payments per customer
    const paymentTotals = await client.payment.groupBy({
      by: ["customerId"],
      where: {
        customerId: { in: customerIds },
      },
      _sum: { amountPaid: true }
    });

    // 4️⃣ Merge totals into each customer
    const customersWithTotals = customers.map(customer => {
      const sales = salesTotals.find(s => s.customerId === customer.id)?._sum.amount ?? 0;
      const payments = paymentTotals.find(p => p.customerId === customer.id)?._sum.amountPaid ?? 0;
      return {
        ...customer,
        totalSales: sales,
        totalPayments: payments,
        remainingDue: sales - payments
      };
    });

    return {
      success: true,
      customers: customersWithTotals
    };

  } catch (e) {
    console.error("Error fetching follow-ups:", e);
    return { success: false };
  }
}
