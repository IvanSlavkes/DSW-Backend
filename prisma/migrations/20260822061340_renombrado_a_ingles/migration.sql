/*
  Warnings:

  - You are about to drop the `Calificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cancha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipoPartido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Partido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PosicionEnEquipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SolAmistad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_calificadoId_fkey";

-- DropForeignKey
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_calificadorId_fkey";

-- DropForeignKey
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_partidoId_fkey";

-- DropForeignKey
ALTER TABLE "EquipoPartido" DROP CONSTRAINT "EquipoPartido_partidoId_fkey";

-- DropForeignKey
ALTER TABLE "Notificacion" DROP CONSTRAINT "Notificacion_partidoId_fkey";

-- DropForeignKey
ALTER TABLE "Notificacion" DROP CONSTRAINT "Notificacion_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Partido" DROP CONSTRAINT "Partido_canchaId_fkey";

-- DropForeignKey
ALTER TABLE "Partido" DROP CONSTRAINT "Partido_creadorId_fkey";

-- DropForeignKey
ALTER TABLE "PosicionEnEquipo" DROP CONSTRAINT "PosicionEnEquipo_equipoEnPartidoId_fkey";

-- DropForeignKey
ALTER TABLE "PosicionEnEquipo" DROP CONSTRAINT "PosicionEnEquipo_ocupanteId_fkey";

-- DropForeignKey
ALTER TABLE "PosicionEnEquipo" DROP CONSTRAINT "PosicionEnEquipo_solicitanteId_fkey";

-- DropForeignKey
ALTER TABLE "SolAmistad" DROP CONSTRAINT "SolAmistad_receptorId_fkey";

-- DropForeignKey
ALTER TABLE "SolAmistad" DROP CONSTRAINT "SolAmistad_solicitanteId_fkey";

-- DropTable
DROP TABLE "Calificacion";

-- DropTable
DROP TABLE "Cancha";

-- DropTable
DROP TABLE "EquipoPartido";

-- DropTable
DROP TABLE "Notificacion";

-- DropTable
DROP TABLE "Partido";

-- DropTable
DROP TABLE "PosicionEnEquipo";

-- DropTable
DROP TABLE "SolAmistad";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "locationId" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "privacy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "fieldId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" SERIAL NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "raterId" INTEGER NOT NULL,
    "ratedId" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "MatchTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPosition" (
    "id" SERIAL NOT NULL,
    "positionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'free',
    "role" TEXT NOT NULL DEFAULT 'player',
    "matchTeamId" INTEGER NOT NULL,
    "occupantId" INTEGER,
    "requesterId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_matchId_raterId_ratedId_key" ON "Rating"("matchId", "raterId", "ratedId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_ratedId_fkey" FOREIGN KEY ("ratedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTeam" ADD CONSTRAINT "MatchTeam_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPosition" ADD CONSTRAINT "TeamPosition_matchTeamId_fkey" FOREIGN KEY ("matchTeamId") REFERENCES "MatchTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPosition" ADD CONSTRAINT "TeamPosition_occupantId_fkey" FOREIGN KEY ("occupantId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPosition" ADD CONSTRAINT "TeamPosition_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
