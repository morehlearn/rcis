-- CreateTable
CREATE TABLE "ContractorEquipment" (
    "id" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownedOrLeased" TEXT NOT NULL,
    "typeMakeModel" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorEquipment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractorEquipment" ADD CONSTRAINT "ContractorEquipment_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
