/*
  Warnings:

  - You are about to drop the `ApplyHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CV` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplyHistory" DROP CONSTRAINT "ApplyHistory_cvID_fkey";

-- DropForeignKey
ALTER TABLE "ApplyHistory" DROP CONSTRAINT "ApplyHistory_jobID_fkey";

-- DropForeignKey
ALTER TABLE "ApplyHistory" DROP CONSTRAINT "ApplyHistory_userID_fkey";

-- DropForeignKey
ALTER TABLE "CV" DROP CONSTRAINT "CV_userID_fkey";

-- DropTable
DROP TABLE "ApplyHistory";

-- DropTable
DROP TABLE "CV";
