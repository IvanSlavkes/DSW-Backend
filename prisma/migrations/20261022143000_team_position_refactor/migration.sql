-- DropForeignKey
ALTER TABLE "TeamPosition" DROP CONSTRAINT "TeamPosition_requesterId_fkey";

-- AlterTable
ALTER TABLE "TeamPosition" DROP COLUMN "requesterId",
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "secondaryPositionType" TEXT,
ALTER COLUMN "positionType" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PositionRequest" (
    "id" SERIAL NOT NULL,
    "matchTeamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "positionType" TEXT,
    "secondaryPositionType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PositionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PositionRequest_userId_idx" ON "PositionRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PositionRequest_matchTeamId_userId_key" ON "PositionRequest"("matchTeamId", "userId");

-- CreateIndex
CREATE INDEX "TeamPosition_matchTeamId_idx" ON "TeamPosition"("matchTeamId");

-- CreateIndex
CREATE INDEX "TeamPosition_occupantId_idx" ON "TeamPosition"("occupantId");

-- AddForeignKey
ALTER TABLE "PositionRequest" ADD CONSTRAINT "PositionRequest_matchTeamId_fkey" FOREIGN KEY ("matchTeamId") REFERENCES "MatchTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionRequest" ADD CONSTRAINT "PositionRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
