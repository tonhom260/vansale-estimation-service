'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
export type TSavePayload = {
    basicPrice: number,
    testOrder: number, // order in bill
    productcode: string,
    productname: string,
    productcategory: any,
    nextOrder: number,
}

export async function saveEstimationDocumentByDocId(docId: string, items: TSavePayload[], detail: { editBy: string, netamount: number, netunits: number, remark: string }) {
    try {
        const saveOrder = await prisma.documentDetail.update({
            data: {
                responsible: detail.editBy,
                createAt: new Date(),
                netamount: detail.netamount,
                netunits: detail.netunits,
                remark: detail.remark,
                CustomerOrderEstimation: {
                    deleteMany: {},
                    createMany: {
                        data: items
                    }
                }
            },
            where: { orderDocname: docId }
        })
        return saveOrder
    } catch (e) {
        console.log(e)
        throw e
    }
}

