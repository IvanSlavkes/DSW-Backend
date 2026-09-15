/*
  Warnings:

  - You are about to drop the column `locationName` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `locationName` on the `User` table. All the data in the column will be lost.
  - Added the required column `localityId` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Field" DROP COLUMN "locationName",
ADD COLUMN     "localityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "locationId",
DROP COLUMN "locationName",
ADD COLUMN     "localityId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_localityId_fkey" FOREIGN KEY ("localityId") REFERENCES "Locality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
