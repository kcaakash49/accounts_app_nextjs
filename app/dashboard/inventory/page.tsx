import Link from "next/link";
import { Plus, Package, AlertTriangle, Layers, ArrowRight } from "lucide-react";
import client from "@/db";

export default async function InventoryPage() {
  // 1. Fetch products, categories, and batches containing quantities and cost prices
  const productsFromDb = await client.product.findMany({
    include: {
      category: true,
      batches: {
        include: {
          vendor: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Map and compute stock statistics per product
  const products = productsFromDb.map((p) => {
    // Sum up totals across batches
    const currentQuantity = p.batches.reduce((sum, batch) => sum + batch.quantity, 0);

    // Calculate Weighted Average Cost Price across active stock batches
    let averageCostPrice = 0;
    if (currentQuantity > 0) {
      const totalValue = p.batches.reduce(
        (sum, batch) => sum + batch.quantity * Number(batch.costPrice),
        0
      );
      averageCostPrice = totalValue / currentQuantity;
    } else if (p.batches.length > 0) {
      // Fallback: If current quantity is 0, show the cost of the latest delivery batch
      averageCostPrice = Number(p.batches[p.batches.length - 1].costPrice);
    }

    // Resolve vendors
    const uniqueVendors = Array.from(new Set(p.batches.map((b) => b.vendor.name)));
    const vendorDisplay = uniqueVendors.length > 0 ? uniqueVendors.join(", ") : "No Active Vendor";

    return {
      ...p,
      quantity: currentQuantity,
      vendorDisplay,
      displayCost: averageCostPrice,
    };
  });

  // 3. Overall Stats Counter
  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity <= p.minStock).length;

  return (
    <div className="space-y-6 p-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Inventory Overview</h1>
          <p className="text-sm text-gray-500">Manage your stock pools, fiber deployments, and ISP hardware.</p>
        </div>
        <Link
          href="/dashboard/inventory/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Product Type
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Product Types</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Items in Stock</p>
            <p className="text-2xl font-bold text-gray-900">{totalItems.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          /* Empty State */
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-300">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-blue-900">No product definitions found</h3>
            <p className="text-gray-500 max-w-xs mt-2">
              Your catalog is empty. Setup baseline items like ONUs, patch cables, or overhead drops to start monitoring levels.
            </p>
            <Link
              href="/dashboard/inventory/add"
              className="mt-6 text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              Add your first product <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Table State */
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-50/50 text-blue-900 font-semibold border-b border-blue-100">
                <tr>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Total Stock Level</th>
                  <th className="px-6 py-4">Active Suppliers</th>
                  <th className="px-6 py-4">Avg Cost Price</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{item.name}</span>
                        <span className="text-xs text-gray-400 font-mono tracking-tighter uppercase">{item.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                        {item.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${item.quantity <= item.minStock ? 'text-rose-600' : 'text-gray-900'}`}>
                          {item.quantity}
                        </span>
                        {item.quantity <= item.minStock && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold uppercase animate-pulse">Low</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-[180px]" title={item.vendorDisplay}>
                      {item.vendorDisplay}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      Rs. {item.displayCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link href={`/dashboard/inventory/${item.id}`} className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50/0 group-hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                         View Details
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}