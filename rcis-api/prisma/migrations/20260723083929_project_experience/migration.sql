-- CreateTable
CREATE TABLE "ContractorProjectExperience" (
    "id" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "ncaProjectRegNo" TEXT NOT NULL,
    "contractSum" TEXT NOT NULL,
    "contractPeriod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorProjectExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractorProjectExperience" ADD CONSTRAINT "ContractorProjectExperience_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
