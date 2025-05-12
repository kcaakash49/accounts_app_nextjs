/*
  Warnings:

  - You are about to drop the column `dueId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_dueId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "dueId",
ADD COLUMN     "customerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
