/*
  Warnings:

  - You are about to drop the column `stripePaymentIntentId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the `UserUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserUsage" DROP CONSTRAINT "UserUsage_userID_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "stripePaymentIntentId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerId";

-- AlterTable
ALTER TABLE "UserSubscription" DROP COLUMN "stripeSubscriptionId";

-- DropTable
DROP TABLE "UserUsage";
