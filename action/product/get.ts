'use server'

import prisma from "@/lib/prisma"

export default async function getProductList() {
    try {
        const productList = await prisma.product_order.findMany()
        // console.log(productList)
        return productList
    } catch (e) { console.log(e) }
}