/*
  Warnings:

  - A unique constraint covering the columns `[contact]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_contact_key" ON "Customer"("contact");
