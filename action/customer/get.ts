'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
type T = Prisma.AccountGetPayload<{ include: { User: true } }>

export default async function getCustList({ option, }: { option: boolean; }) {
    try {
        const custList = await prisma.customerDB.findMany({ where: { isActive: true, } })
        if (option) {
            return custList.map(e => ({ value: e.custcode, label: e.custcode + " " + e.custname }))
        }
        console.log(custList)
    } catch (e) { console.log(e) }
}