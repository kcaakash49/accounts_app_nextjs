import FormForProduct from "@/components/FormForProduct";
import ProductForm from "@/components/ProductForm";
import db from "@/db"

export default async function AddProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } });
  const vendors = await db.vendor.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="p-2 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Add New Product</h1>
        <p className="text-sm text-gray-500">Register new equipment or cables to your stock.</p>
      </header>

      <FormForProduct
        initialCategories={categories} 
      />
    </div>
  );
}