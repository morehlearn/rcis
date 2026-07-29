-- CreateTable
CREATE TABLE "ContractorAsset" (
    "id" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractorAsset" ADD CONSTRAINT "ContractorAsset_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
