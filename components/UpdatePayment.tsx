import { useEffect, useState } from "react";
import Loading from "./Loading";
import { updatePayment } from "@/action/updatePayment";


interface UpdateSchema {
    amountPaid: number,
    paymentMethod: PaymentMethodSchema,
    note: string,
    paymentId: number
}
type PaymentMethodSchema = 'CASH' | 'ONLINE'

export default function UpdatePayment({payment}: any){

    const [updateData, setUpdateData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage]  = useState<null | string>(null);
    const [error, setError]  = useState<null | string>(null);
    useEffect(() => {
        setUpdateData(payment)
    },[payment])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const toUpdateData = {
                amountPaid: updateData.amountPaid,
                paymentMethod: updateData.paymentMethod,
                note: updateData.note,
                paymentId: updateData.id
            }
            const response = await updatePayment(toUpdateData);
            if(response.success && response.message){
                setMessage(response.message)
                setError(null)
            }else if (response.error){
                setError(response.error);
                setMessage(null);
            }
        }catch(e){
            setError("Internal Server Error");
            setMessage(null);
        }finally{
            setLoading(false);
        }
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        
        const { name, value } = e.target;
      
        // If the field is amountPaid, convert to number
        const updatedValue = name === "amountPaid" ? parseFloat(value) : value;
      
        setUpdateData((prev: any) => ({
          ...prev,
          [name]: updatedValue,
        }));
      };
  
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div>
        <label className="block">Amount Paid</label>
        <input
          type="number"
          step="0.01"
          value={updateData.amountPaid || ""}
          onChange={handleChange}
          name = "amountPaid"  
          required
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label htmlFor="payment-method">Payment Method</label>
        <div>
        <select
          name = "paymentMethod"
          value={updateData.paymentMethod || ""}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          
        >
          <option value="CASH">CASH</option>
          <option value="ONLINE">ONLINE</option>
        </select>

        </div>
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

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled = {loading}>
        {
          loading ? <Loading/> : "Update Payment"
        }
      </button>
      {message && <div className="p-4 text-center bg-green-600 text-white">{message}</div>}
      {error && <div className="p-4 text-center bg-red-600 text-white">{error}</div>}
    </form>
    )
   
    
}