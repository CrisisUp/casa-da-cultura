import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

// Em desenvolvimento, guardar a instância para evitar múltiplas conexões
// durante Hot Reload/HMR (Next.js cria novas instâncias a cada reload)
if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;
