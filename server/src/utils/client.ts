import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  // Optional
  // log: ['query', 'info', 'warn', 'error']
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
