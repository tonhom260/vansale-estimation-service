'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
export type TEstDoc = Prisma.DocumentDetailGetPayload<{
    include: {
        customerDB: { select: { custname: true } },
        CustomerOrderEstimation: true,
    }
}>


export async function getEstimationDocument() {
    try {
        const orderPlanByCust = await prisma.documentDetail.findMany({
            include: { customerDB: { select: { custname: true } } },
            orderBy: { createAt: 'desc' },
            take: 40,
        })
        // console.log(orderPlanByCust)

        return orderPlanByCust
    } catch (e) { console.log(e) }
}


export async function getEstimationDocumentByDateAndSale({ startTripDate, team }: { startTripDate: Date, team: string }) {
    console.log(startTripDate)
    try {

        const orderPlanByCust = await prisma.documentDetail.findMany({
            include: { customerDB: { select: { custname: true } } },
            // include: { customerDB: { include: { PriceBook: { include: { ProductOrderOnPriceBooksExplicit: true } } } } },
            orderBy: { createAt: 'desc' },
            take: 40,
            where: {
                areacode: team,
                effectiveDate: startTripDate
            }
        })
        console.log(orderPlanByCust)

        return orderPlanByCust
    } catch (e) { console.log(e) }
}

export async function getEstimationDocumentByCustId({ custId }: { custId: string }) {
    try {

        const orderPlanByCust = await prisma.documentDetail.findMany({
            include: {
                CustomerOrderEstimation: true,
                customerDB: { select: { custname: true } }
            },
            orderBy: { createAt: 'desc' },
            take: 40,
            where: {
                custcode: custId
            }
        })
        // console.log(orderPlanByCust)

        return orderPlanByCust
    } catch (e) { console.log(e) }
}