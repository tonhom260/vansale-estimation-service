import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const product = await prisma.product_order.findMany({
        where: {
            productcategory: { in: ["DRINKPRODUCT", "OISHI_LOAF", "OISHI_TRADE", "OISHI_MAN"] }
        }
    })
    // console.log(product.map(e => e.product_code1))
    const prodList = product.map(e => e.product_code1)

    for (let p of prodList) {
        const result = await prisma.product_Unit_Conversion.create({
            data: {
                product_code: p,
                unit_id: 2,
                conversion_factor: 30,
            }
        })
        console.log(result)
    }


    return NextResponse.json("done")
}