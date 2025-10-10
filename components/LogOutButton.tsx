"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/auth/logout");
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.clear();
      router.push("/"); // redirect after logout
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Logout failed. Please try again.";
      toast.error(message);
    },
  });

  return (
    <button
  onClick={() => mutate()}
  disabled={isPending}
  className={`px-4 py-2 text-black rounded-lg transition-colors
    ${isPending 
      ? "bg-red-400 cursor-not-allowed opacity-70" 
      : "bg-red-200 hover:bg-red-700 cursor-pointer"}`}
>
  {isPending ? "Logging out..." : "Logout"}
</button>

  );
}
