"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";
import AddFollowUp from "./AddFollowUp";
import Modal from "./ModalComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDueStatus } from "@/action/updateDueStatus";
import { toast } from "sonner";
import Loading from "./Loading";
import Link from "next/link";

interface Customer {
  id: number;
  name: string;
  contact: string;
  secondContact: string | null;
  address: string | null;
}

interface CustomerTableProps {
  customers: Customer[];
}

export default function FollowUpTable({ customers }: CustomerTableProps) {
  const [followUpModal, setFollowUpModal] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateDueStatus,
    onSettled: (data) => {
      if (data?.success) {
        toast.success("User Updated Successfully!!!");
        queryClient.invalidateQueries({
          queryKey: ["data-detail", dropdownOpen?.toString()],
        });
        setDropdownOpen(null);
      } else {
        toast.error("Operation Failed!!!");
      }
    },
  });

  const toggleDropdown = (e: React.MouseEvent, id: number) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const openFollowUpModal = (id: number) => {
    setCustomerId(id);
    setFollowUpModal(true);
    setDropdownOpen(null);
  };

  const markAsPaid = (id: number) => {
    const confirmed = confirm("Are You Sure?");
    if (!confirmed) return;
    mutate(id);
  };

  if(customers.length === 0) return null;

  return (
    <div className="relative">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
        Customer Follow-Ups
      </h1>
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Contact</th>
              <th className="px-4 py-2 text-left text-gray-700">Secondary Contact</th>
              <th className="px-4 py-2 text-left text-gray-700">Address</th>
              <th className="px-4 py-2 text-left text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-2">{customer.name}</td>
                <td className="px-4 py-2">{customer.contact}</td>
                <td className="px-4 py-2">{customer.secondContact || "-"}</td>
                <td className="px-4 py-2">{customer.address || "-"}</td>
                <td className="px-4 py-2 relative">
                  <button
                    onClick={(e) => toggleDropdown(e, customer.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Action
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4 mt-4 border rounded-2xl border-gray-300 p-2">
        {customers.map((customer, index) => (
          <div
            key={customer.id}
            className="border border-gray-400 rounded-lg p-4 text-sm relative"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">#{index + 1}</span>
              <button
                onClick={(e) => toggleDropdown(e, customer.id)}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
              >
                <Calendar className="w-5 h-5 text-blue-600" /> Action
              </button>
            </div>
            <p>
              <strong>Name:</strong>{" "}
              <Link href={`/dashboard/customers/${customer.id}`} className="hover:underline text-blue-600">
                {customer.name}
              </Link>
            </p>
            <p>
              <strong>Contact:</strong> {customer.contact}
            </p>
            <p>
              <strong>Secondary Contact:</strong> {customer.secondContact || "-"}
            </p>
            <p>
              <strong>Address:</strong> {customer.address || "-"}
            </p>

            {/* Dropdown inside card for mobile */}
            {dropdownOpen === customer.id && (
              <div className="absolute right-2 top-10 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-blue-100"
                  onClick={() => openFollowUpModal(customer.id)}
                >
                  Update FollowUp
                </button>
                <div className="border-t border-gray-200 my-1" />
                <button
                  className="w-full text-left px-4 py-2 hover:bg-green-100"
                  onClick={() => markAsPaid(customer.id)}
                  disabled={isPending}
                >
                  {isPending ? <Loading /> : "Mark as paid"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Dropdown */}
      {dropdownOpen && window.innerWidth >= 640 && (
        <div
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-50 w-40"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          <button
            className="w-full text-left px-4 py-2 hover:bg-blue-100"
            onClick={() => openFollowUpModal(dropdownOpen)}
          >
            Update FollowUp
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            className="w-full text-left px-4 py-2 hover:bg-green-100"
            onClick={() => markAsPaid(dropdownOpen)}
            disabled={isPending}
          >
            {isPending ? <Loading /> : "Mark as paid"}
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={followUpModal} onClose={() => setFollowUpModal(false)}>
        {customerId && (
          <AddFollowUp userId={customerId} onClose={() => setFollowUpModal(false)} />
        )}
      </Modal>
    </div>
  );
}
