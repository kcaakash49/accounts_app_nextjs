import Link from "next/link";
import { Plus, Package, AlertTriangle, Layers, ArrowRight } from "lucide-react";
import client from "@/db";

export default async function InventoryPage() {
  const productsFromDb = await client.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      batches: {
        include: { vendor: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const products = productsFromDb.map((p) => {
    const currentQuantity = p.batches.reduce((sum, batch) => sum + batch.quantity, 0);
    let averageCostPrice = 0;
    if (currentQuantity > 0) {
      const totalValue = p.batches.reduce((sum, batch) => sum + batch.quantity * Number(batch.costPrice), 0);
      averageCostPrice = totalValue / currentQuantity;
    } else if (p.batches.length > 0) {
      averageCostPrice = Number(p.batches[p.batches.length - 1].costPrice);
    }

    const uniqueVendors = Array.from(new Set(p.batches.map((b) => b.vendor.name)));
    return {
      ...p,
      quantity: currentQuantity,
      vendorDisplay: uniqueVendors.length > 0 ? uniqueVendors.join(", ") : "No Active Vendor",
      displayCost: averageCostPrice,
    };
  });

  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity <= p.minStock).length;

  return (
    /* CRITICAL: Added w-full, max-w-full, and overflow-hidden to prevent horizontal scroll at the root */
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24 overflow-x-hidden">
      
      {/* Header Section: Stacked on mobile, row on tablet+ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-blue-900 truncate">Inventory Overview</h1>
          <p className="text-xs md:text-sm text-gray-500">Monitor stock levels and ISP hardware.</p>
        </div>
        <Link
          href="/dashboard/inventory/add"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Stats Cards: Responsive grid 1 -> 2 -> 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Product Types", val: products.length, icon: Layers, color: "blue" },
          { label: "Items in Stock", val: totalItems.toLocaleString(), icon: Package, color: "emerald" },
          { label: "Low Stock", val: lowStockCount, icon: AlertTriangle, color: "rose" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4 min-w-0">
            <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-gray-900 truncate">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-blue-200 py-16 text-center px-4">
            <Package className="w-12 h-12 text-blue-100 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">Your warehouse is currently empty.</p>
          </div>
        ) : (
          <>
            {/* MOBILE LIST: Visible only on < 768px */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {products.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                   {item.quantity <= item.minStock && (
                     <div className="absolute top-0 right-0 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase">Low Stock</div>
                   )}
                   <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase">{item.category.name}</p>
                        <h3 className="font-bold text-gray-900 pr-12">{item.name}</h3>
                        <p className="text-[9px] font-mono text-gray-400 uppercase">{item.sku}</p>
                      </div>
                      
                      <div className="flex items-end justify-between border-t border-slate-50 pt-3">
                        <div className="space-y-1">
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Current Pool</p>
                           <p className="text-xl font-black text-slate-800">{item.quantity} <span className="text-[10px] font-normal text-gray-400">pcs</span></p>
                        </div>
                        <Link 
                          href={`/dashboard/inventory/${item.id}`} 
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold active:scale-95"
                        >
                          Details
                        </Link>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE: Visible only on >= 768px */}
            <div className="hidden md:block bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-[11px] uppercase border-b">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4 hidden lg:inline-block">Category</th>
                      <th className="px-6 py-4">Stock Level</th>
                      <th className="px-6 py-4">Avg Cost</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono uppercase">{item.sku}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-500 hidden lg:inline-block">{item.category.name}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${item.quantity <= item.minStock ? 'text-rose-600' : 'text-gray-900'}`}>{item.quantity} units</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">Rs. {item.displayCost.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/dashboard/inventory/${item.id}`} className="text-blue-600 font-bold hover:underline">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}