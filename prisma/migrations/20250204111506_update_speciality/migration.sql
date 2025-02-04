/*
  Warnings:

  - You are about to drop the column `description` on the `specialites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `specialites` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "specialites" DROP COLUMN "description";

-- CreateIndex
CREATE UNIQUE INDEX "specialites_name_key" ON "specialites"("name");
