'use server'

import { Prisma } from "@/generated/prisma/client"
import prisma from "@/lib/prisma"
type T = Prisma.AccountGetPayload<{ include: { User: true } }>

export default async function getProductList() {
    try {

        // const p = await prisma.product_order.findFirst({include:{}})

        const catList = await prisma.product_order.findMany({
            select: { productcategory: true },
            distinct: ['productcategory'], where: { isActive: true, productcategory: { notIn: ["ASSET", "WASTE", "SPECIALPRODUCT"] } }
        })

        const productList = await prisma.product_order.findMany({
            include: {
                Product_Unit_Conversion: {
                    select: {
                        unit_id: true,
                        conversion_factor: true,
                        Product_unit: {
                            select: {
                                unit_name: true
                            }
                        }
                    },
                    where: { Product_unit: { unit_name: "หิ้ว" } }
                }
            },
            where: { isActive: true, productcategory: { notIn: ["ASSET", "WASTE", "SPECIALPRODUCT"] } }
        })

        console.log(productList)
        return { items: productList, cat: catList.map(e => e.productcategory!) }
    } catch (e) { console.log(e) }
}