'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"

export type TEstDetail = Prisma.DocumentDetailGetPayload<{
    include: {
        customerDB: { select: { custname: true } },
        CustomerOrderEstimation: { select: { productcode: true, nextOrder: true, } },
        SaleTrip: true,
        SellingArea: true,
    }
}>


export async function getEstimationDocumentDetailByDocname({ docname }: { docname: string }) {
    try {
        const orderPlanByDocname = await prisma.documentDetail.findFirst({
            where: { orderDocname: docname },
            include: {
                SaleTrip: true,
                SellingArea: true,
                customerDB: { select: { custname: true } },
                CustomerOrderEstimation: { select: { productcode: true, nextOrder: true, } }
                // CustomerOrderEstimation: true
            },
        })

        return orderPlanByDocname
    } catch (e) { console.log(e) }
}

