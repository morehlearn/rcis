-- CreateTable
CREATE TABLE "ContractorClassification" (
    "regno" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL,
    "buildingWorksCategory" TEXT NOT NULL,
    "roadWorksCategory" TEXT NOT NULL,
    "waterWorksCategory" TEXT NOT NULL,
    "electricalSubClasses" TEXT[],
    "electricalCategory" TEXT NOT NULL,
    "mechanicalSubClasses" TEXT[],
    "mechanicalCategory" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorClassification_pkey" PRIMARY KEY ("regno")
);

-- AddForeignKey
ALTER TABLE "ContractorClassification" ADD CONSTRAINT "ContractorClassification_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
