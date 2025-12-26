'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"


export type TUser = Prisma.UserGetPayload<{ include: { Account: true } }>

export default async function getUserList() {
    try {
        const users = await prisma.user.findMany(
            { include: { Account: true } }
        )
        // console.log(users)
        return users
    } catch (e) { console.log(e) }
}