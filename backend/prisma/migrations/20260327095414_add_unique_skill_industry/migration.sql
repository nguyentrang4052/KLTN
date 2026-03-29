/*
  Warnings:

  - A unique constraint covering the columns `[name,industryID]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Skill_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_industryID_key" ON "Skill"("name", "industryID");
