"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, Settings2, Truck, X, Trash2, Banknote, Calculator, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCategory, createProduct, createVendor } from "@/action/inventory";
import { toast } from "sonner";

interface CategoryData {
  name: string;
  description?: string;
}

export default function ProductForm({ initialCategories, initialVendors }: any) {
  const router = useRouter();

  // Data States
  const [categories, setCategories] = useState(initialCategories);
  const [vendors, setVendors] = useState(initialVendors);

  // Main Form States
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    vendorId: "",
    batch: "",
    quantity: 1,
    costPrice: 1,
    minStock: 5
  });

  // Dynamic Specs State (Key-Value Pairs)
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  // Modal States
  const [showCatModal, setShowCatModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [isPending, startTransition] = useTransition();


  // --- Handlers for Specs ---
  const addSpecField = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpecField = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };
// --- Unified Auto-Generation Hook ---
  useEffect(() => {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    const selectedVendor = vendors.find((v: any) => v.id === formData.vendorId);
    const selectedCat = categories.find((c: any) => c.id === formData.categoryId);

    // 1. Calculate the New Batch
    let calculatedBatch = "";
    if (selectedVendor) {
      calculatedBatch = `${selectedVendor.name.substring(0, 2).toUpperCase()}-${yearMonth}`;
    }

    // 2. Calculate the New SKU
    let calculatedSku = formData.sku;
    if (selectedCat) {
      const catPrefix = selectedCat.name.substring(0, 3).toUpperCase();
      
      // LOGIC: Update SKU if it's currently empty 
      // OR if the current SKU prefix doesn't match the newly selected category prefix
      if (!formData.sku || !formData.sku.startsWith(catPrefix)) {
        calculatedSku = `${catPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    // 3. Only trigger a state update if something actually changed to avoid infinite loops
    if (calculatedBatch !== formData.batch || calculatedSku !== formData.sku) {
      setFormData(prev => ({
        ...prev,
        batch: calculatedBatch,
        sku: calculatedSku
      }));
    }
  }, [formData.vendorId, formData.categoryId, vendors, categories]);

  // --- Submit Main Product ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert specs array to JSON object: [{key: "core", value: "12"}] -> {core: "12"}
    const specsJson = specs.reduce((acc: any, curr) => {
      if (curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {});
    startTransition(async () => {
      const payload = { ...formData, specs: specsJson };
      const res = await createProduct({formdata: payload});
      if (res.success) {
        toast.success("Product created successfully!");
        router.push("/dashboard/inventory");
      } else {
        toast.error(res.error || "Failed to create product");
      }
    });
}

  return (
    <div className="max-w-7xl pb-24 md:pb-10">
      {/* Mobile Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 font-semibold md:hidden px-4"
      >
        <ChevronLeft className="w-5 h-5" /> Back
      </button>

      <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6 md:space-y-8">

        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Product Name</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              type="text"
              placeholder="e.g. 12 Core Fiber Cable"
              className="w-full p-3 md:p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">SKU / Serial</label>
            <input
              disabled
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              type="text"
              placeholder="FC-12-001"
              className="w-full p-3 md:p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Batch Number</label>
            <input
              disabled
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              type="text"
              placeholder="Batch # (e.g. BATCH-001)"
              className="w-full p-3 md:p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-500" /> Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              min={1}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  quantity: val === "" ? 0 : parseInt(val)
                });
              }}
              className="w-full p-3 md:p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-500" /> Cost Price
            </label>
            <input
              type="number"
              min={1}
              value={formData.costPrice}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  costPrice: val === "" ? 0 : parseFloat(val)
                });
              }}
              className="w-full p-3 md:p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2 sm:col-span-2 md:col-span-1">
            <label className="text-sm font-bold text-gray-700">Min Stock Alert</label>
            <input
              type="number"
              min={1}
              value={formData.minStock}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  minStock: val === "" ? 0 : parseInt(val)
                });
              }}
              className="w-full p-3 md:p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Section 3: Relations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Category</label>
              <button
                type="button"
                onClick={() => setShowCatModal(true)}
                className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
              >
                + New Category
              </button>
            </div>
            <select
              required
              className="w-full p-3 md:p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Vendor</label>
              <button
                type="button"
                onClick={() => setShowVendorModal(true)}
                className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
              >
                + New Vendor
              </button>
            </div>
            <select
              required
              className="w-full p-3 md:p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
            >
              <option value="">Select Vendor</option>
              {vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>

        {/* Section 4: Dynamic JSON Specs Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <h3 className="text-xs md:text-sm font-bold text-blue-900 uppercase tracking-wider">Technical Specifications</h3>
            <button
              type="button"
              onClick={addSpecField}
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Row
            </button>
          </div>

          <div className="space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-gray-100">
                <input
                  placeholder="Key (e.g. Core)"
                  value={spec.key}
                  onChange={(e) => updateSpec(index, "key", e.target.value)}
                  className="w-full sm:flex-1 p-2.5 sm:p-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  placeholder="Value (e.g. 12)"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, "value", e.target.value)}
                  className="w-full sm:flex-1 p-2.5 sm:p-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeSpecField(index)}
                  className="self-end sm:self-auto p-2 text-rose-500 bg-rose-50 sm:bg-transparent rounded-lg hover:bg-rose-100 transition-all"
                >
                  <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Sticky on mobile, static on desktop */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:p-0 md:border-0 md:bg-transparent z-10">
          <button
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {isPending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {isPending ? "Saving Product..." : "Finalize & Save Product"}
          </button>
        </div>
      </form>

      {/* --- MODALS --- */}
      {showCatModal && (
        <QuickAddModal
          title="Add Category"
          icon={<Settings2 />}
          onClose={() => setShowCatModal(false)}
          onSave={async (data: CategoryData) => {
            const res = await createCategory(data);
            if (res.success && res.data) {
              toast.success("Category created successfully!");
              setCategories([...categories, res.data]);
              setFormData((prev) => ({
                ...prev,
                categoryId: res.data.id
              }));
              setShowCatModal(false);
            }
          }}
          fields={[
            { name: 'name', label: 'Category Name', placeholder: 'Fiber Cable' },
            { name: 'description', label: 'Description', placeholder: 'Description of the category' }
          ]}
        />
      )}

      {showVendorModal && (
        <QuickAddModal
          title="Add Vendor"
          icon={<Truck />}
          onClose={() => setShowVendorModal(false)}
          onSave={async (data: any) => {
            const res = await createVendor(data);
            if (res.success && res.data) {
              toast.success("Vendor created successfully!");
              setVendors([...vendors, res.data]);
              setFormData((prev) => ({
                ...prev,
                vendorId: res.data.id
              }));
              setShowVendorModal(false);
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

// Reusable Modal with Internal State
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