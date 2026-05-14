/*
  Warnings:

  - You are about to drop the column `performedBy` on the `stock_logs` table. All the data in the column will be lost.
  - Added the required column `performedById` to the `stock_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_logs" DROP COLUMN "performedBy",
ADD COLUMN     "performedById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "stock_logs" ADD CONSTRAINT "stock_logs_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
