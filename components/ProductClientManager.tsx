"use client";

import { useState, useTransition } from "react";
import { Package, Truck, History, PlusCircle, MinusCircle, AlertCircle, Calendar, ShieldCheck, X } from "lucide-react";
import { replenishStock, consumeStock } from "@/action/inventory";
import { toast } from "sonner";

export default function ProductClientManager({ product, initialVendors }: any) {
  const [isInwardOpen, setIsInwardOpen] = useState(false);
  const [isOutwardOpen, setIsOutwardOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Internal Modal Input States
  const [inwardForm, setInwardForm] = useState({ vendorId: "", batch: "", quantity: 0, costPrice: 0 });
  const [outwardForm, setOutwardForm] = useState({ quantity: 0, notes: "" });

  const currentStock = product.batches.reduce((sum: number, b: any) => sum + b.quantity, 0);
  const isLowStock = currentStock <= product.minStock;

  const handleInwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await replenishStock({ productId: product.id, ...inwardForm });
      if (res.success) {
        toast.success("Batch successfully recorded in warehouse register");
        setIsInwardOpen(false);
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleOutwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await consumeStock({
        productId: product.id,
        quantityToConsume: outwardForm.quantity,
        dispatchNotes: outwardForm.notes,
      });
      if (res.success) {
        toast.success("Stock dispatch successfully certified");
        setIsOutwardOpen(false);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="max-w-7xl p-4 md:p-6 space-y-6 pb-24">
      {/* UI Body layout remains identical to the previous step layout */}
      <div className="flex items-center gap-3">
        <div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold uppercase">{product.sku}</span>
          <h1 className="text-2xl font-bold text-blue-900 mt-1">{product.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Stock Control Center</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 border border-emerald-100 bg-emerald-50/20 rounded-xl flex items-start gap-3">
                <PlusCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 w-full">
                  <p className="font-bold text-emerald-950 text-sm">Replenish/Restock Batch</p>
                  <p className="text-xs text-gray-500">Log new incoming inventory received from suppliers.</p>
                  <button onClick={() => setIsInwardOpen(true)} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg mt-2 transition-all">
                    Open Inward Portal
                  </button>
                </div>
              </div>

              <div className="p-4 border border-rose-100 bg-rose-50/20 rounded-xl flex items-start gap-3">
                <MinusCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 w-full">
                  <p className="font-bold text-rose-950 text-sm">Deploy Items / Outward Log</p>
                  <p className="text-xs text-gray-500">Record stock issued to technicians for installations.</p>
                  <button onClick={() => setIsOutwardOpen(true)} className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-lg mt-2 transition-all">
                    Dispatch to Field
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Active Inventory Batches Table Block */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-blue-50">
              <h3 className="font-bold text-blue-900 flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500" /> Active Inventory Batches</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="px-6 py-3">Batch Code</th>
                    <th className="px-6 py-3">Vendor Reference</th>
                    <th className="px-6 py-3">Remaining Stock</th>
                    <th className="px-6 py-3">Batch Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {product.batches.map((batch: any) => (
                    <tr key={batch.id}>
                      <td className="px-6 py-4 font-mono font-bold text-blue-600 text-xs">{batch.batch}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{batch.vendor.name}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{batch.quantity} pcs</td>
                      <td className="px-6 py-4 text-gray-600">Rs. {Number(batch.costPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Log Tracker Display Blocks */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Available Pool</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{currentStock} <span className="text-sm font-normal text-gray-400">units</span></p>
              </div>
              <div className={`p-3 rounded-xl ${isLowStock ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-blue-50 text-blue-600"}`}><Package /></div>
            </div>
          </div>

          {/* Operations Audit log timeline container elements */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 border-b pb-2 text-sm uppercase tracking-wider"><History className="w-4 h-4" /> Operations Audit Log</h3>
            <div className="space-y-4 max-h-[380px] overflow-y-auto">
              {product.stockHistory.map((log: any) => (
                <div key={log.id} className="text-xs border-l-2 border-slate-100 pl-3 py-0.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${log.action === "INWARD" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{log.action} ({log.quantity})</span>
                  </div>
                  <p className="text-gray-700 font-medium">{log.note}</p>
                  <p className="text-[10px] text-gray-400">By {log.performedBy.username}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: INWARD PORTAL --- */}
      {isInwardOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleInwardSubmit} className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150">
            <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><PlusCircle /> Inward Stock Portal</h3>
              <button type="button" onClick={() => setIsInwardOpen(false)}><X /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Select Supplying Vendor</label>
                <select required onChange={(e) => {
                  const v = initialVendors.find((x: any) => x.id === e.target.value);
                  const yearMonth = `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
                  setInwardForm({
                    ...inwardForm,
                    vendorId: e.target.value,
                    batch: v ? `${v.name.substring(0, 2).toUpperCase()}-${yearMonth}` : ""
                  });
                }} className="w-full p-2.5 border rounded-xl bg-white text-sm">
                  <option value="">Choose Supplier...</option>
                  {initialVendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Calculated Batch Identification String</label>
                <input readOnly value={inwardForm.batch} placeholder="Select vendor to compute standard prefix..." className="w-full p-2.5 bg-gray-50 font-mono text-xs border rounded-xl text-blue-700 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Inward Quantity</label>
                  <input type="number" required min="1" onChange={(e) => setInwardForm({ ...inwardForm, quantity: parseInt(e.target.value) })} className="w-full p-2.5 border rounded-xl text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Unit Cost Price</label>
                  <input type="number" required min="0" step="0.01" onChange={(e) => setInwardForm({ ...inwardForm, costPrice: parseFloat(e.target.value) })} className="w-full p-2.5 border rounded-xl text-sm" />
                </div>
              </div>
              <button disabled={isPending} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-emerald-700 disabled:bg-gray-300">
                {isPending ? "Validating Entry..." : "Certify Warehouse Entry"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 2: OUTWARD PORTAL (DISPATCH) --- */}
      {isOutwardOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleOutwardSubmit} className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150">
            <div className="bg-rose-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><MinusCircle /> Dispatch to Field Channel</h3>
              <button type="button" onClick={() => setIsOutwardOpen(false)}><X /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Dispatch Units count</label>
                <input type="number" required min="1" max={currentStock} onChange={(e) => setOutwardForm({ ...outwardForm, quantity: parseInt(e.target.value) })} className="w-full p-2.5 border rounded-xl text-sm" />
                <p className="text-[10px] text-gray-400 mt-0.5">Maximum dynamic withdrawal limit: {currentStock} units</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Deployment Logs Description / Manifest Reference</label>
                <textarea required rows={3} placeholder="e.g., Assigned to Team Echo for Sector 3 fiber distribution lines expansion." onChange={(e) => setOutwardForm({ ...outwardForm, notes: e.target.value })} className="w-full p-2.5 border rounded-xl text-sm resize-none" />
              </div>
              <button disabled={isPending} className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-rose-700 disabled:bg-gray-300">
                {isPending ? "Processing Extraction..." : "Authorize Field Dispatch"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}