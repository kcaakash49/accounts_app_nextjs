import { useEffect, useState } from "react";
import Loading from "./Loading";
import { updatePayment } from "@/action/updatePayment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


interface UpdateSchema {
  amountPaid: number,
  paymentMethod: PaymentMethodSchema,
  note: string,
  paymentId: number
}
type PaymentMethodSchema = 'CASH' | 'ONLINE'

export default function UpdatePayment({ payment, onClose }: any) {

  const [updateData, setUpdateData] = useState<any>({});

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updatePayment,
    onSettled: (data) => {
      if (data?.success) {
        toast.success(data.message || "Operation Succeeded!!!");
        queryClient.invalidateQueries({
          queryKey: ["daily-stats"]
        });
        queryClient.invalidateQueries({
          queryKey: ["data-detail", payment?.customer?.id.toString()]
        })
        onClose();
      } else {
        toast.error(data?.error || "Operation Unsuccessful!!!")
      }
    }
  })

  useEffect(() => {
    setUpdateData(payment)
  }, [payment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toUpdateData = {
      amountPaid: updateData.amountPaid,
      paymentMethod: updateData.paymentMethod,
      note: updateData.note,
      paymentId: updateData.id
    }
    mutate(toUpdateData);

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
          name="amountPaid"
          required
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label htmlFor="payment-method">Payment Method</label>
        <div>
          <select
            name="paymentMethod"
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
          name="note"
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isPending}>
        {
          isPending ? <Loading /> : "Update Payment"
        }
      </button>
    </form>
  )


}