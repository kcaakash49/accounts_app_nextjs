-- CreateTable
CREATE TABLE "TrashCustomer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT,
    "activeStatus" "ActiveStatus" NOT NULL,
    "status" "DueStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),

    CONSTRAINT "TrashCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrashSales" (
    "id" SERIAL NOT NULL,
    "trashCustomerId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrashSales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrashPayment" (
    "id" SERIAL NOT NULL,
    "trashCustomerId" INTEGER NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "adminUserId" INTEGER NOT NULL,

    CONSTRAINT "TrashPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrashSales" ADD CONSTRAINT "TrashSales_trashCustomerId_fkey" FOREIGN KEY ("trashCustomerId") REFERENCES "TrashCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrashPayment" ADD CONSTRAINT "TrashPayment_trashCustomerId_fkey" FOREIGN KEY ("trashCustomerId") REFERENCES "TrashCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrashPayment" ADD CONSTRAINT "TrashPayment_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
