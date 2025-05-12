
"use server"

import client from "@/db";

export async function getCustomerbyId(id: number){
    try {
        const user = await client.customer.findUnique({
            where: {
                id
            },
            include: {
                sales: true,
                payments: true
            }
        })

        if (!user) {
            return {
              error: "User not found",
            };
          }


        return {
            user: user,
            message: "Success"
        };
    } catch(e){
        return {
            error: "Couldn't fetch data"
        }
    }
}