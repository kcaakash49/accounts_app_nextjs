import { getSalesStats } from "@/action/salesStats";



export async function SalesDashboard() {
    const result = await getSalesStats();
    console.log(result)

    return <div>Hello</div>
}