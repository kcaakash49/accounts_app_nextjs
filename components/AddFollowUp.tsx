"use client";

import { addFollowupDate } from "@/action/addFollowupDate";
import { useState } from "react"
import Loading from "./Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FollowType {
  userId: number;
  onClose: () => void;
}

export default function ({ userId, onClose }: FollowType) {
  const [date, setDate] = useState<string>("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addFollowupDate,
    onSuccess: (result) => {
      toast.success(`Follow Up created at ${new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`)
      let id = userId.toString();
      
      queryClient.invalidateQueries({
        queryKey: ['data-detail', id],
        
      })
      // queryClient.refetchQueries({
      //   queryKey: ["data-detail", id]
      // })
      onClose();
    },
    onError: () => {
      toast.error("Couldn't add FollowUp")
    }

  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const followUpDate = date ? new Date(date) : null;
    if (!followUpDate) {
      toast.error("Please Select a follow-up date");
      return
    };
    const today = new Date();

    // Remove time portion from both dates
    today.setHours(0, 0, 0, 0);
    followUpDate.setHours(0, 0, 0, 0);

    if (followUpDate < today) {
      toast.error("Follow-up date must be after today");
      return;
    }
    mutate({ followUpDate, userId })

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div>
        <label className="block">FollowUp</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded" disabled={isPending}>
        {
          isPending ? <Loading /> : "Add follow"
        }
      </button>

    </form>
  )
}