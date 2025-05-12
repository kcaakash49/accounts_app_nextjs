'use client';

import { signUpAction } from "@/action/signupaction";
import { useActionState } from "react";
import { useFormState } from "react-dom";

export type FormState = 
  | { message: string; error: null }
  | { message: null; error: string };

export const initialState: FormState = { message: null, error: "" };

export default function SignUp() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create an Account</h2>

      {state.message && (
        <p className="mb-4 text-center text-green-600 font-medium">
          {state.message}
        </p>
      )}
      {state.error && (
        <p className="mb-4 text-center text-red-600 font-medium">
          {state.error}
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
