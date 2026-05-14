"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";
import LogoutButton from "./LogOutButton";
import SearchComponent from "./SearchComponent";

const navSections = [
  { name: "Dashboard", path: "/dashboard", accessibleRoles: ["admin"] },
  { name: "Customers", path: "/dashboard/customers", accessibleRoles: ["admin"] },
  { name: "Payment History", path: "/dashboard/payment-history", accessibleRoles: ["admin", "staff"] },

  { name: "Sales", path: "/dashboard/sales", accessibleRoles: ["admin"] },
  { name: "Inventory", path: "/dashboard/inventory", accessibleRoles: ["admin"] },
  { name: "Expense", path: "/dashboard/expenses", accessibleRoles: ["admin"] },
];



export default function AdminSidebarClient() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-blue-600 border-b border-gray-300 px-4 py-3 flex items-center justify-between z-50">
        <button
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* <h2 className="text-lg font-semibold">
          Welcome
        </h2> */}
        <SearchComponent />

        {/* Empty div for flex spacing */}
        <div className="w-10"></div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {/* remove md:static so navbar is independent of children height  */}
      <nav
        className={`fixed inset-y-0 top-0 left-0 w-64 bg-blue-600 text-white p-6 flex flex-col z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:mt-0 mt-16`}

      >
        {/* Hidden on mobile since we have the mobile navbar */}
        <h2 className="hidden md:block text-lg sm:text-xl md:text-2xl font-bold mb-5 md:mb-8">
          Welcome
        </h2>

        <div className="flex flex-col space-y-2 text-sm sm:text-base">
          {navSections.map((section) =>
          (
            <Link
              key={section!.path} href={section!.path!}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 ${pathname === section!.path
                ? "bg-gray-100 text-black shadow-sm"
                : "text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
                }`}
            >
              {section!.name}
            </Link>
          )
          )}
        </div>

        <div className="mt-auto flex flex-col space-y-3 text-sm">
          <LogoutButton/>
         
        </div>
      </nav>
    </>
  );
}