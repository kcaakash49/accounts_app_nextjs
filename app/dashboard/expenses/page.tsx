import { expenseHistory } from "@/action/expenseHistory";
import AddExpenses from "@/components/AddExpenses";
import ExpenseList from "@/components/ExpenseList";
import LinkButton from "@/components/LinkButton";



export default async function () {
    try {
        const res = await expenseHistory();

        if (res.success) {
            return (
                <div>
                    <LinkButton href="/dashboard/add-expense" label="Add Expense"/>
                    <div className="h-2"></div>
                    {
                        res?.data && <ExpenseList expenses={res.data} />
                    }

                </div>

            )
        }
    } catch (e) {
        return null;
    }
}