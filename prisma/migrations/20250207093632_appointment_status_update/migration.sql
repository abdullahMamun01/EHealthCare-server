-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'ONGOING';

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
