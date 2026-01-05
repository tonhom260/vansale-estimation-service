'use server'

import prisma from "@/lib/prisma"
import { format } from "date-fns"

export async function getPivotDataByCustId() {

    const custid = "C221100212" //ต้นอ้อยช๊อป รพ.กมลาไสย (สด)
    try {
        const documents = await prisma.documentFolder.findMany({
            include: {
                customer_transaction: {
                    select: {
                        netamt: true,
                        sale_units: true,
                        product_code1: true
                    },
                    where: { isActive: true }
                },
                returngoods: {
                    select: {
                        ret_unit: true,
                        net_return_amt: true,
                        product_code1: true,
                    },
                    where: { isActive: true }
                }
            },
            where: { custID: custid, isActive: true },
            take: 5,
            orderBy: { id: "desc" }
        })
        console.log(documents)
        documents.reverse()

        const headerData = documents.map(e => {
            const date = format(e.created_at!, 'dd-MM')
            const docname = e.order_no
            const sumDateReturn = e.returngoods.reduce((prev, doc) => (doc.ret_unit || 0) + prev, 0)
            const sumDateSell = e.customer_transaction.reduce((prev, doc) => (doc.sale_units || 0) + prev, 0)
            return {
                date,
                docname,
                sumDateReturn,
                sumDateSell,
            }
        }) as TPivotHeader
        console.log(headerData)
        const grandSell = headerData.reduce((p, e) => (e.sumDateSell || 0) + p, 0)
        const grandReturn = headerData.reduce((p, e) => (e.sumDateReturn || 0) + p, 0)
        const grandReturnPercent = (grandSell == 0)
            ? undefined :
            grandReturn / grandSell
        console.log(grandReturnPercent)
        const grandSummaryDate: TPivotHeader[number] = {
            grandReturnPercent: !!grandReturnPercent ? (Math.round(grandReturnPercent * 100) / 100) : undefined,
            totalSell: grandSell,
        }
        headerData.unshift(grandSummaryDate)
        console.log(headerData)
        /// header end

        // compose body 

        const containers: any[] = []
        const finalReport: TPivotBody = {}
        const modifyDataToReport = documents.map((doc, i) => {
            const docname = doc.order_no
            const createDate = doc.created_at
            const sellingProduct = doc.customer_transaction.map(e => ({ ...e, docname, type: "sell" })) ?? []
            const returnProduct = doc.returngoods.map(e => ({ ...e, docname, type: "return" })) ?? []
            console.log(sellingProduct)
            console.log(returnProduct)
            containers.push(...sellingProduct, ...returnProduct)
        })
        console.log(containers)

        const productCodeList = Array.from(new Set(containers.map(e => e.product_code1)))
        console.log(productCodeList)
        const productCodeObject = {} as Record<string, any[]>
        for (let code of productCodeList) {
            productCodeObject[code] = []
        }
        console.log(productCodeObject)

        for (let i of containers) {
            console.log(i)
            const type = i.type
            const productCode = i.product_code1
            console.log(type)
            console.log(productCode)
            productCodeObject[productCode] = [...productCodeObject[productCode], i]
        }

        console.log(productCodeObject)

        for (let code in productCodeObject) {
            console.log(code)
            const lists = productCodeObject[code] as any[]
            console.log(lists)
            const uniqueDoc = Array.from((new Set(lists.map(e => e.docname))))
            const uniqueDocnameList = uniqueDoc.map(e => ({
                docname: e,
                returnBaht: 0,
                returnUnit: 0,
                sellBaht: 0,
                sellUnit: 0
            }))

            const matchBox = uniqueDocnameList.map((e: any) => {
                console.log(e.docname)
                const result: any = {}
                for (let it of lists) {
                    const { type, netamt, sale_units, product_code1, docname, ret_unit, net_return_amt } = it
                    if (docname == e.docname) {

                        console.log("object")
                        if (!!net_return_amt) {
                            result["returnBaht"] = net_return_amt
                        }
                        if (!!ret_unit) {
                            result["returnUnit"] = ret_unit
                        }
                        if (!!netamt) {
                            result["sellBaht"] = netamt
                        }
                        if (!!sale_units) {
                            result["sellUnit"] = sale_units
                        }
                    }
                }
                return { ...e, ...result }
            });
            console.log(matchBox)
            productCodeObject[code] = matchBox
        }
        console.log({ headerData, bodyData: productCodeObject })
        // compose header pivot data
        return { headerData, bodyData: productCodeObject }
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

type TProductCode = string

export type TPivot = {
    docname: string
    returnBaht: number,
    returnUnit: number,
    sellBaht: number,
    sellUnit: number,
    returnPercent?: number
}

export type TPivotBody = Record<TProductCode, TPivot[]>

const bodyDemo = {
    "สินค้า A": [
        {
            docname: "sum",
            returnBaht: 10000,
            returnUnit: 10000,
            sellBaht: 10000000,
            sellUnit: 10000000,
            returnPercent: 0.1 // อย่าลืมปัดเศษ
        },
        {
            docname: "docname1",
            returnBaht: 100,
            returnUnit: 10,
            sellBaht: 1000,
            sellUnit: 100
        },
        {
            docname: "docname2",
            returnBaht: 100,
            returnUnit: 10,
            sellBaht: 1000,
            sellUnit: 100
        }
    ]
} satisfies TPivotBody

type TPivotHeader = {
    date?: string,
    docname?: string,
    sumDateSell?: number,
    sumDateReturn?: number
    totalSell?: number
    grandReturnPercent?: number
}[]

