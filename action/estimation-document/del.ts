'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
export type TEstDoc = Prisma.DocumentDetailGetPayload<{
    include: {
        customerDB: { select: { custname: true } }
    }
}>


export async function delEstimationDocument({ docname, }: { docname: string; }) {
    try {
        const createDoc = await prisma.documentDetail.delete({
            where: { orderDocname: docname }
        })
        console.log(createDoc)
        return createDoc
    } catch (e) {
        console.log(e)
    }
}