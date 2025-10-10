import { followUp } from "@/action/followUp";
import FollowUpTable from "./FollowUpTable";
import { fetchAdminInfo } from "@/action/fetchAdminInfo";


export default async function FollowUp() {
    const result = await followUp();
    const userInfo = await fetchAdminInfo();
    if (result.success) {
        return (
            <FollowUpTable customers={result.customers || []}/>
        )

    } else {
        return <div>Something Happened!!!</div>
    }
}