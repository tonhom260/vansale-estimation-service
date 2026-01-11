'use server'

import { CustomerOrderEstimation, Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"

export async function createFinetuneDocument(data: any) {
    console.log(data)
    const editBy = data.editBy
    console.log(editBy)
    try {
        const { daterange, saleman } = data
        const { from, to } = daterange
        console.log(saleman)
        console.log(from, to);
        (to as Date).setHours(23, 59, 59, 1000)
        console.log(to)
        const collectDocList = await prisma.documentDetail.findMany({
            include: { CustomerOrderEstimation: true },
            where: {
                areacode: saleman.value,
                effectiveDate: { gte: from, lt: to }
            }
        })
        console.log(collectDocList.map(e => e.CustomerOrderEstimation))
        const allList = collectDocList.map(e => e.CustomerOrderEstimation).flat()
        console.log(allList)
        const filter = allList.filter(e => e.productcode == "0451")
        console.log(filter)
        const sumAllList = allList.reduce((prev, item, index) => {
            const nextOrder = item.nextOrder || 0
            const itemcode = item.productcode
            if (prev.map(e => e.productcode).includes(itemcode)) {
                const matchObjIndex = prev.findIndex(e => e.productcode == itemcode)!
                const lastAmt = prev.find(e => e.productcode == itemcode)?.nextOrder || 0
                prev[matchObjIndex] = { ...prev[matchObjIndex], nextOrder: lastAmt + nextOrder }
                return prev
            } else {
                // console.log("object")
                prev.push(item)
                return prev
            }
        }, [] as CustomerOrderEstimation[])
        console.log(sumAllList)

        if (sumAllList.length > 0) {
            const netamount = sumAllList.reduce((p, e) => (e.nextOrder || 0) * (e.basicPrice || 0) + p, 0)
            const netunits = sumAllList.reduce((p, e) => (e.nextOrder || 0) + p, 0)

            const sumListSkipDocname = sumAllList.map(e => {
                const { docname, ...rest } = e
                return rest
            })
            const fineTuneDocumentName = `EST-${saleman.value}-${(to as Date).toJSON().slice(0, 10).replaceAll("-", "")}-FINETUNE`

            const createOrUpdate = await prisma.documentDetail.upsert({
                update: {
                    remark: "เพื่อปรับปรุงยอดก่อนสั่งผลิตและเบิกสินค้า",
                    netamount,
                    netunits,
                    responsible: editBy,
                    CustomerOrderEstimation: {
                        deleteMany: {},
                        createMany: { data: sumListSkipDocname }
                    }
                },
                create: {
                    remark: "เพื่อปรับปรุงยอดก่อนสั่งผลิตและเบิกสินค้า",
                    netamount,
                    netunits,
                    orderDocname: fineTuneDocumentName,
                    effectiveDate: from,
                    slmname: saleman.value,
                    responsible: editBy,
                    areacode: saleman.value,
                    CustomerOrderEstimation: {
                        createMany: { data: sumListSkipDocname }
                    }
                }, where: { orderDocname: fineTuneDocumentName }
            })
            console.log(createOrUpdate)
            return createOrUpdate
        }
    } catch (e) {
        console.log(e)
        const err = e as any
        if (err.code == "P2002") {
            throw Error("มีการสร้างเอกสารซ้ำ")
        }
    }
}