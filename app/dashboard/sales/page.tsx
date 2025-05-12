import { salesHistory } from "@/action/salesHistory"
import DisplayError from "@/components/DisplayError";
import SalesList from "@/components/SalesList";


export default async function(){
    try {
        const res = await salesHistory();

        if(!res.success){
            <DisplayError error = "Something Happened"/>
        }

        if(!res.sales || res.sales.length === 0){
            return <DisplayError error = "No Record FOund !!!"/>
        }

        return <SalesList sales={res.sales}/>

    }catch(e){
        return <div>
            Internal Server Error
        </div>
    }
    
}