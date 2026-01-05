'use server'

import prisma from "@/lib/prisma"
import { format } from "date-fns"

export async function getPivotDataByCustId({ custid = "C221100212" }: { custid?: string }) {
    console.log(custid)
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
            take: 6,
            orderBy: { id: "desc" }
        })
        console.log(documents)
        documents.reverse()

        const headerData = documents.map(e => {
            const date = format(e.created_at!, 'dd-MM-yy')
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
        const totalGrandSell = grandReturn + grandSell // ขาย + เปลี่ยน
        const grandReturnPercent = (totalGrandSell == 0)
            ? undefined :
            grandReturn / totalGrandSell
        // console.log(grandReturnPercent)
        const grandSummaryDate: TPivotHeader[number] = {
            grandReturnPercent: !!grandReturnPercent ? (Math.round(grandReturnPercent * 100) / 100) : undefined,
            totalSell: grandSell,
        }
        headerData.unshift(grandSummaryDate)
        console.log(headerData)


        const containers: any[] = []
        console.log(containers)

        documents.forEach((doc) => {
            const docname = doc.order_no
            // รวมเอาทั้งรายการขายและรายการคืนเข้าด้วยกันใน Array เดียว
            const sellingProduct = doc.customer_transaction.map(e => ({ ...e, docname, type: "sell" }))
            const returnProduct = doc.returngoods.map(e => ({ ...e, docname, type: "return" }))
            containers.push(...sellingProduct, ...returnProduct)
        })

        // 2. สร้าง List ของสินค้าที่มีทั้งหมด
        const productCodeList = Array.from(new Set(containers.map(e => e.product_code1)))
        console.log(productCodeList)
        const productCodeObject = {} as Record<string, any[]>
        for (let code of productCodeList) {
            productCodeObject[code] = []
        }
        // console.log(productCodeObject)

        for (let i of containers) {
            console.log(i)
            // const type = i.type
            const productCode = i.product_code1
            // console.log(type)
            // console.log(productCode)
            productCodeObject[productCode] = [...productCodeObject[productCode], i]
        }

        // console.log(productCodeObject)

        for (let code in productCodeObject) {
            // console.log(code)
            const lists = productCodeObject[code] as any[]
            const matchBox = Object.values(lists.reduce((prev, e) => {
                const { docname, netamt, sale_units, ret_unit, net_return_amt } = e;
                if (!prev[docname]) {
                    prev[docname] = { docname, returnBaht: 0, returnUnit: 0, sellBaht: 0, sellUnit: 0 };
                }
                if (net_return_amt) prev[docname].returnBaht += net_return_amt;
                if (ret_unit) prev[docname].returnUnit += ret_unit;
                if (netamt) prev[docname].sellBaht += netamt;
                if (sale_units) prev[docname].sellUnit += sale_units;
                return prev;
            }, {} as Record<string, any>));
            // console.log(matchBox)
            productCodeObject[code] = matchBox
        }
        console.log(productCodeObject)
        for (let it in productCodeObject) {
            // console.log(it)
            // ทำ เพิ่ม คำนวณ %เสีย และ ยอดรวมของสินค้านั้นๆ
            const list = productCodeObject[it]
            // console.log(list)
            const sellSum = list.reduce((prev, e) => (e.sellUnit || 0) + prev, 0)
            const retSum = list.reduce((prev, e) => (e.returnUnit || 0) + prev, 0)
            // console.log(sellSum)
            // console.log(retSum)
            const totalGrandSell = sellSum + retSum // ขาย + เปลี่ยน
            const retPercent = (totalGrandSell) != 0 ? Math.round((retSum / (totalGrandSell)) * 100) / 100 : undefined
            // console.log(retPercent)
            const tempObject = {
                returnUnit: retSum,
                sellUnit: sellSum,
                returnPercent: retPercent
            }
            list.unshift(tempObject)
            productCodeObject[it] = list
        }
        // console.log({ headerData, bodyData: productCodeObject })
        return { header: headerData, body: productCodeObject }
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


export type TPivotHeader = {
    date?: string,
    docname?: string,
    sumDateSell?: number,
    sumDateReturn?: number
    totalSell?: number
    grandReturnPercent?: number
}[]

