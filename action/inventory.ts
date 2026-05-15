"use server";
import client from "@/db";
import { slugify } from "@/lib/slugify";
import { StockAction } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CategoryData {
  name: string;
  description?: string;
}

interface VendorData {
  name: string;
  address: string;
  contact: string;
  vatNumber?: string;
  email?: string;
}

interface ProductData {
  name: string;
  categoryId: string;
  sku: string;
  minStock: number;
  specs: Record<string, any>;
}

interface DecodedSchema extends JwtPayload {
  id: number;
  username: string;
}

export async function createCategory(data: CategoryData) {
  try {
    const slug = slugify(data.name);

    // Check if a category with the same slug already exists
    const existingCategory = await client.category.findUnique({
      where: { slug },
    });
    if (existingCategory) {
      return {
        success: false,
        error: "Category with this name already exists",
      };
    }

    const newCategory = await client.category.create({
      data: {
        name: data.name,
        description: data.description || "",
        slug,
      },
    });
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function createVendor(data: VendorData) {
  try {
    const newVendor = await client.vendor.create({
      data: {
        name: data.name,
        address: data.address,
        contact: data.contact,
        vatNumber: data.vatNumber || null,
        email: data.email || null,
      },
    });
    return { success: true, data: newVendor };
  } catch (error) {
    console.error("Error creating vendor:", error);
    return { success: false, error: "Failed to create vendor" };
  }
}

export async function createProduct({ formdata }: { formdata: ProductData }) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const result = await client.$transaction(async (prisma) => {
      const newProduct = await prisma.product.create({
        data: {
          name: formdata.name,
          categoryId: formdata.categoryId,
          sku: formdata.sku,
          minStock: formdata.minStock,
          specs: formdata.specs,
        },
      });
      return { success: true, message: "Product created successfully!" };
    });

    return result;
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

// --- 1. INWARD PORTAL ACTION (RESTOCK) ---
export async function replenishStock({
  productId,
  vendorId,
  batch,
  quantity,
  costPrice,
}: {
  productId: string;
  vendorId: string;
  batch: string;
  quantity: number;
  costPrice: number;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, error: "Unauthorized" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded !== "object" || !("id" in decoded))
      return { success: false, error: "Invalid identity" };

    await client.$transaction(async (prisma) => {
      // Create a brand new batch pool
      const checkBatch = await prisma.stockBatchTable.findFirst({
        where: {
          productId,
          batch,
        },
      });

      if (checkBatch) {
        await prisma.stockBatchTable.update({
          where: { id: checkBatch.id},
          data: { quantity: {increment:quantity}},
        });
        await prisma.stockLog.create({
          data: {
            productId,
            quantity,
            action: "INWARD",
            note: `Restocked batch ${batch}`,
            performedById: decoded.id,
          },
        });
        return;
      }

      await prisma.stockBatchTable.create({
        data: {
          productId,
          vendorId,
          batch,
          quantity,
          costPrice,
        },
      });

      // Append immutable footprint inside historical trail logs
      await prisma.stockLog.create({
        data: {
          productId,
          quantity,
          action: "INWARD",
          note: `Restocked batch ${batch}`,
          performedById: decoded.id,
        },
      });
    });

    revalidatePath(`/dashboard/inventory/${productId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Database transaction failure" };
  }
}

// --- 2. OUTWARD PORTAL ACTION (DISPATCH TO FIELD) ---
export async function consumeStock({
  productId,
  quantityToConsume,
  dispatchNotes,
}: {
  productId: string;
  quantityToConsume: number;
  dispatchNotes: string;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, error: "Unauthorized" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded !== "object" || !("id" in decoded))
      return { success: false, error: "Invalid identity" };

    const result = await client.$transaction(async (prisma) => {
      // Find active batches for this product ordered by oldest first (FIFO - First In First Out)
      const activeBatches = await prisma.stockBatchTable.findMany({
        where: { productId, quantity: { gt: 0 } },
        orderBy: { createdAt: "asc" },
      });

      const totalAvailable = activeBatches.reduce(
        (sum, b) => sum + b.quantity,
        0,
      );
      if (totalAvailable < quantityToConsume) {
        throw new Error(`Insufficient stock. Available: ${totalAvailable}`);
      }

      let remainingToDeduct = quantityToConsume;

      // Deduct from batches sequentially (FIFO cycle strategy)
      for (const batch of activeBatches) {
        if (remainingToDeduct <= 0) break;

        if (batch.quantity >= remainingToDeduct) {
          // Current batch has enough units to satisfy remaining deduction
          await prisma.stockBatchTable.update({
            where: { id: batch.id },
            data: { quantity: batch.quantity - remainingToDeduct },
          });
          remainingToDeduct = 0;
        } else {
          // Drain current batch completely and move to next oldest batch
          remainingToDeduct -= batch.quantity;
          await prisma.stockBatchTable.update({
            where: { id: batch.id },
            data: { quantity: 0 },
          });
        }
      }

      // Write outbound profile footprint log
      await prisma.stockLog.create({
        data: {
          productId,
          quantity: -quantityToConsume, // Log as deduction balance
          action: "OUTWARD",
          note: dispatchNotes || "Dispatched to field technician",
          performedById: decoded.id,
        },
      });
    });

    revalidatePath(`/dashboard/inventory/${productId}`);
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: error.message || "Dispatch operation failed",
    };
  }
}

//unused
export async function returnStock({
  productId,
  quantityToReturn,
  returnNotes,
}: {
  productId: string;
  quantityToReturn: number;
  returnNotes: string;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, error: "Unauthorized" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded !== "object" || !("id" in decoded)) {
      return { success: false, error: "Invalid identity" };
    }

    await client.$transaction(async (prisma) => {
      // 1. Find the latest batch for this product to put the item back into
      const latestBatch = await prisma.stockBatchTable.findFirst({
        where: { productId },
        orderBy: { createdAt: "desc" }, // Put it back into the newest batch pool
      });

      if (!latestBatch) {
        throw new Error("No active batch found to assign this return to.");
      }

      // 2. Add the quantity back into that batch
      await prisma.stockBatchTable.update({
        where: { id: latestBatch.id },
        data: {
          quantity: {
            increment: quantityToReturn,
          },
        },
      });

      // 3. Create the positive footprint trail log marked as RETURN
      await prisma.stockLog.create({
        data: {
          productId,
          quantity: quantityToReturn, // Stored as a positive addition back to stock
          action: "RETURN",
          note:
            returnNotes || "Unused equipment returned from field deployment",
          performedById: decoded.id,
        },
      });
    });

    revalidatePath(`/dashboard/inventory/${productId}`);
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: error.message || "Failed to process stock return",
    };
  }
}

export async function processVerifiedReturn({
  productId,
  logId,
  quantityToReturn,
  returnNotes,
}: {
  productId: string;
  logId: string;
  quantityToReturn: number;
  returnNotes: string;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, error: "Unauthorized" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded !== "object" || !("id" in decoded))
      return { success: false, error: "Invalid token" };

    await client.$transaction(async (prisma) => {
      // 1. Fetch the exact dynamic outward log row
      const originalLog = await prisma.stockLog.findUnique({
        where: { id: logId },
      });

      if (!originalLog || originalLog.action !== "OUTWARD") {
        throw new Error("Target transaction dispatch log not found.");
      }

      // 2. Enforce the 24-hour cutoff safety gate
      const loggedTime = new Date(originalLog.createdAt).getTime();
      const now = new Date().getTime();
      const hoursElapsed = (now - loggedTime) / (1000 * 60 * 60);

      if (hoursElapsed > 24) {
        throw new Error(
          "Return window expired. Materials out past 24 hours must be balanced via manual adjustment.",
        );
      }

      // 3. Enforce capacity bounds (original outward quantity is logged as a negative value, e.g., -5)
      const maxAllowedReturn = Math.abs(originalLog.quantity);
      if (quantityToReturn > maxAllowedReturn) {
        throw new Error(
          `Invalid quantity. You cannot return more than what was dispatched (${maxAllowedReturn} units).`,
        );
      }

      // 4. Find the newest active batch structure for this product to put the inventory back into
      const targetBatch = await prisma.stockBatchTable.findFirst({
        where: { productId: originalLog.productId },
        orderBy: { createdAt: "desc" },
      });

      if (!targetBatch) {
        throw new Error(
          "No existing batch structure found to deposit returns.",
        );
      }

      // 5. Update the batch pool balance numbers
      await prisma.stockBatchTable.update({
        where: { id: targetBatch.id },
        data: { quantity: { increment: quantityToReturn } },
      });

      // 6. Write the verified return entry inside the audit trail
      await prisma.stockLog.create({
        data: {
          productId: originalLog.productId,
          quantity: quantityToReturn,
          action: "RETURN",
          referenceId: originalLog.id, // Links this return explicitly to the original dispatch log
          note: `[Verified Return for Log #${originalLog.id.substring(0, 6)}] - ${returnNotes}`,
          performedById: decoded.id,
        },
      });

      // 7. Reduce the capacity pool on the original log row so it can't be reused or double-returned
      // e.g., if it was -5, and 2 are returned, changing it to -3 protects the remaining capacity threshold
      await prisma.stockLog.update({
        where: { id: originalLog.id },
        data: { quantity: originalLog.quantity + quantityToReturn },
      });
    });
    revalidatePath(`/dashboard/inventory/${productId}`);
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: error.message || "Failed to process verified ledger return",
    };
  }
}

export async function editProduct({
  formData,
}: {
  formData: {
    productId: string;
    name: string;
    categoryId: string;
    sku: string;
    minStock: number;
  };
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, error: "Unauthorized" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded !== "object" || !("id" in decoded))
      return { success: false, error: "Invalid identity" };

    await client.product.update({
      where: { id: formData.productId },
      data: {
        name: formData.name,
        categoryId: formData.categoryId,
        sku: formData.sku,
        minStock: formData.minStock,
      },
    });
    revalidatePath(`/dashboard/inventory`);
    revalidatePath(`/dashboard/inventory/${formData.productId}`);
    return { success: true };
  } catch (error) {
    console.error("Error editing product:", error);
    return { success: false, error: "Failed to edit product" };
  }
}
