// Este archivo sirve basicamente para simplificar y no importar todo lo que esta debajo en cada service

import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });

export const prisma = new PrismaClient({ adapter });