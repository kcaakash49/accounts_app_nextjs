import { User } from "@/app/dashboard/customers/page";
import Link from "next/link";
import CustomerActions from "./CustomerActions";

type Props = {
  users: User[];
  page: number;
  pageSize: number;
};

export default function CustomerList({
  users,
  page,
  pageSize,
}: Props) {
  const hasNextPage = users.length === pageSize;
  const hasPrevPage = page > 1;

  return (
    <div className="w-full space-y-4">
      {/* Large screen table */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
        <table className="w-full table-auto border-collapse text-sm text-gray-600">
          <thead>
            <tr className="border-b border-blue-50 bg-blue-50/50 font-medium text-blue-900">
              <th className="text-left px-6 py-3.5 w-16">Sno.</th>
              <th className="text-left px-6 py-3.5">Name</th>
              <th className="text-left px-6 py-3.5">Address</th>
              <th className="text-left px-6 py-3.5">Contact</th>
              <th className="text-left px-6 py-3.5 hidden lg:table-cell w-40">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {users.map((user, index) => (
              <tr key={user.id} className="transition-colors hover:bg-blue-50/30">
                <td className="px-6 py-4 font-medium text-gray-400">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/customers/${user.id}`}
                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.address || "—"}</td>
                <td className="px-6 py-4 font-mono text-xs tracking-wider">{user.contact}</td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  {user.activeStatus === "ONLINE" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                      Offline
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Small screen cards */}
      <div className="sm:hidden space-y-3.5">
        {users.map((user, index) => (
          <div key={user.id} className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm text-sm text-gray-600 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-blue-50">
              <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                #{(page - 1) * pageSize + index + 1}
              </span>
              <div>
                {user.activeStatus === "ONLINE" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 border border-gray-100">
                    <span className="h-1 w-1 rounded-full bg-gray-400" />
                    Offline
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Name</span>
              <Link
                href={`/dashboard/customers/${user.id}`}
                className="font-semibold text-blue-600 hover:text-blue-800 text-base"
              >
                {user.name}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Contact</span>
                <span className="font-mono text-xs">{user.contact}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Address</span>
                <span className="text-gray-700 truncate block">{user.address || "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}