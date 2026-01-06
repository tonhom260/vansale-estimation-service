'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"

export type TSaleHistory = Prisma.DocumentFolderGetPayload<{
    include: {
        customer_transaction: true,
        returngoods: true
    }
}>


export async function getPastSaleRecordByCustId({ custId }: { custId: string }) {
    try {
        const saleHistoryByCust = await prisma.documentFolder.findMany({
            include: {
                customer_transaction: {
                    where: { isActive: true }
                },
                returngoods: {
                    where: { isActive: true }
                }
            },
            take: 20,
            orderBy: { created_at: "desc" },
            where: {
                custID: custId
            }
        })
        console.log(saleHistoryByCust)

        return saleHistoryByCust
    } catch (e) { console.log(e) }
}