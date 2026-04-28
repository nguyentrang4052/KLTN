-- CreateTable
CREATE TABLE "CVAnalysisCache" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "fileHash" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CVAnalysisCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CVAnalysisCache_fileHash_key" ON "CVAnalysisCache"("fileHash");

-- CreateIndex
CREATE INDEX "CVAnalysisCache_userID_idx" ON "CVAnalysisCache"("userID");

-- CreateIndex
CREATE INDEX "CVAnalysisCache_fileHash_idx" ON "CVAnalysisCache"("fileHash");

-- AddForeignKey
ALTER TABLE "CVAnalysisCache" ADD CONSTRAINT "CVAnalysisCache_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
