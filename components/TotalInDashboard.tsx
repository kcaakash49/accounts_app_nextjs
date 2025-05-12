import { totalDuesPayment } from "@/action/totalDuesPayment";
import AnimatedStat from "./AnimateStats";


export default async function () {
    try {
        const res = await totalDuesPayment();

        if (res?.error) {
            return <div className="text-center text-red-500">Please try again later!</div>;
        }

        const stats = [
            { label: "Total Sales", value: res.totalSales ?? 0, color: "#3b82f6" },   // blue-500
            { label: "Total Payment", value: res.totalPayment ?? 0, color: "#10b981" }, // green-500
            { label: "Remaining Dues", value: res.remainingDues ?? 0, color: "#facc15" }, // yellow-400
            { label: "Customers", value: res.customerCount ?? 0, color: "#ef4444" }, // red-500
        ];

        return (
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
                    {stats.map((stat, index) => (
                        <AnimatedStat
                            key={index}
                            label={stat.label}
                            value={stat.value.toFixed(2)}
                            delay={index * 0.1}
                            ringColor={stat.color}
                        />
                    ))}
                </div>

            </div>
        );
    } catch (e) {
        return (
            <div className="flex items-center justify-center h-40 text-red-500">
                Internal Server Error
            </div>
        );
    }
}
