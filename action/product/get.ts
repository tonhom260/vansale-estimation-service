'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
type T = Prisma.AccountGetPayload<{ include: { User: true } }>

export default async function getProductList() {
    try {

        const catList = await prisma.product_order.findMany({
            select: { productcategory: true },
            distinct: ['productcategory'], where: { isActive: true, productcategory: { notIn: ["ASSET", "WASTE", "SPECIALPRODUCT"] } }
        })

        console.log(catList)

        const productList = await prisma.product_order.findMany({ where: { isActive: true, productcategory: { notIn: ["ASSET", "WASTE", "SPECIALPRODUCT"] } } })

        console.log(productList)
        return { items: productList, cat: catList.map(e => e.productcategory!) }
    } catch (e) { console.log(e) }
}