'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
export type TEstDoc = Prisma.DocumentDetailGetPayload<{
    include: {
        customerDB: { select: { custname: true } }
    }
}>


export async function createEstimationDocument({ docname, effectiveDate, slmname, responsible, custcode }: { custcode: string; responsible: string; docname: string; effectiveDate: Date, slmname: string }) {
    console.log({ docname, effectiveDate, slmname, responsible })
    try {
        const createDoc = await prisma.documentDetail.create({
            data: {
                orderDocname: docname,
                effectiveDate,
                slmname,
                responsible,
                areacode: slmname,
                custcode
            }
        })
        console.log(createDoc)
        return createDoc
    } catch (e) {
        console.log(e)
        const err = e as any
        if (err.code == "P2002") {
            throw Error("มีการสร้างเอกสารซ้ำ")
        }
    }
}