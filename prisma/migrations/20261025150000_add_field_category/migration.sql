-- The current UI and Match creation flow use only these three field formats.
-- Abort without changing data if the database contains a format that needs an explicit mapping.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Field" WHERE "type" NOT IN ('5', '7', '11')) THEN
    RAISE EXCEPTION 'Field.type contains values outside 5, 7, and 11; map them to FieldCategory before applying this migration';
  END IF;
END $$;

CREATE TABLE "FieldCategory" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "surfaceType" TEXT NOT NULL,
  "playersPerTeam" INTEGER NOT NULL,
  CONSTRAINT "FieldCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FieldCategory_name_key" ON "FieldCategory"("name");

INSERT INTO "FieldCategory" ("name", "surfaceType", "playersPerTeam") VALUES
  ('Fútbol 5', 'Sin especificar', 5),
  ('Fútbol 7', 'Sin especificar', 7),
  ('Fútbol 11', 'Sin especificar', 11);

ALTER TABLE "Field" ADD COLUMN "categoryId" INTEGER;

UPDATE "Field"
SET "categoryId" = "FieldCategory"."id"
FROM "FieldCategory"
WHERE "Field"."type" = "FieldCategory"."playersPerTeam"::TEXT;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Field" WHERE "categoryId" IS NULL) THEN
    RAISE EXCEPTION 'Some Field rows could not be mapped to FieldCategory';
  END IF;
END $$;

ALTER TABLE "Field" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "Field" DROP COLUMN "type";

ALTER TABLE "Field"
  ADD CONSTRAINT "Field_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "FieldCategory"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
