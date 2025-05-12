"use server"
import client from '@/db';

export async function paymentHistory(){
    try {
        const data = await client.payment.findMany({
            orderBy: {
                paidAt: 'desc'
            },
            include: {
                customer: true,
                recordedBy: true
            }     
        });

        
        
        return {
            status: true,
            data
        }
    }catch(e) {
        console.error(e);
        return {
            status: false
        }
    }
}