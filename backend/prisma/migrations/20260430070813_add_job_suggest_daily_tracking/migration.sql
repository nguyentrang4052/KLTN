-- AlterTable
ALTER TABLE "UserQuota" ADD COLUMN     "jobSuggestResetDate" TEXT,
ADD COLUMN     "jobSuggestUsedToday" INTEGER NOT NULL DEFAULT 0;
