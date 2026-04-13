/*
  Warnings:

  - You are about to drop the column `applyPerMonth` on the `PlanLimit` table. All the data in the column will be lost.
  - You are about to drop the column `cvTemplateCount` on the `PlanLimit` table. All the data in the column will be lost.
  - You are about to drop the column `maxCv` on the `PlanLimit` table. All the data in the column will be lost.
  - You are about to drop the column `viewJdPerDay` on the `PlanLimit` table. All the data in the column will be lost.
  - You are about to drop the `PlanFeature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlanFeature" DROP CONSTRAINT "PlanFeature_planID_fkey";

-- AlterTable
ALTER TABLE "PlanLimit" DROP COLUMN "applyPerMonth",
DROP COLUMN "cvTemplateCount",
DROP COLUMN "maxCv",
DROP COLUMN "viewJdPerDay";

-- DropTable
DROP TABLE "PlanFeature";
