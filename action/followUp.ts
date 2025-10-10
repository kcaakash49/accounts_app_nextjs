"use server"
import client from "@/db";

export async function followUp() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // start of tomorrow

    const customers = await client.customer.findMany({
      where: {
        dueDate: {
          gte: today,   // dueDate >= today 00:00
          lt: tomorrow  // dueDate < tomorrow 00:00
        }
      }
    });

    return {
        success: true,
        customers
    };
  } catch (e) {
    console.error(e);
    return {
        success: false
    };
  }
}
