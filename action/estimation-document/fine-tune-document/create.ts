'use server'

import prisma from "@/lib/prisma"
import { addDays } from "date-fns"

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


        // const netamount = sumAllList.reduce((p, e) => (e.nextOrder || 0) * (e.basicPrice || 0) + p, 0)
        // const netunits = sumAllList.reduce((p, e) => (e.nextOrder || 0) + p, 0)

        const fineTuneDocumentName = `EST-${saleman.value}-${(to as Date).toJSON().slice(0, 10).replaceAll("-", "")}-FINETUNE`
        const effectiveDate = addDays(new Date(from), 1)
        const createOrUpdate = await prisma.documentDetail.upsert({
            update: {
                // ถ้ามัน update เอกสารเดิม ไม่ต้องทำอะไร 
                effectiveDate: effectiveDate,
            },
            create: {
                remark: "เพื่อปรับปรุงยอดก่อนสั่งผลิตและเบิกสินค้า",
                netamount: 0,
                netunits: 0,
                orderDocname: fineTuneDocumentName,
                effectiveDate: effectiveDate,
                slmname: saleman.value,
                responsible: editBy,
                areacode: saleman.value,
            }, where: { orderDocname: fineTuneDocumentName }
        })
        console.log(createOrUpdate)
        return createOrUpdate
    } catch (e) {
        console.log(e)
        const err = e as any
        if (err.code == "P2002") {
            throw Error("มีการสร้างเอกสารซ้ำ")
        }
    }
}