'use client';

import { useState } from "react";
import { Menu } from "lucide-react"; // optional: install lucide-react for icons
import NavLink from "./NavLink";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false)
  return (
    <div className="lg:hidden p-4 bg-blue-600 shadow flex justify-between items-center">
      <button onClick={() => setOpen(!open)} className="text-gray-700">
        <Menu className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute top-16 left-0 bg-blue-500 shadow-lg p-4 space-y-4 z-50 w-full">
          <NavLink href="/dashboard" onClick = {handleClose}>Dashboard</NavLink>
          <NavLink href="/dashboard/customers" onClick = {handleClose}>Customers</NavLink>
          <NavLink href="/dashboard/payment-history" onClick = {handleClose}>Payment History</NavLink>
          <NavLink href="/dashboard/sales" onClick = {handleClose}>Sales</NavLink>
          <NavLink href="/dashboard/expenses" onClick={handleClose}>Expenses</NavLink>
        </div>
      )}
    </div>
  );
}