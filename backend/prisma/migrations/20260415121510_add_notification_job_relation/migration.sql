-- CreateIndex
CREATE INDEX "Notification_userID_idx" ON "Notification"("userID");

-- CreateIndex
CREATE INDEX "Notification_jobID_idx" ON "Notification"("jobID");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES "Job"("jobID") ON DELETE SET NULL ON UPDATE CASCADE;
