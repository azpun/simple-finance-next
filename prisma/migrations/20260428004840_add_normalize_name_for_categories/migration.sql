/*
  Warnings:

  - The values [INCOME,EXPENSE] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.
  - The values [INCOME,EXPENSE] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[normalizeName,userId]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizeName` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryType_new" AS ENUM ('Income', 'Expense');
ALTER TABLE "Categories" ALTER COLUMN "type" TYPE "CategoryType_new" USING ("type"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "public"."CategoryType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('Income', 'Expense');
ALTER TABLE "Transactions" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- DropIndex
DROP INDEX "Categories_name_userId_key";

-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "normalizeName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categories_normalizeName_userId_key" ON "Categories"("normalizeName", "userId");
