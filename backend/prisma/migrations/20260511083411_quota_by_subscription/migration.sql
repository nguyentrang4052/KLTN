/*
  Warnings:

  - You are about to drop the column `month` on the `UserQuota` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID,subscriptionID]` on the table `UserQuota` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserQuota_userID_month_key";

-- AlterTable
ALTER TABLE "UserQuota" DROP COLUMN "month";

-- CreateIndex
CREATE UNIQUE INDEX "UserQuota_userID_subscriptionID_key" ON "UserQuota"("userID", "subscriptionID");
