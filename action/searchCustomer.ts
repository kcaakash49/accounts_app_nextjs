"use server";

import client from "@/db";

export async function searchCustomer(search: string) {
  
  try {
    const customers = await client.customer.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { contact: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        sales: true,
        payments: true,
      },
    });

    // const formattedCustomers = customers.map((user) => {
    //   const totalSales = user?.sales?.reduce((sum, sale) => {
    //     return sum + sale.amount;
    //   }, 0);

    //   const totalPayment = user?.payments?.reduce((sum, payment) => {
    //     return sum + payment.amountPaid;
    //   }, 0);

    //   const remainingDues = totalSales - totalPayment;

    //   const serializedUser = {
    //     ...user,
    //     remainingDues
    //   };
    //   return serializedUser;
    // });

    return {
      success: true,
      message: "Search Successful",
      customers
    };
  } catch (e) {
    throw new Error("Something Happened")
  }
}
