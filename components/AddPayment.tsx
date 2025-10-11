


import { addPayment } from "@/action/addPayment";
import { useState } from "react";
import Loading from "./Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


interface AddDueFormProps {
  userID: number;
  onClose: () => void;
}

type PayMentMethodString = 'CASH' | 'ONLINE'

export default function AddPayment({ userID, onClose }: AddDueFormProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PayMentMethodString>('CASH');

  const queryClient = useQueryClient();


  const { mutate, isPending } = useMutation({
    mutationFn: addPayment,
    onSuccess: (result) => {
      toast.success(result.message || "Success");
      queryClient.invalidateQueries({
        queryKey: ["data-detail", userID.toString()]
      })
      queryClient.invalidateQueries({
        queryKey: ["daily-stats"]
      })
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Payment not done!!!")

    }

  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payData = {
      amount: amount,
      customerId: userID,
      note: note,
      paymentMethod: paymentMethod
    }
    mutate(payData);

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

      <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded ${isPending ? 'cursor-progress' : "cursor-pointer"}`} disabled={isPending}>
        {
          isPending ? <Loading /> : "Add Payment"
        }
      </button>
      
    </form>
  );
}
