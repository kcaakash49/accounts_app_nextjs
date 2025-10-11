"use server";

import client from "@/db";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export async function dailyReport() {
  try {
    const timeZone = "Asia/Kathmandu";

    // Convert current UTC → Nepal local time
    const nowNepal = toZonedTime(new Date(), timeZone);

    // Start & end of the current Nepali day
    const todayNepal = new Date(
      nowNepal.getFullYear(),
      nowNepal.getMonth(),
      nowNepal.getDate(),
      0, 0, 0, 0
    );
    const tomorrowNepal = new Date(todayNepal);
    tomorrowNepal.setDate(todayNepal.getDate() + 1);

    // Convert to UTC for querying
    const todayUTC = fromZonedTime(todayNepal, timeZone);
    const tomorrowUTC = fromZonedTime(tomorrowNepal, timeZone);

    // Parallel fetch for performance
    const [salesReport, paymentReport, expenseReport, totals] = await Promise.all([
      client.sales.findMany({
        where: { createdAt: { gte: todayUTC, lt: tomorrowUTC } },
        include: { customer: true },
        orderBy: { createdAt: "desc" },
      }),
      client.payment.findMany({
        where: { paidAt: { gte: todayUTC, lt: tomorrowUTC } },
        include: {
          customer: true,
          recordedBy: { select: { id: true, name: true } },
        },
        orderBy: { paidAt: "desc" },
      }),
      client.expenses.findMany({
        where: { createdAt: { gte: todayUTC, lt: tomorrowUTC } },
        include: {
          recordedBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),

      // 👇 Aggregates in one go
      Promise.all([
        client.sales.aggregate({
          _sum: { amount: true },
          where: { createdAt: { gte: todayUTC, lt: tomorrowUTC } },
        }),
        client.payment.aggregate({
          _sum: { amountPaid: true },
          where: { paidAt: { gte: todayUTC, lt: tomorrowUTC } },
        }),
        client.expenses.aggregate({
          _sum: { total: true },
          where: { createdAt: { gte: todayUTC, lt: tomorrowUTC } },
        }),
      ]),
    ]);

    // Extract totals
    const [salesTotal, paymentTotal, expenseTotal] = totals;

    return {
      success: true,
      salesReport,
      paymentReport,
      expenseReport,
      totals: {
        sales: salesTotal._sum.amount || 0,
        payment: paymentTotal._sum.amountPaid || 0,
        expense: expenseTotal._sum.total || 0,
      },
      range: { from: todayNepal.toISOString(), to: tomorrowNepal.toISOString() },
    };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("Daily report error:", error);
    return { success: false, error };
  }
}
