
import { addSales } from "@/action/addSales";
import { useState } from "react";
import Loading from "./Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


interface AddDueFormProps {
  userID: number;
  onClose: () => void;
}

type PaymentStatus = "PAID" | "UNPAID";
type PaymentMethod = 'CASH' | 'ONLINE';

export default function AddSalesForm({ userID, onClose }: AddDueFormProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isPaid, setIsPaid] = useState<PaymentStatus>('UNPAID');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addSales,
    onSuccess: (data) => {
      toast.success(data.message || "Sales Added Successfully!!!")
      queryClient.invalidateQueries({
        queryKey: ["data-detail", userID.toString()]
      })
      queryClient.invalidateQueries({
        queryKey: ["daily-stats"]
      })
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Operation Failed!!!");
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saleData = {
      amount: amount,
      customerId: userID,
      note: note,
      paymentStatus: isPaid,
      paymentMethod: paymentMethod
    }

    mutate(saleData);
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

      <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded  ${isPending ? ' cursor-progress' : "cursor-pointer"}`} disabled={isPending}>
        {
          isPending ? <Loading /> : 'Add Sales'
        }
      </button>
    </form>
  );
}
