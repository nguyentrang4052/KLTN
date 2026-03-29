/*
  Warnings:

  - You are about to drop the column `expectedSalary` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workingType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "expectedSalary",
DROP COLUMN "workingType";

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "expectedSalary" TEXT,
ADD COLUMN     "workingType" TEXT;
