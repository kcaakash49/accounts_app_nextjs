/*
  Warnings:

  - You are about to drop the column `batch` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_vendorId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "batch",
DROP COLUMN "costPrice",
DROP COLUMN "quantity",
DROP COLUMN "salePrice",
DROP COLUMN "vendorId";

-- CreateTable
CREATE TABLE "StockBatchTable" (
    "id" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DECIMAL(10,2) NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockBatchTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockBatchTable" ADD CONSTRAINT "StockBatchTable_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockBatchTable" ADD CONSTRAINT "StockBatchTable_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
