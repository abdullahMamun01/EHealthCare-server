/*
  Warnings:

  - You are about to drop the column `Instruction` on the `prescriptions` table. All the data in the column will be lost.
  - Added the required column `instruction` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "Instruction",
ADD COLUMN     "instruction" TEXT NOT NULL;
