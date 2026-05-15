import EditProductForm from "@/components/EditProductForm";
import client from "@/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: PageProps) {
    const { id } = await params;

    // 1. Fetch deep relations on the server side
    const rawProduct = await client.product.findUnique({
        where: { id },
        include: {
            category: true,
        }
    });
    

    if (!rawProduct) return notFound();
    const categories = await client.category.findMany({ orderBy: { name: 'asc' } });

    return (
        <EditProductForm initialData={rawProduct} initcategories={categories} />
    )

}