-- CreateTable
CREATE TABLE "ContractorStaff" (
    "id" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "fullNames" TEXT NOT NULL,
    "idNo" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "highestQualification" TEXT NOT NULL,
    "yearsOfExperience" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorStaff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractorStaff" ADD CONSTRAINT "ContractorStaff_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
