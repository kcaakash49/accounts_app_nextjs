import { expenseHistory } from "@/action/expenseHistory";
import DisplayError from "./DisplayError";
import ExpenseActions from "./ExpenseActions";
import { ExpenseType } from "@/types/expense";


export default async function(){
    try{
        const res = await expenseHistory();
        
        if(!res.success){
            <DisplayError error="Something Happened"/>
        }

        if(!res.data || res.data.length === 0){
            return <DisplayError error="No data Found"/>
        }

        return (
            <div className="p-4">
            {/* Table view for medium and larger screens */}
            <div className="hidden md:block">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-center">#</th>
                    <th className="p-2 text-center">Title</th>
                    <th className="p-2 text-center">Type</th>
                    <th className="p-2 text-center">Amount</th>
                    <th className="p-2 text-center">Note</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2 text-center hidden lg:table-cell">Recorded By</th>
                    <th className="p-2 text-center">Created At</th>
                    <th className="p-2 text-center">Total</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {res?.data?.map((expense : ExpenseType, index: number) => (
                    <tr key={expense.id} className="border-b dark:border-gray-700">
                      <td className="p-2 text-center">{index + 1}</td>
                      <td className="p-2 text-center">{expense.title}</td>
                      <td className="p-2 text-center">{expense.expenseType}</td>
                      <td className="p-2 text-center">Rs. {expense.amount}</td>
                      <td className="p-2 text-center">{expense.note || "—"}</td>
                      <td className="p-2 text-center">{expense.quantity}</td>
                      <td className="p-2 text-center hidden lg:table-cell">{expense.recordedBy?.name}</td>
                      <td className="p-2 text-center">{new Date(expense.createdAt).toLocaleString()}</td>
                      <td className="p-2 text-center">{expense.total}</td>
                      <td className="p-2 text-center"><ExpenseActions expense = {expense}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      
            {/* Card view for small screens */}
            <div className="block md:hidden space-y-4">
              {res?.data?.map((expense : ExpenseType) => (
                <div
                  key={expense.id}
                  className="rounded-2xl shadow-md p-4 "
                >
                  <h2 className="text-lg font-semibold mb-2">{expense.title}</h2>
                  <div className="text-sm text-gray-700">
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
    }catch(e){
        return (
            <DisplayError error="Internal Server Error!!!"/>
        )
    }

}