/*
  Warnings:

  - You are about to drop the column `stripeId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rzpId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rzpId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_stripeId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "stripeId",
ADD COLUMN     "rzpId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_rzpId_key" ON "Order"("rzpId");
