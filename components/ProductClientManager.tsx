"use client";

import { useState, useTransition } from "react";
import { Package, Truck, History, PlusCircle, MinusCircle, AlertCircle, Calendar, ShieldCheck, X, RefreshCw } from "lucide-react";
import { replenishStock, consumeStock, processVerifiedReturn, createVendor } from "@/action/inventory";
import { toast } from "sonner";

export default function ProductClientManager({ product, initialVendors }: any) {
  const [isInwardOpen, setIsInwardOpen] = useState(false);
  const [isOutwardOpen, setIsOutwardOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [vendors, setVendors] = useState(initialVendors);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [returnForm, setReturnForm] = useState({
    quantity: 0,
    notes: "",
  });

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
        closeInwardPortal();
      } else {
        toast.error(res.error);
      }
    });
  };

  const canReturnLog = (log: any) => {
    if (log.action !== "OUTWARD") return false;
    if (Math.abs(log.quantity) === 0) return false; // Already fully returned

    const loggedTime = new Date(log.createdAt).getTime();
    const now = new Date().getTime();
    const hoursElapsed = (now - loggedTime) / (1000 * 60 * 60);

    return hoursElapsed <= 24;
  };

  const closeInwardPortal = () => {
    setInwardForm({
      vendorId: "",
      batch: "",
      quantity: 0,
      costPrice: 0
    });
    setIsInwardOpen(false);
  };

  const closeReturnPortal = () => {
    setReturnForm({
      quantity: 0,
      notes: "",
    });
    setSelectedLog(null);
    setIsReturnOpen(false);
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

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog) return;

    startTransition(async () => {
      const res = await processVerifiedReturn({
        logId: selectedLog.id,
        productId: product.id,
        quantityToReturn: returnForm.quantity,
        returnNotes: returnForm.notes,
      });

      if (res.success) {
        toast.success("Return certified. Stock numbers updated successfully.");
        closeReturnPortal();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="max-w-7xl p-4 md:p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold uppercase">{product.sku}</span>
          <h1 className="text-2xl font-bold text-blue-900 mt-1">{product.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6 min-w-0">

          {/* Stock Control Center */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Stock Control Center</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

              {/* Inward / Restock Card */}
              <div className="p-4 border border-emerald-100 bg-emerald-50/20 rounded-xl flex flex-col sm:flex-row items-start gap-3 min-w-0">
                <PlusCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 w-full min-w-0 flex flex-col items-start">
                  <p className="font-bold text-emerald-950 text-sm break-words">Replenish/Restock Batch</p>
                  <p className="text-xs text-gray-500 break-words">Log new incoming inventory received from suppliers.</p>
                  <button
                    onClick={() => setIsInwardOpen(true)}
                    className="w-full sm:w-auto text-center text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-2 rounded-lg mt-2 transition-all active:scale-95 whitespace-nowrap"
                  >
                    Open Inward Portal
                  </button>
                </div>
              </div>

              {/* Outward / Dispatch Card */}
              <div className="p-4 border border-rose-100 bg-rose-50/20 rounded-xl flex flex-col sm:flex-row items-start gap-3 min-w-0">
                <MinusCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 w-full min-w-0 flex flex-col items-start">
                  <p className="font-bold text-rose-950 text-sm break-words">Deploy Items / Outward Log</p>
                  <p className="text-xs text-gray-500 break-words">Record stock issued to technicians for installations.</p>
                  <button
                    onClick={() => setIsOutwardOpen(true)}
                    className="w-full sm:w-auto text-center text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-2 rounded-lg mt-2 transition-all active:scale-95 whitespace-nowrap"
                  >
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
                  {product.batches.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-sm text-gray-400 italic">No active stock batches available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Added: Item Parameters / Technical Specifications Block */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Item Parameters</h3>
            {product.specs && Object.keys(product.specs).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(product.specs as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-0">
                    <p className="text-xs text-gray-400 capitalize truncate" title={key}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="font-bold text-slate-800 text-sm mt-0.5 break-words">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic py-2">No technical metadata configured for this product.</p>
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
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

          {/* Operations Audit log timeline */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 border-b pb-2 text-sm uppercase tracking-wider"><History className="w-4 h-4" /> Operations Audit Log</h3>
            <div className="space-y-4 max-h-[380px] overflow-y-auto">
              {product.stockHistory.map((log: any) => {
                const eligible = canReturnLog(log);

                return (
                  <div key={log.id} className="text-xs border-l-2 border-slate-100 pl-3 py-1 space-y-1 group relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${log.action === "INWARD" ? "bg-emerald-50 text-emerald-700" :
                        log.action === "OUTWARD" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                        }`}>
                        {log.action} ({log.quantity})
                      </span>

                      {eligible && (
                        <button
                          onClick={() => {
                            setSelectedLog(log);
                            setIsReturnOpen(true);
                          }}
                          className="text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold px-2 py-0.5 rounded transition-all active:scale-95 shadow-sm"
                        >
                          Return Item
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 font-medium break-words">{log.note}</p>
                    <p className="text-[10px] text-gray-400">By {log.performedBy.username} • {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                );
              })}
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
              <button type="button" onClick={closeInwardPortal}><X /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700">Set Supplying Vendor</label>
                  <button
                    type="button"
                    onClick={() => {
                      closeInwardPortal();
                      setIsInwardOpen(false);
                      setIsVendorModalOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    + New Vendor
                  </button>
                </div>
                <select required value={inwardForm.vendorId} onChange={(e) => {
                  const v = vendors.find((x: any) => x.id === e.target.value);
                  const yearMonth = `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
                  setInwardForm({
                    ...inwardForm,
                    vendorId: e.target.value,
                    batch: v ? `${v.name.substring(0, 2).toUpperCase()}-${yearMonth}` : ""
                  });
                }} className="w-full p-2.5 border rounded-xl bg-white text-sm">
                  <option value="">Choose Supplier...</option>
                  {vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Calculated Batch Identification String</label>
                <input readOnly value={inwardForm.batch} placeholder="Select vendor to compute standard prefix..." className="w-full p-2.5 bg-gray-50 font-mono text-xs border rounded-xl text-blue-700 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Inward Quantity</label>
                  <input type="number" required min="1" value={inwardForm.quantity || ""} onChange={(e) => setInwardForm({ ...inwardForm, quantity: parseInt(e.target.value) })} className="w-full p-2.5 border rounded-xl text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Unit Cost Price</label>
                  <input type="number" required min="0" step="0.01" value={inwardForm.costPrice || ""} onChange={(e) => setInwardForm({ ...inwardForm, costPrice: parseFloat(e.target.value) })} className="w-full p-2.5 border rounded-xl text-sm" />
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

      {/* --- MODAL 3: RETURN PORTAL --- */}
      {isReturnOpen && selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleReturnSubmit} className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150">
            <div className="bg-amber-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><RefreshCw className="w-5 h-5" /> Return to Inventory Portal</h3>
              <button type="button" onClick={closeReturnPortal}><X /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Original Dispatch Reference</p>
                <p className="text-xs text-gray-700 font-medium italic">"{selectedLog.note}"</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Quantity being Returned</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={Math.abs(selectedLog.quantity)}
                  value={returnForm.quantity || ""}
                  onChange={(e) => setReturnForm({ ...returnForm, quantity: parseInt(e.target.value) })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                  placeholder={`Max allowed: ${Math.abs(selectedLog.quantity)} units...`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Reason / Return Notes</label>
                <textarea
                  required
                  rows={3}
                  value={returnForm.notes}
                  placeholder="e.g., Returned by Tech Ram—Client subscriber canceled contract before installation."
                  onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm resize-none"
                />
              </div>
              <button disabled={isPending} className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-amber-700 disabled:bg-gray-300">
                {isPending ? "Processing Return..." : "Accept Items Back Into Stock"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isVendorModalOpen && (
        <QuickAddModal
          title="Add Vendor"
          icon={<Truck />}
          onClose={() => setIsVendorModalOpen(false)}
          onSave={async (data: any) => {
            const res = await createVendor(data);
            if (res.success && res.data) {
              toast.success("Vendor created successfully!");
              setVendors([...vendors, res.data]);
              setIsVendorModalOpen(false);
            }
          }}
          fields={[
            { name: 'name', label: 'Vendor Name', placeholder: 'Global Fiber Ltd' },
            { name: 'address', label: 'Address', placeholder: 'Kathmandu, Nepal' },
            { name: 'contact', label: 'Contact', placeholder: '98********' },
            { name: 'vatNumber', label: 'VAT Number (Optional)', placeholder: '600123456' },
            { name: 'email', label: 'Email (Optional)', placeholder: 'akc@gmail.com' },
          ]}
        />
      )}
    </div>
  );
}


function QuickAddModal({ title, icon, onClose, fields, onSave }: any) {
  const [modalData, setModalData] = useState<any>({});
  const [isPending, startTransition] = useTransition();

  const handleModalSave = async () => {
    startTransition(async () => {
      await onSave(modalData);
    });
  };

  return (
    <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="font-bold">{title}</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 opacity-70 hover:opacity-100" /></button>
        </div>
        <div className="p-6 space-y-4">
          {fields.map((f: any) => (
            <div key={f.name} className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">{f.label}</label>
              <input
                type="text"
                onChange={(e) => setModalData({ ...modalData, [f.name]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-2.5 text-gray-500 font-medium hover:bg-gray-100 rounded-xl">Cancel</button>
            <button
              onClick={handleModalSave}
              disabled={isPending}
              className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 shadow-md"
            >
              {isPending ? "Saving..." : "Save Info"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}