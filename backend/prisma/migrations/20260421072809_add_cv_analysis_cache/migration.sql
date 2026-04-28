-- CreateTable
CREATE TABLE "CVAnalysis" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "fileHash" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CVAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CVAnalysis_fileHash_key" ON "CVAnalysis"("fileHash");

-- CreateIndex
CREATE INDEX "CVAnalysis_userID_idx" ON "CVAnalysis"("userID");

-- CreateIndex
CREATE INDEX "CVAnalysis_fileHash_idx" ON "CVAnalysis"("fileHash");

-- CreateIndex
CREATE INDEX "CVAnalysis_createdAt_idx" ON "CVAnalysis"("createdAt");

-- AddForeignKey
ALTER TABLE "CVAnalysis" ADD CONSTRAINT "CVAnalysis_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
