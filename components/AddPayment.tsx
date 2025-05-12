


import { addPayment } from "@/action/addPayment";
import { useState } from "react";
import Loading from "./Loading";


interface AddDueFormProps {
  userID: number;
  setRefreshKey: () => void;
}

type PayMentMethodString = 'CASH' | 'ONLINE'

export default function AddPayment({ userID, setRefreshKey }: AddDueFormProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PayMentMethodString>('CASH');
  const [message, setMessage] = useState<null | String>(null);
  const [error, setError] = useState<null | String>(null);
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        setLoading(true);
        const payData = {
            amount: amount,
            customerId: userID,
            note: note,
            paymentMethod: paymentMethod
        }
        const res = await addPayment(payData);
        if(res.message){
            setMessage(res.message)
            setError(null);
            setRefreshKey();
            
        }else if(res.error){
            setError(res.error);
            setMessage(null);
            
        }

    }catch(e){
        setError("Internal Server Error!!!")
    }finally{
      setLoading(false);
    }
  
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div>
        <label className="block">Amount Paid</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label htmlFor="payment-method">Payment Method</label>
        <div>
        <select
          id="payment-method"
          value={paymentMethod}
          className="w-full border rounded px-2 py-1"
          onChange={(e) => setPaymentMethod(e.target.value as PayMentMethodString)}
        >
          <option value="CASH">CASH</option>
          <option value="ONLINE">ONLINE</option>
        </select>

        </div>
      </div>




      <div>
        <label className="block">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled = {loading}>
        {
          loading ? <Loading/> : "Add Payment"
        }
      </button>
      {message && <div className="p-4 text-center bg-green-600 text-white">{message}</div>}
      {error && <div className="p-4 text-center bg-red-600 text-white">{error}</div>}
    </form>
  );
}
