/*
  Warnings:

  - The values [MANAGER,STAFF] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [OPEN] on the enum `SaleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'HEADQUARTER_MANAGER', 'BRANCH_MANAGER', 'CHEF', 'CASHIER', 'WAITER', 'CUSTOMER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SaleStatus_new" AS ENUM ('PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Sale" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Sale" ALTER COLUMN "status" TYPE "SaleStatus_new" USING ("status"::text::"SaleStatus_new");
ALTER TYPE "SaleStatus" RENAME TO "SaleStatus_old";
ALTER TYPE "SaleStatus_new" RENAME TO "SaleStatus";
DROP TYPE "public"."SaleStatus_old";
ALTER TABLE "Sale" ALTER COLUMN "status" SET DEFAULT 'COMPLETED';
COMMIT;
