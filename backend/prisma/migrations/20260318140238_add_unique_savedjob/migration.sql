/*
  Warnings:

  - A unique constraint covering the columns `[userID,jobID]` on the table `SavedJob` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SavedJob_userID_jobID_key" ON "SavedJob"("userID", "jobID");
