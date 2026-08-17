-- CreateTable
CREATE TABLE "Partido" (
    "id" SERIAL NOT NULL,
    "nombrePartido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "tipoCancha" TEXT NOT NULL,
    "privacidad" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'abierto',
    "canchaId" INTEGER NOT NULL,
    "creadorId" INTEGER NOT NULL,

    CONSTRAINT "Partido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" SERIAL NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "calificadorId" INTEGER NOT NULL,
    "calificadoId" INTEGER NOT NULL,
    "estrellas" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipoPartido" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "partidoId" INTEGER NOT NULL,

    CONSTRAINT "EquipoPartido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosicionEnEquipo" (
    "id" SERIAL NOT NULL,
    "tipoPosicion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'libre',
    "rol" TEXT NOT NULL DEFAULT 'jugador',
    "equipoEnPartidoId" INTEGER NOT NULL,
    "ocupanteId" INTEGER,
    "solicitanteId" INTEGER,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PosicionEnEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Calificacion_partidoId_calificadorId_calificadoId_key" ON "Calificacion"("partidoId", "calificadorId", "calificadoId");

-- AddForeignKey
ALTER TABLE "Partido" ADD CONSTRAINT "Partido_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partido" ADD CONSTRAINT "Partido_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_calificadorId_fkey" FOREIGN KEY ("calificadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_calificadoId_fkey" FOREIGN KEY ("calificadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipoPartido" ADD CONSTRAINT "EquipoPartido_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosicionEnEquipo" ADD CONSTRAINT "PosicionEnEquipo_equipoEnPartidoId_fkey" FOREIGN KEY ("equipoEnPartidoId") REFERENCES "EquipoPartido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosicionEnEquipo" ADD CONSTRAINT "PosicionEnEquipo_ocupanteId_fkey" FOREIGN KEY ("ocupanteId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosicionEnEquipo" ADD CONSTRAINT "PosicionEnEquipo_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
