import { User } from "@/app/dashboard/customers/page";
import Link from "next/link";

export default function CustomerList({ users }: { users: User[] }) {
  return (
    <div className="w-full px-4">
      {/* Large screen table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm rounded-lg overflow-hidden border">
          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Address</th>
              <th className="text-left px-4 py-2">Contact</th>
              <th className="text-left px-4 py-2">Remaining Due</th>
              <th className="text-left px-4 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/dashboard/customers/${user.id}`}
                    className="hover:underline text-blue-600"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="px-4 py-2">{user.address || "-"}</td>
                <td className="px-4 py-2">{user.contact}</td>
                <td className="px-4 py-2 text-red-600 font-semibold">
                  Rs. {user.remainingDues.toFixed(2) ?? 0}
                </td>
                <td className="px-4 py-2">
                  {user.dueDate
                    ? new Date(user.dueDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Small screen cards */}
      <div className="sm:hidden space-y-4 mt-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 text-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">#{index + 1}</span>
              <span className="text-red-600 font-semibold">
                Rs. {user.remainingDues.toFixed(2) ?? 0}
              </span>
            </div>
            <p>
              <strong>Name:</strong>{" "}
              <Link
                href={`/dashboard/customers/${user.id}`}
                className="hover:underline text-blue-600"
              >
                {user.name}
              </Link>
            </p>
            <p>
              <strong>Contact:</strong> {user.contact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
