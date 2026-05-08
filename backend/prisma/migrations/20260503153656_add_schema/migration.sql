/*
  Warnings:

  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `emailSent` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `jobID` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `emailNotificationsEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CVAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CVAnalysisCache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CVBuilder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatSession` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dedupeKey]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `body` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CVAnalysis" DROP CONSTRAINT "CVAnalysis_userID_fkey";

-- DropForeignKey
ALTER TABLE "CVAnalysisCache" DROP CONSTRAINT "CVAnalysisCache_userID_fkey";

-- DropForeignKey
ALTER TABLE "CVBuilder" DROP CONSTRAINT "CVBuilder_userID_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_sessionID_fkey";

-- DropForeignKey
ALTER TABLE "ChatSession" DROP CONSTRAINT "ChatSession_userID_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_jobID_fkey";

-- DropIndex
DROP INDEX "Notification_jobID_idx";

-- DropIndex
DROP INDEX "Notification_userID_idx";

-- DropIndex
DROP INDEX "UserProfile_userID_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
DROP COLUMN "emailSent",
DROP COLUMN "jobID",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "dedupeKey" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "readAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailNotificationsEnabled";

-- DropTable
DROP TABLE "CVAnalysis";

-- DropTable
DROP TABLE "CVAnalysisCache";

-- DropTable
DROP TABLE "CVBuilder";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "ChatSession";

-- CreateTable
CREATE TABLE "ApplyHistory" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "jobID" INTEGER NOT NULL,
    "cvID" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CV" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");

-- AddForeignKey
ALTER TABLE "ApplyHistory" ADD CONSTRAINT "ApplyHistory_cvID_fkey" FOREIGN KEY ("cvID") REFERENCES "CV"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplyHistory" ADD CONSTRAINT "ApplyHistory_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES "Job"("jobID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplyHistory" ADD CONSTRAINT "ApplyHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CV" ADD CONSTRAINT "CV_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
