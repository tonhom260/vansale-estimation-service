'use client'
import getProductList from "@/action/product/get";
import getUserList, { TUser } from "@/action/user/get";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const getSession = async () => {
    try {
      // rewrite next-config
      const response = await fetch("/api/auth/session", {
        method: "GET",
        // 💡 สำคัญ: ต้องใส่บรรทัดนี้เพื่อให้ Browser ยอมส่งคุกกี้ next-auth ติดไปด้วย
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("fet")
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("CORS or Network Error:", error);
    }
  };

  useEffect(() => {
    getSession()
  }, [])

  const [user, setUser] = useState<TUser[]>([])
  // console.log(user)

  async function getUsers() {
    const user = await getUserList()
    setUser(user!)
  }

  async function getProduct() {
    console.log("object")
    const product = await getProductList()
    console.log(product)
  }

  useEffect(() => {
    getProduct()
    getUsers()
  }, [])

  // impl กด enter แล้ว ขยับ
  const input1Ref = useRef<HTMLInputElement>(null)
  const input2Ref = useRef<HTMLInputElement>(null)
  const input3Ref = useRef<HTMLInputElement>(null)
  const refList = [input1Ref, input2Ref, input3Ref]

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === "Enter") {
      e.preventDefault() // ป้องกันการเผลอ submit form
      nextRef.current?.focus() // ย้าย focus ไปที่ถัดไป
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex min-h-screen w-full  flex-col items-center justify-between  bg-white  sm:items-start p-8">
        <table className="table-auto w-full min-w-[1400px]  border-separate border-spacing-0 border rounded-xl  text-black text-sm bg-white">
          <thead className=''>
            <tr className='border-b pl-11  h-10 '>
              <th className='flex-1 border-b pl-8 text-start text-[14px] min-w-[220px]  font-[400]'>วันที่</th>
              <th className='border-b pl-2 text-start text-[14px] w-full   font-[400]'>รายละเอียด</th>
              <th className='border-b pl-2 text-start text-[14px] min-w-[120px]   font-[400]'>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr className='min-h-14 h-14  text-sm  text-[18px]'>
              <td className={` ${true ? "" : "border-b"} pl-8 h-14   flex items-center  `}>
                <input
                  ref={refList?.at(0)}
                  onKeyDown={(e) => handleKeyDown(e, refList!.at(1)!)}
                />
              </td>
              <td className={` ${true ? "" : "border-b"} pl-2 text-[#0A0A0A] `} >{"desc"}</td>
              <td className={` ${true ? "" : "border-b"} pl-2 text-[#0A0A0A] `} >
                <div className='flex text-[#000000] '>
                  <div className='w-4' />
                </div>
              </td>
            </tr>
            <tr className='min-h-14 h-14  text-sm  text-[18px]'>
              <td className={` ${true ? "" : "border-b"} pl-8 h-14   flex items-center  `}>
                <input ref={refList?.at(1)} onKeyDown={(e) => handleKeyDown(e, refList!.at(2)!)} />
              </td>
              <td className={` ${true ? "" : "border-b"} pl-2 text-[#0A0A0A] `} >{"desc"}</td>
              <td className={` ${true ? "" : "border-b"} pl-2 text-[#0A0A0A] `} >
                <div className='flex text-[#000000] '>
                  <div className='w-4' />
                </div>
              </td>

            </tr>
            <tr className='min-h-14 h-14  text-sm  text-[18px]'>
              <td className={` ${true ? "" : "border-b"} pl-8 h-14   flex items-center  `}>
                <input ref={refList?.at(2)} />
              </td>
              <td className={` ${true ? "" : "border-b"} pl-2 text-[#0A0A0A] `} >{"desc"}</td>
              <td className={` ${true ? "" : "border-b"} pl-2 text-[#0A0A0A] `} >
                <div className='flex text-[#000000] '>
                  <div className='w-4' />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
