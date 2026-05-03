-- CreateTable
CREATE TABLE "JobAlert" (
    "id" SERIAL NOT NULL,
    "accountID" INTEGER NOT NULL,
    "keyword" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobAlert_accountID_keyword_key" ON "JobAlert"("accountID", "keyword");

-- AddForeignKey
ALTER TABLE "JobAlert" ADD CONSTRAINT "JobAlert_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "Account"("accountID") ON DELETE RESTRICT ON UPDATE CASCADE;
