"use server";

import prisma from "@/db";

export async function getSalesStats() {
  // 1️⃣ Today's sales
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todaySales = await prisma.sales.findMany({
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2️⃣ Last 7 days totals using SQL aggregation
  const last7Days: { date: string; total: number }[] = await prisma.$queryRaw`
    SELECT 
      TO_CHAR("createdAt", 'YYYY-MM-DD') AS date,
      SUM(amount) AS total
    FROM "Sales"
    WHERE "createdAt" >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY date
    ORDER BY date;
  `;

  // 3️⃣ Last 6 months totals using SQL aggregation
  const last6Months: { month: string; total: number }[] = await prisma.$queryRaw`
    SELECT
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month,
      SUM(amount) AS total
    FROM "Sales"
    WHERE "createdAt" >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
    GROUP BY month
    ORDER BY month;
  `;

  return {
    todaySales,
    last7Days,
    last6Months,
  };
}
