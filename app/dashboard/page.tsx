

import FollowUp from "@/components/FollowUp";
import TotalInDashboard from "@/components/TotalInDashboard";

export const revalidate = 60;

export default function (){
    return (
        <div>
            <TotalInDashboard/>
            <div className="border-t border-gray-200 my-10" />
            <FollowUp/>
        </div>
    )
}