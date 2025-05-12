
import { addSales } from "@/action/addSales";
import { useState } from "react";
import Loading from "./Loading";


interface AddDueFormProps {
  userID: number;
  setRefreshKey: () => void;
}

type PaymentStatus = "PAID" | "UNPAID";
type PaymentMethod = 'CASH' | 'ONLINE';

export default function AddSalesForm({ userID, setRefreshKey }: AddDueFormProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isPaid, setIsPaid] = useState<PaymentStatus>('UNPAID');
  const [message, setMessage] = useState<null | String>(null);
  const [error, setError] = useState<null | String>(null);
  const [paymentMethod,setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const saleData = {
        amount: amount,
        customerId: userID,
        note: note,
        paymentStatus: isPaid,
        paymentMethod: paymentMethod
      }

      const res = await addSales(saleData);
      if (res.message) {
        setMessage(res.message);
        setError(null);
        setRefreshKey();
      } else if (res.error) {
        setError(res.error)
        setMessage(null)
        console.error(res.err)
      }

    } catch (e) {
      setError("Internal Server Error")
      setMessage(null)
    }finally{
      setLoading(false);
    }



  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div>
        <label className="block">Amount</label>
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
        <label className="block">Payment Status</label>
        <div>
          <select
            value={isPaid}
            className="w-full border rounded px-2 py-1"
            onChange={(e) => setIsPaid(e.target.value as PaymentStatus)}
          >
            <option value="PAID">PAID</option>
            <option value="UNPAID">NOT PAID</option>
          </select>

        </div>
        {
          isPaid === 'PAID' && <div>
          <label className="block">Payment Method</label>
          <div>
          <select
           
            value={paymentMethod}
            className="w-full border rounded px-2 py-1"
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            <option value="CASH">CASH</option>
            <option value="ONLINE">ONLINE</option>
          </select>
  
          </div>
        </div>
  
        }
      </div>

      <div>
        <label className="block">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {
          loading ? <Loading/> : 'Add Sales'
        }
      </button>
      {message && <div className="p-4 text-center bg-green-600 text-white">{message}</div>}
      {error && <div className="p-4 text-center bg-red-600 text-white">{error}</div>}
    </form>
  );
}
