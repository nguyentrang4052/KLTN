/*
  Warnings:

  - You are about to drop the column `role` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanLimit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefundRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserQuota` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_subscriptionID_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userID_fkey";

-- DropForeignKey
ALTER TABLE "PlanLimit" DROP CONSTRAINT "PlanLimit_planID_fkey";

-- DropForeignKey
ALTER TABLE "RefundRequest" DROP CONSTRAINT "RefundRequest_paymentID_fkey";

-- DropForeignKey
ALTER TABLE "RefundRequest" DROP CONSTRAINT "RefundRequest_userID_fkey";

-- DropForeignKey
ALTER TABLE "UserQuota" DROP CONSTRAINT "UserQuota_userID_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_planID_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_userID_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "role";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PlanLimit";

-- DropTable
DROP TABLE "RefundRequest";

-- DropTable
DROP TABLE "SubscriptionPlan";

-- DropTable
DROP TABLE "UserQuota";

-- DropTable
DROP TABLE "UserSubscription";
