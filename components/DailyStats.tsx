"use client";

import { dailyReport } from "@/action/dailyreport";
import { useQuery } from "@tanstack/react-query";
import SalesList from "./SalesList";
import PaymentsList from "./PaymentLists";
import ExpenseList from "./ExpenseList";

export default function DailyStats() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["daily-stats"],
        queryFn: dailyReport,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false
    })

    if (isLoading || isError) return null;

    if (!data?.success) {
        return <div>Something happened</div>
    }

    if (data?.success) {
        const { salesReport, paymentReport, expenseReport } = data;
        return (
            <div>
                {salesReport && salesReport.length > 0 && (
                    <div>
                        <h2 className="font-bold text-center mb-2">Today's Sale</h2>
                        <SalesList sales={salesReport} />
                    </div>
                )}
                <div className="h-2"> </div>
                {paymentReport && paymentReport.length >0 && (
                    <div>
                        <h2 className="font-bold text-center mb-2">Today's Payment Collection</h2>
                        <PaymentsList data = {paymentReport}/>
                    </div>
                )}
                <div className="h-2"></div>
                {expenseReport && expenseReport.length > 0 && (
                    <div>
                        <h2 className="font-bold text-center mb-2">Expense Registered Today</h2>
                        <ExpenseList expenses={expenseReport}/>
                    </div>
                )}

            </div>
        )
    }

}
