import Link from "next/link";
import PaymentActions from "./PaymentActions";

type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

type Customer = {
  id: number;
  name: string;
  contact: string;
  address: string | null;
  status: PaymentStatus;
  createdAt: Date;
  dueDate?: Date | null;
};

type SaleSchema = {
  id: number;
  customerId: number;
  amount: number;
  note?: string | null;
  createdAt: Date;
  customer: Customer;
};

export default function SalesList({ sales }: { sales: SaleSchema[] }) {
  // Helper for color coding payment status badges
  const getStatusBadge = (status: PaymentStatus) => {
    const styles = {
      PAID: "bg-emerald-50 text-emerald-700 ring-emerald-700/10",
      PARTIAL: "bg-amber-50 text-amber-700 ring-amber-700/10",
      UNPAID: "bg-rose-50 text-rose-700 ring-rose-700/10",
    };

    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Table view for medium and larger screens */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
        <table className="w-full table-auto border-collapse text-sm text-gray-600">
          <thead>
            <tr className="border-b border-blue-50 bg-blue-50/50 font-medium text-blue-900">
              <th className="px-5 py-3.5 text-left w-12">#</th>
              <th className="px-5 py-3.5 text-left">Customer Name</th>
              <th className="px-5 py-3.5 text-left">Contact</th>
              <th className="px-5 py-3.5 text-left">Amount</th>
              <th className="px-5 py-3.5 text-left">Note</th>
              <th className="px-5 py-3.5 text-left">Sales At</th>
              <th className="px-5 py-3.5 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {sales.map((sale, index) => (
              <tr key={sale.id} className="transition-colors hover:bg-blue-50/30">
                <td className="px-5 py-4 font-medium text-gray-400">{index + 1}</td>
                <td className="px-5 py-4">
                  <Link 
                    href={`/dashboard/customers/${sale.customer.id}`} 
                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                  >
                    {sale.customer.name}
                  </Link>
                </td>
                <td className="px-5 py-4 font-mono text-xs tracking-wider text-gray-500">
                  {sale.customer.contact}
                </td>
                <td className="px-5 py-4 font-bold text-gray-900">
                  Rs. {Number(sale.amount).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-4 text-gray-500 max-w-[150px] truncate" title={sale.note || ""}>
                  {sale.note || "—"}
                </td>
                <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(sale.createdAt).toLocaleString("en-US", {
                    timeZone: "Asia/Kathmandu",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-5 py-4 text-center">
                  <PaymentActions isSales={true} sale={sale} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked view for small screens */}
      <div className="block md:hidden space-y-4">
        {sales.map((sale, index) => (
          <div 
            key={sale.id} 
            className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm text-sm text-gray-600 space-y-3"
          >
            {/* Mobile Header */}
            <div className="flex justify-between items-center pb-2 border-b border-blue-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                  #{index + 1}
                </span>
                <Link 
                  href={`/dashboard/customers/${sale.customer.id}`}
                  className="font-bold text-blue-600 hover:text-blue-800 text-base hover:underline"
                >
                  {sale.customer.name}
                </Link>
              </div>
              {getStatusBadge(sale.customer.status)}
            </div>

            {/* Mobile Content Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-1">
              <div>
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                  Amount
                </span>
                <span className="font-bold text-gray-900 text-base">
                  Rs. {Number(sale.amount).toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                  Contact
                </span>
                <span className="font-mono text-xs text-gray-700 block mt-1">
                  {sale.customer.contact}
                </span>
              </div>

              <div className="col-span-2">
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                  Sales At
                </span>
                <span className="text-xs text-gray-700">
                  {new Date(sale.createdAt).toLocaleString("en-US", {
                    timeZone: "Asia/Kathmandu",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {sale.note && (
                <div className="col-span-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Note
                  </span>
                  <p className="text-xs text-gray-600 italic">"{sale.note}"</p>
                </div>
              )}
            </div>

            {/* Mobile Footer Actions */}
            <div className="pt-3 border-t border-blue-50 flex justify-end items-center">
              <PaymentActions isSales={true} sale={sale} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}