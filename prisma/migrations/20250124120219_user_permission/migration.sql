-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canCreateEvents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
