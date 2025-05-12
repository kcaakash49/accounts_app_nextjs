import { useEffect, useState } from "react";
import Loading from "./Loading";
import { updateSales } from "@/action/updataSales";


export default function UpdateSales ({sale}: any ){

    const [updateData, setUpdateData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage]  = useState<null | string>(null);
    const [error, setError]  = useState<null | string>(null);
    

    useEffect(() => {
        setUpdateData(sale);
        
    }, [sale]);

    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault();
        console.log(updateData)
        try {
            setLoading(true);
            const toUpdateData = {
                amount: updateData.amount,
                note : updateData.note,
                salesId: updateData.id

            }

            const res = await updateSales(toUpdateData);
            setMessage(res.success && res.message ? res.message : null);
            setError(!res.success ? "Failed to Update" : null);


        }catch(e){
            setError("Internal Server Error");
            setMessage(null)
        }finally {
            setLoading(false);
        }


    }

    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        const updateValue = name === "amount" ? Number(value) : value;

        setUpdateData((prev:any) => ({
            ...updateData,
            [name] : updateValue
        }))
    }

   

    // if(!updateData) return <div>Loading.....</div>

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
        <div>
          <label className="block">Amount Paid</label>
          <input
            type="number"
            step="0.01"
            value={updateData?.amount || ""}
            onChange={handleChange}
            name = "amount"  
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
  
        <div>
          <label className="block">Note</label>
          <textarea
            value={updateData.note || ""}
            name = "note"
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
  
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900" disabled = {loading}>
          {
            loading ? <Loading/> : "Update Sales"
          }
        </button>
        {message && <div className="p-4 text-center bg-green-600 text-white">{message}</div>}
        {error && <div className="p-4 text-center bg-red-600 text-white">{error}</div>}
      </form>
    )

}