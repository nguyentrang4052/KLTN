-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "discoveredAt" TIMESTAMP(3),
ADD COLUMN     "isNewJob" BOOLEAN NOT NULL DEFAULT false;
