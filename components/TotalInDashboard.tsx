import { totalDuesPayment } from "@/action/totalDuesPayment";
import StatCard from "./StatCard";

export default async function DashboardStats() {
  try {
    const res = await totalDuesPayment();

    if (res?.error) {
      return <div className="text-center text-red-500">Please try again later!</div>;
    }

    const stats = [
      { label: "Total Sales", value: res.totalSales?.toFixed(2) ?? "0.00", color: "#3b82f6" },
      { label: "Total Payment", value: res.totalPayment?.toFixed(2) ?? "0.00", color: "#10b981" },
      { label: "Remaining Dues", value: res.remainingDues?.toFixed(2) ?? "0.00", color: "#facc15" },
      { label: "Customers", value: res.customerCount ?? 0, color: "#ef4444" },
    ];

    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              delay={idx * 0.1}
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
