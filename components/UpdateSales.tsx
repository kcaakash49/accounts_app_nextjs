import { useEffect, useState } from "react";
import Loading from "./Loading";
import { updateSales } from "@/action/updataSales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export default function UpdateSales({ sale, onClose }: any) {

  const [updateData, setUpdateData] = useState<any>({});

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateSales,
    onSettled: (data) => {
      if (data?.success) {
        toast.success(data.message || "Update Successful!!!");
        queryClient.invalidateQueries({
          queryKey: ["daily-stats"]
        });
        queryClient.invalidateQueries({
          queryKey: ["data-detail", sale?.customer?.id.toString()]
        })
        onClose();

      }else {
        toast.error(data?.error || "Something happened!!!")
      }
    }
  })


  useEffect(() => {
    setUpdateData(sale);

  }, [sale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toUpdateData = {
      amount: updateData.amount,
      note: updateData.note,
      salesId: updateData.id

    }
    mutate(toUpdateData)




  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updateValue = name === "amount" ? Number(value) : value;

    setUpdateData((prev: any) => ({
      ...updateData,
      [name]: updateValue
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
          name="amount"
          required
          className="w-full border px-2 py-1 rounded"
        />
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

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900" disabled={isPending}>
        {
         isPending ? <Loading /> : "Update Sales"
        }
      </button>
    
    </form>
  )

}