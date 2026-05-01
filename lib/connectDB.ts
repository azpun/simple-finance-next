import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing env var: DATABASE_URL");
}

const adapter = new PrismaPg({ connectionString });

if (!adapter) {
  throw new Error("Prisma Adapter initialized Failed.");
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (!prisma) {
  throw new Error("Prisma Client initialized Failed.");
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
