import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import jwt from "jsonwebtoken";
import NavLink from "@/components/NavLink";
import MobileSidebar from "@/components/MobileSidebar";
import Navbar from "@/components/Navbar";


export default async function DashLayout({children}: {children: ReactNode}) {
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
        
      //   <div className="flex h-screen bg-blue-600 text-white">
      //   <aside className="hidden md:flex md:flex-col w-64 shadow-lg p-4 space-y-4">
      //     <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      //     <NavLink href="/dashboard">Dashboard</NavLink>
      //     <NavLink href="/dashboard/customers">Customers</NavLink>
      //     <NavLink href="/dashboard/payment-history">Payment History</NavLink>
      //     <NavLink href="/dashboard/sales">Sales</NavLink>
      //   </aside>
  
      //   {/* Mobile Sidebar */}
      //   <MobileSidebar />
  
      //   <main className="flex-1 overflow-y-auto bg-white text-black">
      //     <Navbar/>
      //     {children}
      //     </main>
      // </div>

      <div className="h-screen flex flex-col">
      {/* Mobile Navbar - top bar */}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex md:flex-col w-64 shadow-lg p-4 space-y-4 bg-blue-600 text-white">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/dashboard/customers">Customers</NavLink>
          <NavLink href="/dashboard/payment-history">Payment History</NavLink>
          <NavLink href="/dashboard/sales">Sales</NavLink>
          <NavLink href="/dashboard/expenses">Expenses</NavLink>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white text-black">
          <Navbar />
          <div className="p-6 sm:p-10">
          {children}

          </div>
        </main>
      </div>
    </div>
        
    );
}