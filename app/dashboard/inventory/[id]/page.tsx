import { notFound } from "next/navigation";
import client from "@/db";
import ProductClientManager from "@/components/ProductClientManager";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Fetch deep relations on the server side
  const rawProduct = await client.product.findUnique({
    where: { id },
    include: {
      category: true,
      batches: {
        include: { vendor: true },
        orderBy: { createdAt: "desc" },
      },
      stockHistory: {
        include: { performedBy: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!rawProduct) return notFound();

  // 2. Fetch all suppliers for the dropdown list
  const rawVendors = await client.vendor.findMany({
    orderBy: { name: "asc" },
  });

  // 3. SANITIZE PRODUCT: Convert Decimals to numbers and Dates to strings
  const sanitizedProduct = {
    ...rawProduct,
    createdAt: rawProduct.createdAt.toISOString(),
    updatedAt: rawProduct.updatedAt.toISOString(),
    batches: rawProduct.batches.map((batch) => ({
      ...batch,
      costPrice: Number(batch.costPrice), // Fixes the Decimal issue!
      createdAt: batch.createdAt.toISOString(),
    })),
    stockHistory: rawProduct.stockHistory.map((log) => ({
      ...log,
      createdAt: log.createdAt.toISOString(),
    })),
  };

  // 4. SANITIZE VENDORS: Convert any Date objects to plain strings
  const sanitizedVendors = rawVendors.map((vendor) => ({
    ...vendor,
    createdAt: vendor.createdAt.toISOString(),
    updatedAt: vendor.updatedAt.toISOString(),
  }));

  // 5. Pass clean, plain objects to the Client Component
  return (
    <ProductClientManager 
      product={sanitizedProduct} 
      initialVendors={sanitizedVendors} 
    />
  );
}