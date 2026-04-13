-- CreateTable
CREATE TABLE "RefundRequest" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "paymentID" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "RefundRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefundRequest_paymentID_key" ON "RefundRequest"("paymentID");

-- AddForeignKey
ALTER TABLE "RefundRequest" ADD CONSTRAINT "RefundRequest_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundRequest" ADD CONSTRAINT "RefundRequest_paymentID_fkey" FOREIGN KEY ("paymentID") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
