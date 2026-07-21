-- CreateTable
CREATE TABLE "ContractorDirector" (
    "id" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "idNo" TEXT NOT NULL,
    "fullNames" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "highestQualification" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "yearsOfExperience" TEXT NOT NULL,
    "percentageShare" TEXT NOT NULL,
    "cvFileName" TEXT,
    "academicCertFileName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorDirector_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractorDirector" ADD CONSTRAINT "ContractorDirector_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
