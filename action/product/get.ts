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

        const productList = await prisma.product_order.findMany({
            include: {
                Product_Unit_Conversion: {
                    select: {
                        // unit_id: true,
                        conversion_factor: true,
                    },
                    where: { Product_unit: { unit_name: "หิ้ว" } }
                }
            },
            where: { isActive: true, productcategory: { notIn: ["ASSET", "WASTE", "SPECIALPRODUCT"] } }
        })
        // console.log(productList)
        const convertProductList = productList.map(e => ({ ...e, conversion_factor: (e.Product_Unit_Conversion?.at(0)?.conversion_factor) || 1, Product_Unit_Conversion: undefined }))
        // console.log(convertProductList)
        return { items: convertProductList, cat: catList.map(e => e.productcategory!) }
    } catch (e) { console.log(e) }
}