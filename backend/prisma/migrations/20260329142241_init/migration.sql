-- CreateTable
CREATE TABLE "Account" (
    "accountID" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountID")
);

-- CreateTable
CREATE TABLE "User" (
    "userID" SERIAL NOT NULL,
    "fullName" TEXT,
    "birthYear" INTEGER,
    "phone" TEXT,
    "gender" TEXT,
    "address" TEXT,
    "accountID" INTEGER NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "jobTitle" TEXT,
    "experienceYear" TEXT,
    "careerLevel" TEXT,
    "expectedSalary" TEXT,
    "workingType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userID" INTEGER NOT NULL,
    "industryID" INTEGER,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "skillID" INTEGER NOT NULL,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CV" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "companyID" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyWebsite" TEXT,
    "companyProfile" TEXT,
    "address" TEXT,
    "companySize" TEXT,
    "companyLogo" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("companyID")
);

-- CreateTable
CREATE TABLE "Job" (
    "jobID" SERIAL NOT NULL,
    "companyID" INTEGER NOT NULL,
    "industryID" INTEGER,
    "title" TEXT,
    "location" TEXT,
    "salary" TEXT,
    "description" TEXT,
    "requirement" TEXT,
    "benefit" TEXT,
    "jobType" TEXT,
    "workingTime" TEXT,
    "experienceYear" TEXT,
    "postedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "sourcePlatform" TEXT,
    "sourceLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "other" TEXT,
    "shortLocation" TEXT,
    "isNewJob" BOOLEAN NOT NULL DEFAULT false,
    "discoveredAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jobID")
);

-- CreateTable
CREATE TABLE "JobRecommendation" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "jobID" INTEGER NOT NULL,
    "matchPercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSkill" (
    "id" SERIAL NOT NULL,
    "jobID" INTEGER NOT NULL,
    "skillID" INTEGER NOT NULL,

    CONSTRAINT "JobSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedJob" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "jobID" INTEGER NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "skillID" SERIAL NOT NULL,
    "industryID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("skillID")
);

-- CreateTable
CREATE TABLE "UserBehavior" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "jobID" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBehavior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplyHistory" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "jobID" INTEGER NOT NULL,
    "cvID" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSourceTracking" (
    "id" SERIAL NOT NULL,
    "jobID" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "externalJobID" TEXT NOT NULL,
    "crawledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSourceTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_accountID_key" ON "User"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyName_key" ON "Company"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Job_sourceLink_key" ON "Job"("sourceLink");

-- CreateIndex
CREATE UNIQUE INDEX "JobRecommendation_userID_jobID_key" ON "JobRecommendation"("userID", "jobID");

-- CreateIndex
CREATE UNIQUE INDEX "SavedJob_userID_jobID_key" ON "SavedJob"("userID", "jobID");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_industryID_key" ON "Skill"("name", "industryID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "Account"("accountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_industryID_fkey" FOREIGN KEY ("industryID") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES "Skill"("skillID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CV" ADD CONSTRAINT "CV_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_industryID_fkey" FOREIGN KEY ("industryID") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES "Job"("jobID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkill" ADD CONSTRAINT "JobSkill_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES "Job"("jobID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSkill" ADD CONSTRAINT "JobSkill_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES "Skill"("skillID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES "Job"("jobID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_industryID_fkey" FOREIGN KEY ("industryID") REFERENCES "Industry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBehavior" ADD CONSTRAINT "UserBehavior_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES "Job"("jobID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBehavior" ADD CONSTRAINT "UserBehavior_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplyHistory" ADD CONSTRAINT "ApplyHistory_cvID_fkey" FOREIGN KEY ("cvID") REFERENCES "CV"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplyHistory" ADD CONSTRAINT "ApplyHistory_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES "Job"("jobID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplyHistory" ADD CONSTRAINT "ApplyHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSourceTracking" ADD CONSTRAINT "JobSourceTracking_jobID_fkey" FOREIGN KEY ("jobID") REFERENCES "Job"("jobID") ON DELETE RESTRICT ON UPDATE CASCADE;
