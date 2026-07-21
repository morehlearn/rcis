/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('LOCAL_CONTRACTOR', 'FOREIGN_CONTRACTOR', 'SKILLED_WORKER', 'SITE_SUPERVISOR');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "UserExternal" (
    "id" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "companyName" TEXT,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserExternal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserExternal_nationalId_key" ON "UserExternal"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "UserExternal_email_key" ON "UserExternal"("email");
