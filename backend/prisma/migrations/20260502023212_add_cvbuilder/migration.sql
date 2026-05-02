-- CreateTable
CREATE TABLE "CVBuilder" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CVBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CVBuilder_userID_idx" ON "CVBuilder"("userID");

-- AddForeignKey
ALTER TABLE "CVBuilder" ADD CONSTRAINT "CVBuilder_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
