

import DailyStats from "@/components/DailyStats";
import FollowUp from "@/components/FollowUp";
import { SalesDashboard } from "@/components/SalesDashboard";
import TotalInDashboard from "@/components/TotalInDashboard";

export const revalidate = 60;

export default function (){
    return (
        <div>
            <TotalInDashboard/>
            <div className="border-t border-gray-200 my-4" />
            <FollowUp/>
            <div className="border-t border-gray-200 my-4" />
            <DailyStats/>
            
        </div>
    )
}