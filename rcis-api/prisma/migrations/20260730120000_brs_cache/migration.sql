-- CreateTable
CREATE TABLE "BrsCompanyRecord" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "kraPin" TEXT NOT NULL,
    "registrationDate" TEXT NOT NULL,
    "foreignShareholdingPercent" INTEGER NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrsCompanyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrsDirectorRecord" (
    "id" TEXT NOT NULL,
    "companyRecordId" TEXT NOT NULL,
    "idNo" TEXT NOT NULL,
    "fullNames" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "percentageShare" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrsDirectorRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrsCompanyRecord_registrationNumber_key" ON "BrsCompanyRecord"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BrsDirectorRecord_companyRecordId_idNo_key" ON "BrsDirectorRecord"("companyRecordId", "idNo");

-- AddForeignKey
ALTER TABLE "BrsDirectorRecord" ADD CONSTRAINT "BrsDirectorRecord_companyRecordId_fkey" FOREIGN KEY ("companyRecordId") REFERENCES "BrsCompanyRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
