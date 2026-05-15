"use client";

import { editProduct } from "@/action/inventory";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function EditProductForm({ initialData, initcategories }: any) {
    const [formData, setFormData] = useState({
        productId: initialData.id || "",
        name: initialData.name || "",
        sku: initialData.sku || "",
        categoryId: initialData.categoryId || "",
        minStock: initialData.minStock || 0,
    });
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [categories, setCategories] = useState(initcategories || []);
    useEffect(() => {
        const now = new Date();
        const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
        const selectedCat = categories.find((c: any) => c.id === formData.categoryId);
    
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
        if (calculatedSku !== formData.sku) {
          setFormData(prev => ({
            ...prev,
            sku: calculatedSku
          }));
        }
      }, [formData.categoryId, categories]);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data to Save:", formData);
        startTransition(async() => {
           const res = await editProduct({ formData });
           if(res.success) {
            router.push(`/dashboard/inventory/${formData.productId}`);
            toast.success("Product edited successfully!");
            return;
           }
           toast.error(res.error || "Failed to edit product. Please try again.");

        });
      }

    return (
        <div className="max-w-yxl pb-24 mb:pb-10">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                            className="w-full cursor-not-allowed p-3 md:p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Category</label>
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
        </div>
    )
}