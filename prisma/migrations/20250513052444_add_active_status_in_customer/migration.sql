-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ONLINE', 'EXPIRED');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "activeStatus" "ActiveStatus" NOT NULL DEFAULT 'ONLINE';
