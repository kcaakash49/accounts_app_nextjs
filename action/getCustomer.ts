"use server"

import client from "@/db"

export async function getCustomer(){
    
    try {
        const users = await client.customer.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        // const finalizedUser = users?.map((user) => {
        //     const totalSales = user?.sales?.reduce((sum,sale) => {
        //         return sum + sale.amount;
        //     }, 0);

        //     const totalPayment = user?.payments?.reduce((sum, payment) => {
        //         return sum + payment.amountPaid;
        //     }, 0);

        //     const remainingDues = totalSales - totalPayment;
        //     return {
        //         ...user,
        //         remainingDues: remainingDues
        //     }


        // })
      

        return {
            users
        }

    }catch(e){
        return {
            error: "Something Happened",
            err: e,
            users:[]
        };
    }
}

