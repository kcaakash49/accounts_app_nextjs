import { expenseHistory } from "@/action/expenseHistory";
import DisplayError from "./DisplayError";
import ExpenseActions from "./ExpenseActions";
import { ExpenseType } from "@/types/expense";


export default function({expenses}: {expenses: ExpenseType[]}){
        return (
            <div className="">
            {/* Table view for medium and larger screens */}
            <div className="hidden md:block">
              <table className="min-w-full text-sm text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Note</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border hidden lg:table-cell">Recorded By</th>
                    <th className="px-4 py-2 border">Created At</th>
                    <th className="px-4 py-2 border">Total</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense : ExpenseType, index: number) => (
                    <tr key={expense.id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{expense.title}</td>
                      <td className="px-4 py-2 border">{expense.expenseType}</td>
                      <td className="px-4 py-2 border">Rs. {expense.amount}</td>
                      <td className="px-4 py-2 border">{expense.note || "—"}</td>
                      <td className="px-4 py-2 border">{expense.quantity}</td>
                      <td className="px-4 py-2 border hidden lg:table-cell">{expense.recordedBy?.name}</td>
                      <td className="px-4 py-2 border">{new Date(expense.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2 border">{expense.total}</td>
                      <td className="px-4 py-2 border"><ExpenseActions expense = {expense}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      
            {/* Card view for small screens */}
            <div className="block md:hidden rounded-2xl">
              {expenses.map((expense : ExpenseType) => (
                <div
                  key={expense.id}
                  className="rounded-2xl bg-gray-600 shadow-md p-4 text-white mb-2"
                >
                  <h2 className="text-lg font-semibold mb-2">{expense.title}</h2>
                  <div className="text-sm">
                    <p><strong>Amount:</strong> Rs. {expense.amount}</p>
                    <p><strong>Expense Type:</strong> {expense.expenseType}</p>
                    <p><strong>Recorded By:</strong>  {expense.recordedBy?.name}</p>
                    <p><strong>Note:</strong>  {expense.note}</p>
                    <p><strong>Date:</strong> {new Date(expense.createdAt).toLocaleString()}</p>
                    <p><strong>Quantity:</strong> {expense.quantity}</p>
                    <p><strong>Total:</strong>Rs. {expense.total}</p>
                    
                    <div className="mt-2">
                    <ExpenseActions expense={expense}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

}