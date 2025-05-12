/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Due` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "dueDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Due" DROP COLUMN "dueDate";
