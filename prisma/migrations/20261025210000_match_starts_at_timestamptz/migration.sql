-- Preserve each match's local Argentina kickoff while storing it as an absolute instant.
ALTER TABLE "Match" ADD COLUMN "startsAt" TIMESTAMPTZ(3);

UPDATE "Match"
SET "startsAt" = (("date"::date::text || ' ' || "time")::timestamp AT TIME ZONE 'America/Argentina/Buenos_Aires');

ALTER TABLE "Match" ALTER COLUMN "startsAt" SET NOT NULL;
ALTER TABLE "Match" DROP COLUMN "date";
ALTER TABLE "Match" DROP COLUMN "time";
