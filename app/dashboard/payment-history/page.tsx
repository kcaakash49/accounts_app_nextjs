import { paymentHistory } from "@/action/paymentHistory"
import DisplayError from "@/components/DisplayError";
import PaymentsList from "@/components/PaymentLists";


export default async function (){
    try{
        const res = await paymentHistory();

        if(!res.status){
            return <DisplayError error="Something Happened"/>
        }

        if(!res.data || res?.data?.length === 0){
            return <DisplayError error="No user Found !!!"/>
        }

        return (
            <PaymentsList data = {res.data}/>
        )

    }catch(e){
        return <div>
            Internal Server Error
        </div>
    }
}



