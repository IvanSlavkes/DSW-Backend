// Este archivo sirve basicamente para simplificar y no importar todo lo que esta debajo en cada service

import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// Neon recomienda la URL pooled para el tráfico de la aplicación. Mantener
// DIRECT_URL como fallback permite seguir usando configuraciones locales.
const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL (o DIRECT_URL) debe estar configurada.");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
