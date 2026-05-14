import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import jwt from "jsonwebtoken";
import NavLink from "@/components/NavLink";
import MobileSidebar from "@/components/MobileSidebar";
import Navbar from "@/components/Navbar";
import LogoutButton from "@/components/LogOutButton";
import AdminSidebarClient from "@/components/Sidebar";



export default async function DashLayout({ children }: { children: ReactNode }) {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/");

  try {
    // 3. Verify using jsonwebtoken (Node.js runtime)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

  } catch (err) {
    // 4. If invalid/expired, back to login
    return redirect("/");
  }

  return (
    // <div className="h-screen flex flex-col">
    //   {/* Mobile Navbar - top bar */}

    //   <div className="flex flex-1">
    //     {/* Desktop Sidebar */}
    //     <aside className="hidden lg:flex md:flex-col w-64 shadow-lg p-4 space-y-4 bg-blue-600 text-white">
    //       <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
    //       <NavLink href="/dashboard">Dashboard</NavLink>
    //       <NavLink href="/dashboard/customers">Customers</NavLink>
    //       <NavLink href="/dashboard/payment-history">Payment History</NavLink>
    //       <NavLink href="/dashboard/sales">Sales</NavLink>
    //       <NavLink href="/dashboard/expenses">Expenses</NavLink>
    //       <LogoutButton />
    //     </aside>

    //     {/* Main Content */}
    //     <main className="flex-1 overflow-y-auto bg-white text-black">
    //       <Navbar />
    //       <div className="p-6 sm:p-10">
            
    //           {children}
            

    //       </div>
    //     </main>
    //   </div>
    // </div>
    <div className="min-h-screen flex bg-white">
        <AdminSidebarClient />
        {/* added ml:64 to compensate with sidebar width */}
        <div className="flex-1 flex flex-col min-h-0 md:ml-64">
          <main className="flex-1 pt-16 md:pt-0">

            <Navbar />
            <div className="p-6 sm:p-10">
              {children}
            </div>
          </main>
          <footer className="flex-shrink-0 text-center border-t p-2  border-secondary-200 dark:border-secondary-700 fixed bottom-0 left-0 right-0">
            {/* <Footer /> */}
            <br></br>
            <span>&copy; 2026 Nice IT Solution Pvt. Ltd.</span>
            <span className="hidden sm:inline">|</span>
            <span>All Rights Reserved</span>
          </footer>
        </div>
      </div>

  );
}