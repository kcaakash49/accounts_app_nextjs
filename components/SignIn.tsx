"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Loading from "./Loading";

export default function LoginForm() {
  const [message, setMessage] = useState<null | String>(null);
  const [error, setError] = useState<null | String>(null);
  const [loading,setLoading] = useState(false);
  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const username = e.currentTarget.username.value;
      const password = e.currentTarget.password.value;

      const response = await axios.post("/api/auth/login", {
        username, password
      });
      if (response?.data && response?.data?.message) {
        setError(null);
        setMessage(response?.data?.message)
      }

      router.push("/dashboard")

    } catch (e: any) {
      console.log(e.response.data.error);
      if (e.response && e.response?.data && e.response?.data?.error) {
        setError(e.response?.data?.error)
        setMessage(null)

      }
    }finally {
      setLoading(false)
    }

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

        {message && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded text-center">
            {error}
          </div>
        )}


        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center"
        >
          {loading ? <Loading/> : "Submit"}
        </button>
      </form>
    </div>
  );
}
