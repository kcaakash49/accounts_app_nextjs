"use server";

import client from "@/db";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export async function dailyReport() {
  try {
    const timeZone = "Asia/Kathmandu";

    // Convert current UTC time → Nepal local time
    const nowNepal = toZonedTime(new Date(), timeZone);

    // Start of today in Nepal
    const todayNepal = new Date(
      nowNepal.getFullYear(),
      nowNepal.getMonth(),
      nowNepal.getDate(),
      0, 0, 0, 0
    );

    // Start of tomorrow
    const tomorrowNepal = new Date(todayNepal);
    tomorrowNepal.setDate(todayNepal.getDate() + 1);

    // Convert those local times → UTC for DB query
    const todayUTC = fromZonedTime(todayNepal, timeZone);
    const tomorrowUTC = fromZonedTime(tomorrowNepal, timeZone);

    const [salesReport, paymentReport, expenseReport] = await Promise.all([
      client.sales.findMany({
        where: { createdAt: { gte: todayUTC, lt: tomorrowUTC } },include: { customer: true }, orderBy: {createdAt: "desc"}
      }),
      client.payment.findMany({
        where: { paidAt: { gte: todayUTC, lt: tomorrowUTC } }, include: { customer: true, recordedBy: {
            select: { id: true, name: true }
        }}, orderBy: {paidAt: "desc"}
      }),
      client.expenses.findMany({
        where: { createdAt: { gte: todayUTC, lt: tomorrowUTC } },include: { recordedBy: {
            select: { id: true, name: true }
        } }, orderBy: { createdAt: "desc"}
      }),
    ]);

    return {
      success: true,
      salesReport,
      paymentReport,
      expenseReport,
      range: { from: todayNepal.toISOString(), to: tomorrowNepal.toISOString() },
    };
  } catch (e: unknown) {
    // 👇 Fix TypeScript 'unknown' error
    const error = e instanceof Error ? e.message : String(e);
    console.error("Daily report error:", error);
    return { success: false, error };
  }
}
