/*
  Warnings:

  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `emailSent` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `jobID` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `emailNotificationsEnabled` on the `User` table. All the data in the column will be lost.
  - Added the required column `body` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_jobID_fkey";

-- DropIndex
DROP INDEX "Notification_jobID_idx";

-- DropIndex
DROP INDEX "Notification_userID_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
DROP COLUMN "emailSent",
DROP COLUMN "jobID",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "readAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailNotificationsEnabled";
