"use server";

import client from "@/db";
import { fromZonedTime } from "date-fns-tz";

export async function followUp() {
  try {
    // Define Nepal time zone
    const timeZone = "Asia/Kathmandu";

    // Create start and end of today in Nepal time
    const nowNepal = new Date();
    const todayNepal = new Date(nowNepal);
    todayNepal.setHours(0, 0, 0, 0);

    const tomorrowNepal = new Date(todayNepal);
    tomorrowNepal.setDate(todayNepal.getDate() + 1);

    // Convert Nepal-local times to UTC for DB queries
    const todayUTC = fromZonedTime(todayNepal, timeZone);
    const tomorrowUTC = fromZonedTime(tomorrowNepal, timeZone);

    // Fetch customers with dueDate within today's range (Nepal local)
    const customers = await client.customer.findMany({
      where: {
        dueDate: {
          gte: todayUTC,   // dueDate >= today's 00:00 (Nepal)
          lt: tomorrowUTC  // dueDate < tomorrow's 00:00 (Nepal)
        }
      }
    });

    return {
      success: true,
      customers
    };
  } catch (e) {
    console.error("Error fetching follow-ups:", e);
    return {
      success: false
    };
  }
}
