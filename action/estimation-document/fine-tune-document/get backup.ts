'use server'

import getProductList from "@/action/product/get";
import prisma from "@/lib/prisma"
import { format } from "date-fns"

export async function getPivotDataBySaleWithDateRange({ team, dateRange }: { team?: string; dateRange: { from: Date, to: Date } }) {
    console.log(team, dateRange)
    const untilDate = dateRange.to
    untilDate.setHours(23, 59, 59, 999)
    // console.log(untilDate)
    try {
        const documents = await prisma.documentDetail.findMany({
            include: {
                CustomerOrderEstimation: true,
                customerDB: true
            },
            where: {
                custcode: { not: null },
                areacode: team, effectiveDate: {
                    gte: dateRange.from, lt: untilDate
                }
            },
            orderBy: { effectiveDate: "asc" }
        })
        // console.log(documents)

        const headerData = documents.map(e => {
            const date = format(e.effectiveDate!, 'dd-MM-yy')
            const docname = e.orderDocname
            const sumUnits = e.CustomerOrderEstimation.reduce((prev, doc) => (doc.nextOrder || 0) + prev, 0)
            return {
                date,
                docname,
                sumUnits,
                custcode: e.custcode ?? "",
                custname: e.customerDB?.custname ?? ""
            }
        }) as TPivotHeader

        console.log(headerData)
        const grandSell = headerData?.reduce((p, e) => (e.sumUnits || 0) + p, 0)

        const grandSummaryDate: TPivotHeader[number] = {
            totalSell: grandSell,
        }
        headerData.push(grandSummaryDate)
        console.log(headerData)
        // const containers: number[][] = []
        // console.log(containers)
        const productData = await getProductList()
        const productList = productData?.items ?? []

        const container2: number[][] = productList.map(e => {
            const code = e.product_code1
            const estList = documents.map(e => e.CustomerOrderEstimation)
            const list = estList.map(es => {
                const matchAmt = es.find(e => e.productcode == code)?.nextOrder
                return matchAmt || 0
            })
            const sum = list.reduce((p, e) => p + e, 0)
            return [...list, sum]
        })

        // console.log(container2)

        const productListLen = productList.length
        const productSumList = []



        for (let p = 0; p < productListLen; p++) {
            let sumItemAmt = 0
            for (let i = 0; i < container2.length; i++) {
                const unitAmt = (container2.at(i)?.at(p) || 0)
                sumItemAmt = sumItemAmt + unitAmt
            }
            productSumList.push(sumItemAmt)
        }
        container2.push(productSumList)



        return { header: headerData, body: container2, finetuneData: [] }
    } catch (e) { console.log(e) }
}

export type TPivotSheet = {
    productCode: string,
    date: Date,
    docname: string
    returnBaht: number,
    returnUnit: number,
    sellBaht: number,
    sellUnit: number
}

export type TPivot = {
    docname: string
    returnBaht: number,
    returnUnit: number,
    sellBaht: number,
    sellUnit: number,
    returnPercent?: number
}

export type TPivotBody = number[][]

export type TPivotHeader = {
    custname?: string;
    custcode?: string;
    date?: string,
    docname?: string,
    sumUnits?: number,
    sumDateReturn?: number
    totalSell?: number
    grandReturnPercent?: number
}[]

