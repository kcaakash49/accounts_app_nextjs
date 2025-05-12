/*
  Warnings:

  - You are about to drop the column `status` on the `Due` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "status" "DueStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "Due" DROP COLUMN "status";
