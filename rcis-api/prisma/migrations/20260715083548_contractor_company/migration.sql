-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "RegnoCounter" (
    "year" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RegnoCounter_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "ContractorCompany" (
    "regno" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "incorporationNo" TEXT NOT NULL,
    "firmName" TEXT,
    "headOffice" TEXT NOT NULL,
    "postalAddress" TEXT,
    "county" TEXT,
    "town" TEXT NOT NULL,
    "localForeign" TEXT NOT NULL,
    "website" TEXT,
    "telephone" TEXT NOT NULL,
    "cellPhone" TEXT NOT NULL,
    "email" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "firmType" TEXT,
    "kraPin" TEXT,
    "registeredCapital" TEXT,
    "paidUpCapital" TEXT,
    "taxComplianceNo" TEXT,
    "bankName" TEXT,
    "bankBranch" TEXT,
    "agencyName" TEXT,
    "agencyRegistrationNo" TEXT,
    "agencyYear" TEXT,
    "associationName" TEXT,
    "associationNameOther" TEXT,
    "associationMembershipNo" TEXT,
    "jointVentureProjects" TEXT,
    "jointVentureFirms" TEXT,
    "hasAgpoCertificate" TEXT,
    "acceptCodeOfConduct" BOOLEAN NOT NULL DEFAULT false,
    "acceptTerms" BOOLEAN NOT NULL DEFAULT false,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorCompany_pkey" PRIMARY KEY ("regno")
);

-- AddForeignKey
ALTER TABLE "ContractorCompany" ADD CONSTRAINT "ContractorCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserExternal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
