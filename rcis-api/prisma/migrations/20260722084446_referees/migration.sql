-- CreateTable
CREATE TABLE "ContractorReferee" (
    "id" TEXT NOT NULL,
    "regno" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "postalAddress" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorReferee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractorReferee" ADD CONSTRAINT "ContractorReferee_regno_fkey" FOREIGN KEY ("regno") REFERENCES "ContractorCompany"("regno") ON DELETE RESTRICT ON UPDATE CASCADE;
