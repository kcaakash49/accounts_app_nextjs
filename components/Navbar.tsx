import Link from "next/link";
import AdminInfo from "./AdminInfo";
import SearchComponent from "./SearchComponent";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
    return (
        <div className="bg-blue-600 text-white w-full">
            <div className="px-4 py-3 flex flex-col gap-4 sm:gap-0">
                {/* First Row */}
                <div className="flex justify-between items-center">
                    {/* Left: Add Customer Button */}
                    <MobileSidebar/>

                    {/* <Link
                        href="/dashboard/add-customer"
                        className="bg-blue-700 px-4 py-2 rounded-xl hover:bg-blue-500 text-white text-sm sm:text-base"
                    >
                        Add Customer
                    </Link> */}
                    <div className="hidden sm:block "></div>
                    <div className="hidden sm:block">
                        <SearchComponent />

                    </div>

                    {/* Right: Admin Info */}
                    <div>
                        <AdminInfo />
                    </div>
                </div>

                {/* Second Row: SearchComponent on small, center on larger screens */}
                <div className="w-full flex justify-center sm:hidden">
                    <div className="w-full sm:w-1/2">
                        <SearchComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}
