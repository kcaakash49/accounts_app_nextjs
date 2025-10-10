"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Loading from "./Loading";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: async({username, password}: {username: string, password: string}) => {
      const response = await axios.post("/api/auth/login", {
          username, password
        });
      
      return response
    },
    onSuccess: (response) => {
      toast.success(response.data.message);
      router.replace("/dashboard")
    },
    onError: (error: AxiosError<any>) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      toast.error(message);
    }
  })


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;
    loginMutation.mutate({username, password});


  };



  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="font-medium">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border rounded px-3 py-2"
          />
        </div>


        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center"
        >
          {loginMutation.isPending ? <Loading/> : "Submit"}
        </button>
      </form>
    </div>
  );
}
