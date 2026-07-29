-- CreateTable
CREATE TABLE "ContractorApplication" (
    "id" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "trackNo" TEXT NOT NULL,
    "companyName" TEXT,
    "classesApplied" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL,
    "localForeign" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractorApplication" ADD CONSTRAINT "ContractorApplication_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
