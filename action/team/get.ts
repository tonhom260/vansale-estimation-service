'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
export type TEstDoc = Prisma.DocumentDetailGetPayload<{
    include: {
        customerDB: { select: { custname: true } }
    }
}>


export async function getTeamList({ option, }: { option: boolean; }) {
    try {
        const team = await prisma.sellingArea.findMany({
            include: { User: true }
        })
        console.log(team)
        if (option) {
            return team.map(e => ({ value: e.areacode, label: e.areaname }))
        }
        return team
    } catch (e) { console.log(e) }
}