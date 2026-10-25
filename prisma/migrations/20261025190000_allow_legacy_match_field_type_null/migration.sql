-- The current Prisma Match model no longer uses this legacy column.
-- Keep existing values, but allow new matches to omit it.
ALTER TABLE "Match"
ALTER COLUMN "fieldType" DROP NOT NULL;
