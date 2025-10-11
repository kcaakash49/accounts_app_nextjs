import Link from "next/link";
import PaymentActions from "./PaymentActions";

type Customer = {
  id: number;
  name: string;
  contact: string;
  address: string | null;
  status: PaymentStatus;
  createdAt: Date;
  dueDate?: Date | null;

}

type SaleSchema = {
  id: number;
  customerId: number;
  amount: number;
  note?: string | null;
  createdAt: Date;
  customer: Customer;
}

type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID';




export default function ({ sales }: { sales: SaleSchema[] }) {
  return (
    <div>
      <div className="hidden md:block">
        <table className="min-w-full text-sm text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Customer Name</th>
              <th className="px-4 py-2 border hidden md:table-cell">Contact</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border hidden md:table-cell">Note</th>
              <th className="px-4 py-2 border hidden md:table-cell">Sales At</th>
              <th className="px-4 py-2 border hidden md:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={sale.id} className="border-t">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">
                  <Link href={`/dashboard/customers/${sale.customer.id}`} className="hover:underline hover:text-blue-600">
                    {sale.customer.name}
                  </Link>
                </td>
                <td className="px-4 py-2 border hidden md:table-cell">{sale.customer.contact}</td>

                <td className="px-4 py-2 border">{sale.amount}</td>
                <td className="px-4 py-2 border hidden md:table-cell">
                  {sale.note && sale.note.length > 20
                    ? sale.note.slice(0, 20) + "..."
                    : sale.note || "—"}
                </td>
                <td className="px-4 py-2 border hidden md:table-cell">
                  {new Date(sale.createdAt).toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })}
                </td>
                <td className="px-4 py-2 border hidden md:table-cell"><PaymentActions isSales={true} sale={sale} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden space-y-4">
        {sales.map((sale: SaleSchema) => (
          <div key={sale.id} className="shadow-md p-4 text-black rounded-2xl">
            <h2 className="text-lg font-semibold mb-2">{sale.customer.name}</h2>
            <div className="text-sm overflow-auto">
              <p><strong>Name: </strong>{sale.customer.name}</p>
              <p><strong>Contact: </strong>{sale.customer.contact}</p>
              <p><strong>Amount: </strong>{sale.amount}</p>
              <p><strong>Note: </strong>{sale.note && sale.note.length > 20
                ? sale.note.slice(0, 20) + "..."
                : sale.note || "—"}</p>
              <p><strong>Sales At: </strong>{new Date(sale.createdAt).toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}