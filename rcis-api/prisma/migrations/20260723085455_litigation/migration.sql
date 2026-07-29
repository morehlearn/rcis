-- CreateTable
CREATE TABLE "ContractorLitigation" (
    "id" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "refNo" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "partiesInvolved" TEXT NOT NULL,
    "particularOfLitigation" TEXT NOT NULL,
    "statusOfMatter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorLitigation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractorLitigation" ADD CONSTRAINT "ContractorLitigation_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
