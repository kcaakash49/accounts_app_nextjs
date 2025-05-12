

import { getCustomer } from "@/action/getCustomer";
import AddCustomer from "@/components/AddCustomer";
import CustomerList from "@/components/CustomerList";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export type User = {
    id: number;
    name: string;
    contact: string;
    address: string | null;
    createdAt: Date;
    remainingDues: number;
    dueDate: Date | null;
};

type UserSchema =
    | { users: User[]; error?: undefined; err?: undefined }
    | { error: string; err: unknown; users: User[] };





export default async function () {
    try {
        const users: UserSchema = await getCustomer();
         

        if (!users?.users || users?.users.length === 0) {
            return (
                <div className="flex flex-col h-full items-center justify-center">
                    <AddCustomer/>
                    <div>No Customer Record</div>
                </div>

            )
        }



        return (
            <div>
                <AddCustomer/>
                <CustomerList users={users?.users}/>

            </div>
        )


    } catch (e) {
        return <div>Internal Error</div>
    }

}

