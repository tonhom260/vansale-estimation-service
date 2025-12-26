import { PrismaClient } from "@/generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const DATABASE_URL = process.env.DATABASE_URL!
const adapter = new PrismaMariaDb(DATABASE_URL)

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: process.env.NODE_ENV === 'development' ? ["error", "info", "query"] : [] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma