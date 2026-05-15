
import { addSales } from "@/action/addSales";
import { useState } from "react";
// import Loading from "./Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Loader } from "lucide-react";


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
      queryClient.invalidateQueries({
        queryKey: ["payment-history"]
      }),
      queryClient.invalidateQueries({
        queryKey: ["sales-history"]
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
    // <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
    //   <div>
    //     <label className="block">Amount</label>
    //     <input
    //       type="number"
    //       step="0.01"
    //       value={amount}
    //       onChange={(e) => setAmount(e.target.value)}
    //       required
    //       className="w-full border px-2 py-1 rounded"
    //     />
    //   </div>

    //   <div>
    //     <label className="block">Payment Status</label>
    //     <div>
    //       <select
    //         value={isPaid}
    //         className="w-full border rounded px-2 py-1"
    //         onChange={(e) => setIsPaid(e.target.value as PaymentStatus)}
    //       >
    //         <option value="PAID">PAID</option>
    //         <option value="UNPAID">NOT PAID</option>
    //       </select>

    //     </div>
    //     {
    //       isPaid === 'PAID' && <div>
    //         <label className="block">Payment Method</label>
    //         <div>
    //           <select

    //             value={paymentMethod}
    //             className="w-full border rounded px-2 py-1"
    //             onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
    //           >
    //             <option value="CASH">CASH</option>
    //             <option value="ONLINE">ONLINE</option>
    //           </select>

    //         </div>
    //       </div>

    //     }
    //   </div>

    //   <div>
    //     <label className="block">Note</label>
    //     <textarea
    //       value={note}
    //       onChange={(e) => setNote(e.target.value)}
    //       className="w-full border px-2 py-1 rounded"
    //     />
    //   </div>

    //   <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded  ${isPending ? ' cursor-progress' : "cursor-pointer"}`} disabled={isPending}>
    //     {
    //       isPending ? <Loading /> : 'Add Sales'
    //     }
    //   </button>
    // </form>
    <form onSubmit={handleSubmit} className="space-y-5">
  {/* Amount Input */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Transaction Amount</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rs.</span>
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        placeholder="0.00"
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
      />
    </div>
  </div>

  {/* Status & Method Grid */}
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Payment Status</label>
      <select
        value={isPaid}
        onChange={(e) => setIsPaid(e.target.value as PaymentStatus)}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
      >
        <option value="PAID">Paid</option>
        <option value="UNPAID">Unpaid</option>
      </select>
    </div>

    {isPaid === 'PAID' && (
      <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
        >
          <option value="CASH">Cash</option>
          <option value="ONLINE">Online</option>
        </select>
      </div>
    )}
  </div>

  {/* Notes Area */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Note (Optional)</label>
    <textarea
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Brief description of the sale..."
      rows={3}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm resize-none"
    />
  </div>

  {/* Action Buttons */}
  <div className="flex gap-3 pt-2">
    <button
      type="button"
      onClick={onClose}
      className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isPending}
      className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
    >
      {isPending ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Record Sale
        </>
      )}
    </button>
  </div>
</form>
  );
}
