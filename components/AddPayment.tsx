


import { addPayment } from "@/action/addPayment";
import { useState } from "react";
import Loading from "./Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "lucide-react";


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
      queryClient.invalidateQueries({
        queryKey: ["payment-history"]
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
    // <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
    //   <div>
    //     <label className="block">Amount Paid</label>
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
    //     <label htmlFor="payment-method">Payment Method</label>
    //     <div>
    //       <select
    //         id="payment-method"
    //         value={paymentMethod}
    //         className="w-full border rounded px-2 py-1"
    //         onChange={(e) => setPaymentMethod(e.target.value as PayMentMethodString)}
    //       >
    //         <option value="CASH">CASH</option>
    //         <option value="ONLINE">ONLINE</option>
    //       </select>

    //     </div>
    //   </div>




    //   <div>
    //     <label className="block">Note</label>
    //     <textarea
    //       value={note}
    //       onChange={(e) => setNote(e.target.value)}
    //       className="w-full border px-2 py-1 rounded"
    //     />
    //   </div>

    //   <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded ${isPending ? 'cursor-progress' : "cursor-pointer"}`} disabled={isPending}>
    //     {
    //       isPending ? <Loading /> : "Add Payment"
    //     }
    //   </button>
      
    // </form>
    <form 
  onSubmit={handleSubmit} 
  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5"
>
  {/* Amount Input */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
      Amount Paid
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm transition-colors group-focus-within:text-blue-600">
        Rs.
      </div>
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        placeholder="0.00"
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
      />
    </div>
  </div>

  {/* Payment Method Selector */}
  <div className="space-y-1.5">
    <label htmlFor="payment-method" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
      Payment Method
    </label>
    <div className="relative">
      <select
        id="payment-method"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value as PayMentMethodString)}
        className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-700 cursor-pointer"
      >
        <option value="CASH">CASH</option>
        <option value="ONLINE">ONLINE</option>
      </select>
      {/* Custom Chevron icon since appearance-none removes the default one */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>

  {/* Note Textarea */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
      Transaction Note
    </label>
    <textarea
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Optional details about this payment..."
      rows={3}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-600 resize-none"
    />
  </div>

  {/* Submit Button */}
  <button 
    type="submit" 
    disabled={isPending}
    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 
      ${isPending 
        ? 'bg-slate-100 text-slate-400 cursor-progress' 
        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] cursor-pointer'
      }`}
  >
    {isPending ? (
      <>
        <Loader className="w-4 h-4 animate-spin" />
        <span>Processing...</span>
      </>
    ) : (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Add Payment
      </>
    )}
  </button>
</form>
  );
}
