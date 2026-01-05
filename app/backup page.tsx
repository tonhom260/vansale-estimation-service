// 'use client'
// import { GrDocumentExcel } from "react-icons/gr";
// import { IoCloudDownloadOutline } from "react-icons/io5";
// import { HiMiniMagnifyingGlass, HiOutlineTrash, HiXMark } from "react-icons/hi2";
// import getProductList from "@/action/product/get";
// import getUserList, { TUser } from "@/action/user/get";
// import { Ref, useEffect, useMemo, useRef, useState } from "react";
// import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
// import { Prisma, product_order } from "@/generated/prisma/client"
// import TextField from '@mui/material/TextField';
// import colors from 'tailwindcss/colors'
// import { useLocalStorage } from 'usehooks-ts'

// const defaultValues = {
//   queryId: "",
//   queryName: "",
//   queryUnitPrice: "",
//   queryPackCount: "",
//   queryValue: "",
//   filterProduct: [] as (product_order & { input?: string })[]
// }

// export type TUseform = UseFormReturn<typeof defaultValues>

// export default function EstimationInput() {


//   const useform = useForm({ defaultValues })

//   const { setValue, watch, control, register } = useform
//   console.log(watch("filterProduct"))

//   const useformArray = useFieldArray({ name: "filterProduct", control })
//   const { append, fields, insert, move, prepend, remove, replace, swap, update } = useformArray
//   console.log(fields)


//   const valueList = watch("filterProduct").filter(e => !!e.input && e.input !== "0")
//   console.log(valueList)
//   const [selectIndex, setSelectIndex] = useState(0)



//   const getSession = async () => {
//     try {
//       // rewrite next-config
//       const response = await fetch("/api/auth/session", {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//     }
//   };

//   useEffect(() => {
//     getSession()
//   }, [])

//   const [user, setUser] = useState<TUser[]>([])
//   console.log(user)
//   // console.log("run")

//   async function getUsers() {
//     const user = await getUserList()
//     setUser(user!)
//   }

//   // measurement ...
//   const [measure, setMeasure, removeMeasurement] = useLocalStorage('measurement_unit', { "OISHI": "group", "KITZ": "single" })
//   console.log(measure)

//   const [mainPick, setMainPick] = useState<"OISHI" | "KITZ">("OISHI")

//   useEffect(() => {
//     setSelectIndex(0)
//   }, [mainPick])

//   const [radioPick, setRadioPick] = useState<"single" | "group">("single")
//   console.log(radioPick)

//   useEffect(() => {
//     setRadioPick(measure[mainPick] as any)
//   }, [mainPick, measure])


//   function changeRadioHandler(value: any) {
//     console.log("object")
//     console.log(mainPick)
//     console.log(value)
//     console.log({ ...measure, [mainPick]: value })
//     setMeasure({ ...measure, [mainPick]: value })
//   }

//   const [catList, setCatList] = useState<string[]>([])
//   console.log(catList)
//   // const filterCatList = catList.filter(e => e.includes(mainPick))
//   // const len = filterCatList.length
//   // console.log(catlistNumber)
//   // const catlistNumber = catList?.length
//   const catlistNumber = catList.filter(e => e.includes(mainPick))?.length ?? 0
//   console.log(catList.filter(e => e.includes(mainPick)))
//   console.log(catlistNumber)

//   async function getProduct() {
//     // console.log("object")
//     const product = await getProductList()
//     // console.log(product)
//     if (!!product) {
//       console.log(product.cat)
//       setCatList(product.cat ?? [])
//       setValue("filterProduct", product.items)
//     }
//   }

//   useEffect(() => {
//     getProduct()
//     getUsers()
//   }, [])


//   const itemRefs = useRef<Record<string, HTMLInputElement | null>>({});

//   const handleKeyDown = (e: React.KeyboardEvent, currentProduct: any, visibleItems: any[]) => {
//     console.log(visibleItems)
//     if (e.key === "Enter") {
//       console.log("enter")
//       e.preventDefault();

//       // หาตำแหน่งปัจจุบันในรายการที่ "กำลังแสดงผลอยู่"
//       const currentIndex = visibleItems.findIndex(item => item.product_code1 === currentProduct.product_code1);
//       console.log(currentIndex)
//       const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;

//       if (nextIndex >= 0 && nextIndex < visibleItems.length) {
//         const nextProductCode = visibleItems[nextIndex].product_code1;
//         const nextInput = itemRefs.current[nextProductCode];

//         if (nextInput) {
//           nextInput.focus();
//           nextInput.select();
//         }
//       }
//     }
//   };

//   const downloadCSV = (data: any[]) => {
//     if (data.length === 0) return;

//     // 1. ดึง Header จาก keys ของ object ตัวแรก
//     const headers = Object.keys(data[0]).join(",");

//     // 2. แปลงข้อมูลแต่ละแถวเป็น string
//     const rows = data.map(row =>
//       Object.values(row)
//         .map(value => `"${value}"`) // หุ้มด้วยฟันหนูเพื่อป้องกันปัญหาถ้าข้อมูลมีเครื่องหมาย ,
//         .join(",")
//     );

//     // 3. รวม Header และ Rows เข้าด้วยกัน
//     const csvContent = [headers, ...rows].join("\n");

//     // 4. สร้าง Blob และสั่ง Download
//     const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = url;
//     link.setAttribute("download", "data.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const selectedList = useMemo(() => {
//     return watch("filterProduct")?.filter((e, i) => {
//       console.log(e.input)
//       console.log(e)
//       console.log(mainPick)
//       const itemCat = e.productcategory ?? ""
//       const acceptMainCat = catList.filter(e => e.includes(mainPick))
//       if (!acceptMainCat.includes(itemCat)) {
//         console.log(i)
//         return false
//       }

//       const mainFilterCheck = itemCat == acceptMainCat!.at(selectIndex)!
//       console.log(mainFilterCheck)
//       if (!mainFilterCheck) {
//         console.log(i)
//         return false
//       }
//       console.log("object")
//       if (!!watch("queryId")) {
//         console.log(i)
//         const productCode = e.product_code1
//         if (!productCode.includes(watch("queryId"))) {
//           return false
//         }
//       }
//       if (!!watch("queryName")) {
//         console.log(i)
//         const productName = e.product_name ?? ""
//         if (!productName.includes(watch("queryName"))) {
//           return false
//         }
//       }
//       if (!!watch("queryUnitPrice")) {
//         console.log(i)
//         const productUnitPrice = e.basicPrice ?? ""
//         if (!productUnitPrice?.toString()?.includes(watch("queryUnitPrice"))) {
//           return false
//         }
//       }
//       if (!!watch("queryValue")) {
//         console.log(watch("queryValue"))
//         const inputValue = e.input ?? ""
//         if (!!inputValue) { console.log(inputValue) }
//         console.log(inputValue)
//         if (!inputValue?.includes(watch("queryValue"))) {
//           return false
//         }
//       }
//       console.log("pass")
//       return true
//     })
//   }, [
//     mainPick,
//     watch("filterProduct"),
//     selectIndex,
//     watch("queryId"),
//     watch("queryName"),
//     watch("queryPackCount"),
//     watch("queryUnitPrice"),
//     watch("queryValue"),
//   ])
//   console.log(selectedList)


//   useEffect(() => {
//     const filterCatList = catList.filter(e => e.includes(mainPick))
//     const len = filterCatList.length
//     // console.log(catlistNumber)
//     if (!len || len == 0) return

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!e.shiftKey) return;
//       // const firstId = selectedList.at(0)?.product_code1
//       // console.log(firstId)
//       if (e.key === "ArrowRight") {
//         setSelectIndex(prev => (prev >= (len - 1) ? prev : prev + 1));
//       }
//       if (e.key === "ArrowLeft") {
//         setSelectIndex(prev => (prev <= 0 ? prev : prev - 1));
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);

//     // ✅ Cleanup function: ลบ listener เมื่อ component unmount หรือ render ใหม่
//     return () => window.removeEventListener("keydown", handleKeyDown);
//     // }, [catList, selectedList]); // [] ตรวจสอบให้แน่ใจว่ารันแค่ครั้งเดียวตอน mount
//   }, [catList, mainPick]); // [] ตรวจสอบให้แน่ใจว่ารันแค่ครั้งเดียวตอน mount


//   function filterProductAndReturn(input: any) {
//     const itemCat = input.productcategory ?? ""
//     const acceptMainCat = catList.filter(e => e.includes(mainPick))
//     console.log()
//     console.log(!acceptMainCat.includes(itemCat), acceptMainCat, itemCat)
//     if (!acceptMainCat.includes(itemCat)) {
//       console.log(input)
//       return null
//     }
//     const mainFilterCheck = itemCat == acceptMainCat!.at(selectIndex)!
//     if (!mainFilterCheck) {
//       return null
//     }
//     // console.log("object")
//     if (!!watch("queryId")) {

//       const productCode = input.product_code1
//       if (!productCode.includes(watch("queryId"))) {
//         return null
//       }
//     }
//     if (!!watch("queryName")) {

//       const productName = input.product_name ?? ""
//       if (!productName.includes(watch("queryName"))) {
//         return null
//       }
//     }
//     if (!!watch("queryUnitPrice")) {

//       const productUnitPrice = input.basicPrice ?? ""
//       if (!productUnitPrice?.toString()?.includes(watch("queryUnitPrice"))) {
//         return null
//       }
//     }
//     if (!!watch("queryValue")) {

//       const inputValue = input.input ?? ""
//       if (!inputValue?.includes(watch("queryValue"))) {
//         return null
//       }
//     }
//     // console.log("object")
//     return input
//   }

//   useEffect(() => {
//     // เมื่อเปลี่ยนหมวดหมู่ (selectIndex เปลี่ยน) หรือมีการ Filter
//     // ให้โฟกัสไปที่ Input ตัวแรกในรายการที่มองเห็น (selectedList)
//     if (selectedList && selectedList.length > 0) {
//       const firstProductCode = selectedList[0].product_code1;
//       const firstInput = itemRefs.current[firstProductCode];
//       if (firstInput) {
//         firstInput.focus();
//         firstInput.select();
//       }
//     }
//   }, [selectIndex]); // ทำงานทุกครั้งที่เปลี่ยนหมวดหมู่

//   // เพิ่ม state นี้ไว้ด้านบนของ EstimationInput
//   const [isMounted, setIsMounted] = useState(false);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   const headerUnit = isMounted ? (measure[mainPick] == "group" ? "หิ้ว" : "ชิ้น") : "ชิ้น";
//   console.log(headerUnit)

//   return (
//     <div className=" 2xl:flex min-h-screen items-start justify-center bg-zinc-50 text-black font-medium overflow-hidden pl-4">
//       <main className="flex flex-col min-h-screen w-full h-full   items-center   sm:items-start p-8 pt-4 ">
//         <div className="w-full h-20 pl-3">
//           <div className="flex justify-between items-start">
//             <div className="text-3xl">ร้านค้านายกอ</div>
//             <div className="border-2 rounded-xl border-gray-300 flex">
//               <div className="w-[300px] p-2 border-r border-gray-300 text-center">
//                 <div className="text-gray-600 text-xl text-center">สายขาย</div>
//                 <div className="font-bold">สายตจว 5</div>
//               </div>
//               <div className="w-[300px] p-2 text-center">
//                 <div className="text-gray-600 text-xl">วันที่ทำประมาณการ</div>
//                 <div className="font-bold">2 มกราคม 2560</div>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <div className="hover:cursor-pointer p-3 border-gray-600 border rounded-xl flex items-center">
//                 <IoCloudDownloadOutline />
//                 <span className="ml-2">
//                   ดึงข้อมูลจากระบบ
//                 </span>
//               </div>
//               <div
//                 className="hover:cursor-pointer p-3 border-gray-600 border rounded-xl flex items-center"
//                 onClick={() => {
//                   downloadCSV([
//                     [1, 2, 3],
//                     [1, 2, 3],
//                     [1, 2, 3]
//                   ])
//                 }}
//               >
//                 <GrDocumentExcel />

//                 <span className="ml-2">
//                   Export CSV
//                 </span>
//               </div>
//             </div>
//           </div >


//         </div>
//         <div className="flex items-center justify-between w-full">
//           <div className="flex items-start mb-4">
//             <div className="flex py-2">
//               <div
//                 className={`hover:cursor-pointer ${mainPick == "OISHI" && "border-b-3 text-red-700 border-red-700"} pt-2 pb-3 text-xl px-4 font-extrabold `} onClick={() => { setMainPick("OISHI") }}>
//                 ทำประมาณการสินค้าเดอะโออิชิ
//               </div>
//               <div
//                 className={`${mainPick == "KITZ" && "border-b-3 text-orange-600 border-orange-600"}  hover:cursor-pointer pt-2 pb-3 text-xl px-4 font-extrabold `} onClick={() => { setMainPick("KITZ") }}>
//                 ทำประมาณการสินค้าเดอะคิทซ์
//               </div>
//             </div>


//           </div>
//           <div className="min-w-[200px]">
//             <div className="  rounded-xl p-2 w-44 flex items-center w-full">
//               <div className="w-[140px]">
//                 เลือกหน่วยนับสินค้า
//               </div>
//               <div className="ml-2">
//                 <RowRadioButtonsGroup value={radioPick} setValue={changeRadioHandler} />
//               </div>
//             </div>
//           </div>

//         </div>
//         <div className="w-full h-[calc(100vh-250px)] overflow-y-auto " style={{ scrollbarWidth: "none" }}>
//           {/* <table className=" table-auto w-full  rounded-xl   border-separate border-spacing-0   text-black text-sm bg-white"> */}
//           <table className="table-auto 2xl:table-fixed w-full border-separate border-spacing-0 text-black text-sm">
//             {/* <table className=" w-full border-collapse "> */}
//             <thead className={`rounded-xl w-full sticky top-0 ${mainPick == "OISHI" ? "bg-[#e7000b] text-white" : "bg-orange-500"} `} >
//               {/* <tr className='h-10 '> */}
//               <tr className='h-10  w-full text-[12px] 2xl:text-[16px] '>
//                 <th className='pl-4  px-2 text-start  rounded-tl-xl font-[400] w-[130px] '>
//                   <div className="py-4">
//                     <div className="font-extrabold  ">รหัสสินค้า</div>
//                     <div className="mt-2 text-black bg-white rounded-xl inline-flex items-center h-[40px]">
//                       <div className="mx-2"><HiMiniMagnifyingGlass className="text-xl" /></div>
//                       <TextField
//                         autoComplete="off"
//                         slotProps={{ input: { disableUnderline: true } }}
//                         size="small"
//                         variant="standard"
//                         sx={{ background: "white" }}
//                         {...register("queryId")}
//                       />
//                       <div className="mx-2"><HiXMark className="text-xl" onClick={() => setValue("queryId", "")} /></div>
//                     </div>
//                   </div>
//                 </th>
//                 <th className=' px-2 text-start   font-[400]  w-[300px]'>
//                   <div className="py-4 ">
//                     <div className="font-extrabold ">ชื่อสินค้า</div>
//                     <div className="mt-2 text-black bg-white rounded-xl inline-flex items-center h-[40px] w-full ">
//                       <div className="mx-2"><HiMiniMagnifyingGlass className="text-xl" /></div>
//                       <TextField
//                         autoComplete="off"
//                         fullWidth
//                         slotProps={{ input: { disableUnderline: true } }}
//                         size="small"
//                         variant="standard"
//                         sx={{ background: "white" }}
//                         {...register("queryName")}
//                       />
//                       <div className="mx-2"><HiXMark className="text-xl" onClick={() => setValue("queryName", "")} /></div>
//                     </div>
//                   </div>
//                 </th>
//                 <th className='  px-2 text-start  font-[400] w-[120px]'>
//                   <div className="py-4">
//                     <div className="font-extrabold ">ราคา/หน่วย</div>
//                     <div className="mt-2 text-black bg-white rounded-xl inline-flex items-center h-[40px]">
//                       <div className="mx-2"><HiMiniMagnifyingGlass className="text-xl" /></div>
//                       <TextField
//                         autoComplete="off"
//                         slotProps={{ input: { disableUnderline: true } }}
//                         size="small"
//                         variant="standard"
//                         sx={{ background: "white" }}
//                         {...register("queryUnitPrice")}
//                       />
//                       <div className="mx-2"><HiXMark className="text-xl" onClick={() => setValue("queryUnitPrice", "")} /></div>
//                     </div>
//                   </div>
//                 </th>
//                 <th className='  px-2 text-start  font-[400] w-[120px]'>
//                   <div className="py-4">
//                     <div className="font-extrabold ">หน่วยนับ</div>
//                     <div className="mt-2 text-black bg-white rounded-xl inline-flex items-center h-[40px]">
//                       <div className="mx-2"><HiMiniMagnifyingGlass className="text-xl" /></div>
//                       <TextField
//                         autoComplete="off"
//                         slotProps={{ input: { disableUnderline: true } }}
//                         size="small"
//                         variant="standard"
//                         sx={{ background: "white" }}
//                         {...register("queryPackCount")}
//                       />
//                       <div className="mx-2"><HiXMark className="text-xl" onClick={() => setValue("queryPackCount", "")} /></div>
//                     </div>
//                   </div>
//                 </th>
//                 <th className='  px-2 text-start  font-[400] w-[120px]'>
//                   <div className="py-4 pr-4">
//                     <div className="font-extrabold  line-clamp-1 ">บันทึกล่าสุด</div>
//                     <div className="text-black mt-2 rounded-xl  h-[40px] flex items-center px-2 text-[10px] bg-white">
//                       10,000
//                     </div>
//                   </div>
//                 </th>
//                 <th className='  px-2 text-start  font-[400] w-[120px]'>
//                   <div className="py-4">
//                     <div className="font-extrabold ">ยอดสั่ง/<span className="underline">{headerUnit}</span></div>
//                     <div className="text-black mt-2 bg-white rounded-xl inline-flex items-center h-[40px]">
//                       <div className="mx-2"><HiMiniMagnifyingGlass className="text-xl" /></div>
//                       <TextField
//                         autoComplete="off"
//                         slotProps={{ input: { disableUnderline: true } }}
//                         size="small"
//                         variant="standard"
//                         sx={{ background: "white" }}
//                         {...register("queryValue")}
//                       />
//                       <div className="font-bold text-sm pt-1">{headerUnit}</div>
//                       <div className="mx-2"><HiXMark className="text-xl" onClick={() => setValue("queryValue", "")} /></div>
//                     </div>
//                   </div>
//                 </th>
//                 <th className='  px-2 text-start    rounded-tr-xl   font-[400] w-[160px]'>
//                   <div className="py-4 pr-4">
//                     <div className="font-extrabold  line-clamp-1 ">ยอดรวม</div>
//                     <div className="text-black mt-2 rounded-xl  h-[40px] flex items-center pl-4 text-[12px] bg-white">
//                       10,000
//                     </div>
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="   w-full divide-y divide-gray-100 ">
//               {
//                 watch("filterProduct").map((field, i) => {
//                   const filterObject = filterProductAndReturn(field)
//                   console.log(filterObject)
//                   if (!filterObject) {
//                     return null
//                   }
//                   // if (field.productcategory !== catList.at(selectIndex)) return null;
//                   return (
//                     <BodyRow
//                       setRef={(el: any) => (itemRefs.current[filterObject.product_code1] = el)}
//                       register={register}
//                       key={field.product_code1}
//                       product={filterObject} onKeyDown={(e: any) => handleKeyDown(e, filterObject, selectedList)} index={i} />
//                   )
//                 })
//               }
//             </tbody>
//           </table>
//         </div>
//         <div className="flex flex-col items-center justify-center w-full mt-2 bg-gray-200 pt-2">
//           <div className="flex gap-2 font-bold">
//             {
//               Array.from({ length: catlistNumber }, (_, i) => {
//                 return (
//                   // ${mainPick == "OISHI" ? "bg-red-600" : "bg-orange-500"}
//                   <div onClick={() => { setSelectIndex(i) }} key={i}
//                     style={{
//                       background: selectIndex == i ? (mainPick == "OISHI" ? colors.red[600] : colors.orange[500]) : "",
//                       color: selectIndex == i ? "white" : "",
//                       border: selectIndex == i ? "none" : undefined

//                     }}
//                     className={`border pb-1 pt-2  px-3 hover:cursor-pointer rounded-xl`}>
//                     {catList.filter(e => e.includes(mainPick))?.at(i) ?? ""}
//                   </div>
//                 )
//               })
//             }
//           </div>
//           <div className="text-center mt-2">กด shift + ปุ่ม Arrow ด้านซ้าย หรือ ขวา เพื่อเลื่อนตัวกรอง </div>
//         </div>
//       </main >
//       <div className="min-w-125 max-w-[50%] p-4 px-6 h-screen bg-gray-50 shadow-2xl">
//         <div className="h-40 px-10 flex items-center justify-center">
//           <div className="w-full ">
//             <div className="grid grid-cols-4 gap-4 mx-auto  text-center text-gray-500 font-bold">
//               <div>หน่วยนับ</div>
//               <div>ปัจจุบัน</div>
//               <div>เป้าหมาย</div>
//               <div className="text-red-600 font-bold">diff</div>
//             </div>
//             <div className="grid grid-cols-4 gap-4 mx-auto  text-center">
//               <div className="font-bold">บาท</div>
//               <div>1200</div>
//               <div>1400</div>
//               <div className="text-red-600 font-bold">-200</div>
//             </div>
//             <div className="grid grid-cols-4 gap-4 mx-auto  text-center">
//               <div className="font-bold">ชิ้น</div>
//               <div>120</div>
//               <div>140</div>
//               <div className="text-red-600 font-bold">-20</div>
//             </div>
//           </div>
//         </div>
//         <div className="w-full  h-[calc(100vh-200px)] rounded-xl p-4 shadow-2xl">
//           <div className="flex flex-col gap-2 h-full  overflow-y-auto pr-4">
//             {
//               valueList.map((e, i) => {
//                 const productCat = e.productcategory
//                 const isOishi = productCat?.includes("OISHI")
//                 console.log(isOishi)
//                 const type = isOishi ? "OISHI" : "KITZ"
//                 const unit = measure[type] == "group" ? "หิ้ว" : "ชิ้น"
//                 console.log(unit)
//                 const index = fields.findIndex(it => it.product_code1 == e.product_code1)
//                 console.log(index)

//                 return <Card setValue={setValue} currentUnit={unit} key={i} product={e} fields={fields} order={i + 1} index={index} />
//               })
//             }
//           </div>
//         </div>
//       </div>
//     </div >
//   );
// }


// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";

// export function RowRadioButtonsGroup({ value, setValue }: { value: any, setValue: any }) {
//   return (
//     <FormControl  >
//       <RadioGroup
//         value={value}
//         row
//         aria-labelledby="demo-row-radio-buttons-group-label"
//         name="row-radio-buttons-group"
//         onChange={(e) => {
//           console.log(e.target.value);
//           setValue(e.target.value)
//         }}
//       >
//         <FormControlLabel sx={{ fontFamily: 'var(--font-ibm-sans)' }} value="single" control={<Radio />} label={<Typography sx={{ fontFamily: 'var(--font-ibm-sans)', fontWeight: 500 }}>ชิ้น</Typography>} />
//         <FormControlLabel value="group" control={<Radio />} label={<Typography sx={{ fontFamily: 'var(--font-ibm-sans)', fontWeight: 500 }}>หิ้ว</Typography>} />
//       </RadioGroup>
//     </FormControl>
//   );
// }

// function BodyRow({ setRef, onKeyDown, product, index, register }: { setRef: any; onKeyDown: any; product: product_order & { id: string, input: string }; index: number; register: any }) {

//   console.log(product)
//   console.log(register(`filterProduct.${index}.input`))
//   console.log(`filterProduct.${index}.input`)
//   const { product_name, product_code1, basicPrice, input } = product
//   const { ref: registerRef, ...rest } = register(`filterProduct.${index}.input`);
//   // const value = register(`filterProduct.${index}.input`).name
//   // console.log(typeof registerRef)
//   console.log(product.input)

//   return (
//     <tr className="transition-colors focus-within:bg-blue-50 text-[16px] font-bold bg-white">
//       <td className="border-b  border-gray-200 pl-8 text-gray-500">{product_code1}</td>
//       <td className="border-b  border-gray-200 pl-8">
//         {product_name}
//       </td>
//       <td className="border-b  border-gray-200 pl-8 text-gray-500">
//         {basicPrice}
//       </td>
//       <td className="border-b  border-gray-200 pl-8">
//         {"30"}
//       </td>
//       <td className="border-b  border-gray-200 pl-8">
//         {"last saved"}
//       </td>
//       <td className="border-b  border-gray-200 px-4 ">
//         <div className="flex items-center h-full py-1">
//           <input
//             autoComplete="off"
//             className="bg-gray-50 w-full border-b border-gray-200 rounded-md 2xl:h-10  pl-4 text-[16px] font-extrabold text-blue-600  "
//             onKeyDown={onKeyDown}
//             ref={(el) => {
//               registerRef(el)
//               setRef(el)
//             }}
//             {...rest}
//             value={input ?? ""}
//           />
//         </div>
//       </td>
//       <td className=" border-gray-200 pl-8 border-b">
//         {
//           !!product.input ? (+input * +basicPrice!).toFixed(1) : ""
//         }
//       </td>
//     </tr >
//   )
// }


// function Card({ setValue, product, fields, order, currentUnit, index }: { setValue: any; product: any, fields: any[]; order: number, currentUnit: string; index: number }) {
//   // console.log(currentUnit)
//   const { basicPrice, product_name, product_code1, input } = product
//   const minus2 = () => { setValue(`filterProduct.${index}.input`, (+input - 1).toString()) }
//   const plus1 = () => { setValue(`filterProduct.${index}.input`, (+input + 1).toString()) }

//   return (
//     <div className="flex h-[140px] w-full select-none  rounded-md bg-white shadow shadow-gray-200">
//       <div className="flex-1">
//         <div className="w-full h-full p-4 px-5 flex">
//           <div className="h-full">
//             <div className="aspect-square h-[80%] border border-gray-300 rounded-xl flex items-center justify-center">picture</div>
//             <div className="flex  mt-2">
//               <div className="h-[30px] flex">
//                 <div className="border border-gray-300 hover:cursor-pointer rounded-full aspect-square h-5 flex justify-center items-center"
//                   onClick={minus2}>-</div>
//                 <div className="w-10 h-[20px]">
//                   <TextField
//                     value={input}
//                     onChange={(e) => {
//                       const value = e.target.value
//                       // update(targetIndex, { ...targetObject, input: value } as any)
//                       setValue(`filterProduct.${index}.input`, value)
//                     }}

//                     size="small"
//                     sx={{
//                       // จัดตำแหน่งกล่อง Input ให้กึ่งกลาง (ถ้า TextField มีความกว้าง)
//                       "& .MuiInput-root": {
//                         justifyContent: "center",
//                       },
//                     }}
//                     slotProps={{
//                       input: {
//                         onFocus: (event) => {
//                           event.target.select();
//                         },
//                         disableUnderline: true,
//                         sx: {
//                           border: "1px solid #d1d5dc",
//                           borderRadius: 1,
//                           marginInline: "2px",
//                           height: 22,
//                           textAlign: "center", // จัดตัวหนังสือและ Cursor ให้อยู่ตรงกลาง
//                           "& input": {
//                             textAlign: "center", // เน้นย้ำที่ตัว input element ภายใน
//                           },
//                         },
//                       },
//                     }}
//                     variant="standard" />
//                 </div>
//                 <div className="border border-gray-300 hover:cursor-pointer rounded-full aspect-square h-5 flex justify-center items-center" onClick={plus1}>+</div>
//               </div>
//               <div className="h-[30px] ml-2 pt-1 font-extrabold text-[12px] text-blue-600 ">{currentUnit}</div>
//             </div>
//           </div>
//           <div className="flex-1 pl-2">
//             <div className="text-[18px] font-bold mt-2">{order}. {product_name}</div>
//             <div className="flex gap-4">
//               <div className="text-[14px] ">
//                 <div className="mt-2 text-gray-500">
//                   ราคาขาย
//                 </div>
//                 <div>{basicPrice} บาท/ชิ้น</div>
//               </div>
//               <div className="text-[14px] ">
//                 <div className="mt-2 text-gray-500">
//                   รวมท้ังหมด
//                 </div>
//                 <div> {
//                   !!product.input ? (+input * +basicPrice!).toFixed(1) : ""
//                 } บาท</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div onClick={() => {
//         setValue(`filterProduct.${index}.input`, "")
//         // update(targetIndex, { ...targetObject, input: "" } as any)
//       }} className="h-full w-[40px] flex items-center justify-center border-l-3 border-gray-100 hover:cursor-pointer"><HiOutlineTrash /> </div>
//     </div>
//   )
// }