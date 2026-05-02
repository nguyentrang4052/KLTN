/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionID]` on the table `UserQuota` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserQuota" ADD COLUMN     "subscriptionID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "UserQuota_subscriptionID_key" ON "UserQuota"("subscriptionID");

-- AddForeignKey
ALTER TABLE "UserQuota" ADD CONSTRAINT "UserQuota_subscriptionID_fkey" FOREIGN KEY ("subscriptionID") REFERENCES "UserSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
