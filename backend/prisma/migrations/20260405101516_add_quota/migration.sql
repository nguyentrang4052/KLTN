-- CreateTable
CREATE TABLE "UserQuota" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "jobSuggestPerDay" INTEGER NOT NULL DEFAULT 3,
    "cvAnalysisTotal" INTEGER NOT NULL DEFAULT 0,
    "cvMatchCheckTotal" INTEGER NOT NULL DEFAULT 0,
    "cvAnalysisUsed" INTEGER NOT NULL DEFAULT 0,
    "cvMatchCheckUsed" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserQuota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserQuota_userID_month_key" ON "UserQuota"("userID", "month");

-- AddForeignKey
ALTER TABLE "UserQuota" ADD CONSTRAINT "UserQuota_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
