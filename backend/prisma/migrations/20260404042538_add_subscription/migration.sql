-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "monthlyPrice" INTEGER NOT NULL DEFAULT 0,
    "yearlyPrice" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanLimit" (
    "id" SERIAL NOT NULL,
    "planID" INTEGER NOT NULL,
    "applyPerMonth" INTEGER NOT NULL DEFAULT 5,
    "viewJdPerDay" INTEGER NOT NULL DEFAULT 10,
    "maxCv" INTEGER NOT NULL DEFAULT 1,
    "cvTemplateCount" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "PlanLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanFeature" (
    "id" SERIAL NOT NULL,
    "planID" INTEGER NOT NULL,
    "featureKey" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "planID" INTEGER NOT NULL,
    "billing" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "subscriptionID" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "status" TEXT NOT NULL,
    "method" TEXT,
    "transactionRef" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUsage" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "applyCount" INTEGER NOT NULL DEFAULT 0,
    "viewJdCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PlanLimit_planID_key" ON "PlanLimit"("planID");

-- CreateIndex
CREATE UNIQUE INDEX "PlanFeature_planID_featureKey_key" ON "PlanFeature"("planID", "featureKey");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionRef_key" ON "Payment"("transactionRef");

-- CreateIndex
CREATE UNIQUE INDEX "UserUsage_userID_month_key" ON "UserUsage"("userID", "month");

-- AddForeignKey
ALTER TABLE "PlanLimit" ADD CONSTRAINT "PlanLimit_planID_fkey" FOREIGN KEY ("planID") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_planID_fkey" FOREIGN KEY ("planID") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_planID_fkey" FOREIGN KEY ("planID") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionID_fkey" FOREIGN KEY ("subscriptionID") REFERENCES "UserSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUsage" ADD CONSTRAINT "UserUsage_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
