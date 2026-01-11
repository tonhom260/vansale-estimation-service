'use client'
import { GrDocumentExcel } from "react-icons/gr";
import { IoCloudDownloadOutline, IoTrashOutline } from "react-icons/io5";
import { HiMiniMagnifyingGlass, HiOutlineTrash, HiXMark } from "react-icons/hi2";
import getProductList from "@/action/product/get";
import getUserList, { TUser } from "@/action/user/get";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { product_order } from "@/generated/prisma/client"
import TextField from '@mui/material/TextField';
import colors from 'tailwindcss/colors'
import { useLocalStorage } from 'usehooks-ts'
import { AiOutlineFilter } from "react-icons/ai";

const defaultValues = {
  queryId: "",
  queryName: "",
  queryUnitPrice: "",
  queryPackCount: "",
  queryValue: "",
  hasValue: false,
  filterProduct: [] as (product_order & { input?: string; loadedValue?: string; conversion_factor: number })[]
}

export type TUseform = UseFormReturn<typeof defaultValues>

export default function EstimationInput() {
  const searchParams = useSearchParams()
  const dateRangeQuery = searchParams.get('range')
  console.log(dateRangeQuery)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  console.log(dateRange)
  useEffect(() => {
    console.log(dateRangeQuery)
    const parse = JSON.parse(dateRangeQuery!)
    //  { from: '2026-01-07T17:00:00.000Z', to: '2026-01-08T17:00:00.000Z' }
    const dateRange = { from: new Date(parse.from), to: new Date(parse.to) }
    console.log(parse)
    setDateRange(dateRange)
  }, [dateRangeQuery])

  const getSession = async () => {
    try {
      // rewrite next-config
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      // console.log(data);
      // return !!data?.user
      return data?.user
    } catch (error) {
    }
  };

  const [session, setSession] = useState<any>();
  console.log(session)
  const router = useRouter()

  useEffect(() => {
    getSession().then(e => {
      if (e == undefined || e == null) {
        router.push("/")
      }
      setSession(e)
    })
  }, [])

  const param = useParams()
  const documentId = param.id as string

  const [report, setReport] = useState<TEstDetail | null>(null)
  console.log(report)

  function convert(measure: "single" | "group") {
    if (measure == "single") {
      return "ชิ้น"
    }
    return "หิ้ว"
  }


  async function getReport() {
    if (!documentId) return
    const result = await getEstimationDocumentDetailByDocname({ docname: documentId! })
    setReport(result as any)
  }

  const [pivotTable, setPivotTable] = useState<{
    header: TPivotHeader;
    body: number[][];
    finetuneData: number[]
  } | undefined>(undefined)

  const useform = useForm({ defaultValues })
  const { setValue, watch, control, register } = useform

  const useformArray = useFieldArray({ name: "filterProduct", control })
  const { append, fields, insert, move, prepend, remove, replace, swap, update } = useformArray

  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  // สร้าง flag ไว้ เพราะอยากให้ load item data ครั้งเดียว

  useEffect(() => {
    if (fields.length == 0 || isInitialLoaded) return
    getReport()
    setIsInitialLoaded(true)
  }, [documentId, fields])

  useEffect(() => {
    if (isInitialLoaded) {
      fetchData()
    }
  }, [isInitialLoaded, report]);

  async function fetchData() {
    console.log(dateRange)
    if (!report) {
      console.log("no report")
      return
    }
    console.log("running")
    const d = await getPivotDataBySaleWithDateRange({ dateRange: dateRange!, team: report?.areacode! })
    setPivotTable(d)
    // const list = d?.body
    // console.log(list)
    const fineTuneList = d?.finetuneData ?? []
    if (fineTuneList && fineTuneList.length > 0) {
      console.log(fineTuneList)
      // console.log(result.CustomerOrderEstimation)
      const productList = watch("filterProduct")
      for (let i in productList) {
        const isKitz = productList?.at(+i)?.productcategory?.includes("KITZ")
        const unitSpecify = isKitz ? convert(measure.KITZ as any) : convert(measure.OISHI as any)
        if (unitSpecify == "หิ้ว") {
          const convertUnit = Math.round(((fineTuneList.at(+i) || 0) / (productList.at(+i)?.conversion_factor || 1)) * 100) / 100
          setValue(`filterProduct.${+i}.input`, convertUnit?.toString() ?? "")
        } else {
          setValue(`filterProduct.${+i}.input`, (fineTuneList.at(+i) || 0)?.toString() ?? "")
        }
      }
    }
  }
  async function renewData() {
    console.log(dateRange)
    const d = await getPivotDataBySaleWithDateRange({ dateRange: dateRange!, team: report?.areacode! })
    setPivotTable(d)
    const list = d?.body
    console.log(list)
    const sumList = list?.map(e => e.at(e.length - 1)) ?? []
    console.log(sumList)
    if (sumList && sumList.length > 0) {
      // console.log(result.CustomerOrderEstimation)
      const productList = watch("filterProduct")
      for (let i in productList) {
        const isKitz = productList?.at(+i)?.productcategory?.includes("KITZ")
        const unitSpecify = isKitz ? convert(measure.KITZ as any) : convert(measure.OISHI as any)
        if (unitSpecify == "หิ้ว") {
          const convertUnit = Math.round(((sumList.at(+i) || 0) / (productList.at(+i)?.conversion_factor || 1)) * 100) / 100
          setValue(`filterProduct.${+i}.input`, convertUnit?.toString() ?? "")
        } else {
          setValue(`filterProduct.${+i}.input`, (sumList.at(+i) || 0)?.toString() ?? "")
        }
      }
    }
    alert("ปรับเป็นค่าเริ่มต้น ยอดจะตรงกับประมาณการจริง")
  }


  const valueList = watch("filterProduct").filter(e => !!e.input && e.input !== "0")

  const [selectIndex, setSelectIndex] = useState(0)
  const [measure, setMeasure] = useLocalStorage('measurement_unit', { "OISHI": "group", "KITZ": "single" })

  const curBahtSummation = watch("filterProduct").reduce((prev, e) => {
    const multipler = e.conversion_factor
    const isKitz = e.productcategory?.includes("KITZ")
    const unitSpecify = isKitz ? convert(measure.KITZ as any) : convert(measure.OISHI as any)
    if (unitSpecify == "หิ้ว") {
      const unit = !!e.input && !isNaN(+e.input) ? +e.input : 0
      const price = e.basicPrice || 0
      const netPrice = unit * price * multipler
      return netPrice + prev
      // const convertUnit = Math.round(((e.nextOrder || 0) / item.multiplier) * 100) / 100 
    } else {
      const unit = !!e.input && !isNaN(+e.input) ? +e.input : 0
      const price = e.basicPrice || 0
      const netPrice = unit * price
      return netPrice + prev
    }
  }, 0)

  const curUnitSummation = watch("filterProduct").reduce((prev, e) => {
    const unit = !!e.input && !isNaN(+e.input) ? +e.input : 0
    return unit + prev
  }, 0)

  const [tgBaht, setTgBaht] = useState("")
  const [tgUnit, setTgUnit] = useState("")

  const diffBaht = !!tgBaht ? +tgBaht - curBahtSummation : undefined
  const diffUnit = !!tgUnit ? +tgUnit - curUnitSummation : undefined

  const [mainPick, setMainPick] = useState<"OISHI" | "KITZ">("OISHI")

  useEffect(() => {
    setSelectIndex(0)
  }, [mainPick])

  const [radioPick, setRadioPick] = useState<"single" | "group">("single")
  // console.log(radioPick)

  useEffect(() => {
    setRadioPick(measure[mainPick] as any)
  }, [mainPick, measure])


  function changeRadioHandler(value: any) {
    clearInputs()
    setMeasure({ ...measure, [mainPick]: value })
  }

  const [catList, setCatList] = useState<string[]>([])
  const catlistNumber = catList.filter(e => e.includes(mainPick))?.length ?? 0

  async function getProduct() {
    const product = await getProductList()
    if (!!product) {
      setCatList(product.cat ?? [])
      setValue("filterProduct", product.items)
    }
  }

  useEffect(() => {
    getProduct()
    // getUsers()
  }, [])

  const itemRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleKeyDown = (e: React.KeyboardEvent, currentProduct: any, visibleItems: any[]) => {
    console.log(visibleItems)
    if (e.key === "Enter") {
      // console.log("enter")
      e.preventDefault();
      // หาตำแหน่งปัจจุบันในรายการที่ "กำลังแสดงผลอยู่"
      const currentIndex = visibleItems.findIndex(item => item.product_code1 === currentProduct.product_code1);
      // console.log(currentIndex)
      const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex >= 0 && nextIndex < visibleItems.length) {
        const nextProductCode = visibleItems[nextIndex].product_code1;
        const nextInput = itemRefs.current[nextProductCode];
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }
    }
  };

  const downloadCSV = () => {
    console.log(headerUnit)
    const inputData = watch('filterProduct')
    const rawDataArray = inputData.map(e => {
      const { product_code1, product_name, input } = e
      return [
        product_code1, product_name, input || "", headerUnit
      ]
    })

    if (rawDataArray.length === 0) return;

    // 1. ดึง Header จาก keys ของ object ตัวแรก
    const headers = ["รหัสสินค้า", "ชื่อสินค้า", documentId, "หน่วยนับ"];
    // 2. แปลงข้อมูลแต่ละแถวเป็น string
    const rows = rawDataArray.map(row =>
      Object.values(row)
        .map(value => `"${value}"`) // หุ้มด้วยฟันหนูเพื่อป้องกันปัญหาถ้าข้อมูลมีเครื่องหมาย ,
        .join(",")
    );

    // 3. รวม Header และ Rows เข้าด้วยกัน
    const csvContent = [headers, ...rows].join("\n");

    // 4. สร้าง Blob และสั่ง Download
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", documentId + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedList = useMemo(() => {
    return watch("filterProduct")?.filter((e, i) => {
      // console.log(e.input)
      // console.log(e)
      // console.log(mainPick)
      const itemCat = e.productcategory ?? ""
      const acceptMainCat = catList.filter(e => e.includes(mainPick))
      if (!acceptMainCat.includes(itemCat)) {
        // console.log(i)
        return false
      }

      const mainFilterCheck = itemCat == acceptMainCat!.at(selectIndex)!
      // console.log(mainFilterCheck)
      if (!mainFilterCheck) {
        // console.log(i)
        return false
      }
      if (!!watch("queryId")) {
        // console.log(i)
        const productCode = e.product_code1
        if (!productCode.includes(watch("queryId"))) {
          return false
        }
      }
      if (!!watch("queryName")) {
        // console.log(i)
        const productName = e.product_name ?? ""
        if (!productName.includes(watch("queryName"))) {
          return false
        }
      }
      if (!!watch("queryUnitPrice")) {
        // console.log(i)
        const productUnitPrice = e.basicPrice ?? ""
        if (!productUnitPrice?.toString()?.includes(watch("queryUnitPrice"))) {
          return false
        }
      }
      if (!!watch("queryValue")) {
        // console.log(watch("queryValue"))
        const inputValue = e.input ?? ""
        if (!!inputValue) { console.log(inputValue) }
        if (!inputValue?.includes(watch("queryValue"))) {
          return false
        }
      }
      return true
    })
  }, [
    mainPick,
    watch("filterProduct"),
    selectIndex,
    watch("queryId"),
    watch("queryName"),
    watch("queryPackCount"),
    watch("queryUnitPrice"),
    watch("queryValue"),
  ])

  useEffect(() => {
    const filterCatList = catList.filter(e => e.includes(mainPick))
    const len = filterCatList.length
    // console.log(catlistNumber)
    if (!len || len == 0) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      // const firstId = selectedList.at(0)?.product_code1
      // console.log(firstId)
      if (e.key === "ArrowRight") {
        setSelectIndex(prev => (prev >= (len - 1) ? prev : prev + 1));
      }
      if (e.key === "ArrowLeft") {
        setSelectIndex(prev => (prev <= 0 ? prev : prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    // ✅ Cleanup function: ลบ listener เมื่อ component unmount หรือ render ใหม่
    return () => window.removeEventListener("keydown", handleKeyDown);
    // }, [catList, selectedList]); // [] ตรวจสอบให้แน่ใจว่ารันแค่ครั้งเดียวตอน mount
  }, [catList, mainPick]); // [] ตรวจสอบให้แน่ใจว่ารันแค่ครั้งเดียวตอน mount


  function filterProductAndReturn(input: any) {
    const itemCat = input.productcategory ?? ""
    const acceptMainCat = catList.filter(e => e.includes(mainPick))
    if (!acceptMainCat.includes(itemCat)) {
      return null
    }
    const mainFilterCheck = itemCat == acceptMainCat!.at(selectIndex)!
    if (!mainFilterCheck) {
      return null
    }
    // console.log("object")
    if (!!watch("queryId")) {
      const productCode = input.product_code1
      if (!productCode.includes(watch("queryId"))) {
        return null
      }
    }
    if (!!watch("queryName")) {
      const productName = input.product_name ?? ""
      if (!productName.includes(watch("queryName"))) {
        return null
      }
    }
    if (!!watch("queryUnitPrice")) {

      const productUnitPrice = input.basicPrice ?? ""
      if (!productUnitPrice?.toString()?.includes(watch("queryUnitPrice"))) {
        return null
      }
    }
    if (!!watch("queryPackCount")) {
      const productGroupCount = input.conversion_factor ?? ""
      if (!productGroupCount?.toString()?.includes(watch("queryPackCount"))) {
        return null
      }
    }
    if (!!watch("queryValue")) {
      const inputValue = input.input ?? ""
      if (!inputValue?.includes(watch("queryValue"))) {
        return null
      }
    }
    if (watch("hasValue")) {
      const inputValue = input.input ?? ""
      if (inputValue == "") {
        return null
      }
    }
    // console.log("object")
    return input
  }

  useEffect(() => {
    // เมื่อเปลี่ยนหมวดหมู่ (selectIndex เปลี่ยน) หรือมีการ Filter
    // ให้โฟกัสไปที่ Input ตัวแรกในรายการที่มองเห็น (selectedList)
    if (selectedList && selectedList.length > 0) {
      const firstProductCode = selectedList[0].product_code1;
      const firstInput = itemRefs.current[firstProductCode];
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
    }
  }, [selectIndex]); // ทำงานทุกครั้งที่เปลี่ยนหมวดหมู่

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const headerUnit = isMounted ? (measure[mainPick] == "group" ? "หิ้ว" : "ชิ้น") : "ชิ้น";

  function clearInputs() {
    // ดึงข้อมูลปัจจุบันมา แล้ว map ให้ input เป็นค่าว่างทั้งหมด
    const currentValues = watch("filterProduct");
    const clearedValues = currentValues.map(item => ({
      ...item,
      input: "" // เคลียร์เป็นค่าว่าง
    }));

    // ใช้ setValue เพื่ออัปเดต state ของ react-hook-form
    setValue("filterProduct", clearedValues);
  }

  const [openSaveDialog, setOpenSaveDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  async function saveEstimation(note: string) {
    setSaving(true)
    let netAmt = 0
    let netUnit = 0
    const savedList = watch("filterProduct").filter(e => !!e.input)
    console.log(savedList)
    console.log(pivotTable?.body)
    const valuesList = pivotTable?.body ?? []
    const sumList = valuesList.map(e => e?.at(e.length - 1))
    try {
      // console.log(measure)
      const savedItem: TSavePayload[] = savedList.map((e, i) => {
        const unit = (+e!.input! || 0) - (sumList.at(i) || 0)
        const basicPrice = e.basicPrice || 0
        const cat = e.productcategory!
        const conversion_factor = e.conversion_factor
        const measurement = cat.includes("KITZ") ? measure.KITZ : measure.OISHI
        // console.log(measurement)
        const modifyUnit = measurement == "group" ? unit * conversion_factor : unit
        // console.log(modifyUnit)
        const amount = modifyUnit * basicPrice
        netAmt += amount
        netUnit += unit
        // console.log(amount)
        return {
          basicPrice: e!.basicPrice!,
          nextOrder: modifyUnit,
          productcategory: cat,
          productcode: e.product_code1!,
          productname: e.product_name!,
          testOrder: e.order_in_bill || 9999,
        }
      })
      console.log(savedItem.filter(e => e.nextOrder != 0))
      // console.log(note)
      // console.log(netAmt, netUnit)
      const result = await saveEstimationDocumentByDocId(documentId, savedItem.filter(e => e.nextOrder !== 0), {
        editBy: session.name,
        netamount: netAmt,
        netunits: netUnit,
        remark: note,
      })
      if (!!result) {
        // console.log("object")
        setOpenSaveDialog(false)
        await getReport()
      }
    } catch (e) {
      console.log(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className=" 2xl:flex min-h-screen items-start justify-center bg-zinc-50 text-black font-medium overflow-hidden pl-4">
      {openSaveDialog && <DialogSaveEstimation loading={saving} sellingArea={report?.SellingArea?.areaname ?? ""} session={session} docId={documentId} onClose={() => setOpenSaveDialog(false)} submitFn={saveEstimation} note={report?.remark || undefined} />}
      <div className="flex flex-col min-h-screen w-[calc(100vw-500px)] h-full   items-center   sm:items-start p-8 pt-4 ">
        <div className="w-full h-20 pl-3 ">
          <div className="flex justify-between items-start">
            <div className="flex items-start text-xl ">
              <Link href={"/"}><IoMdArrowRoundBack className="mr-2 text-3xl hover:cursor-pointer" /></Link>
              <div>
                <div className="text-4xl">{`ปรับปรุงยอดประมาณการเพื่อสั่งผลิต`}</div>
                <div className="font-medium  text-gray-400 text-2xl">{documentId ?? "-"}</div>
              </div>
            </div>
            <div className="border-2 rounded-xl border-gray-300 flex">
              <div className=" p-2 border-r border-gray-300 text-center">
                <div className="text-gray-600 text-xl text-center px-4">{"สายขาย"}</div>
                <div className="mt-2">{report?.slmname ?? "-"}</div>
              </div>
              <div className="min-w-50 p-2 text-center border-r-2 border-gray-300">
                <div className="text-gray-600 text-xl">วันที่ออกทริป</div>
                <div className="mt-2">  {!!dateRange ? format(dateRange.from, "dd-MM-yyyy") : ""}  -  {!!dateRange ? format(dateRange.to!, "dd-MM-yyyy") : ""}</div>
              </div>
              <div className="px-4 p-2 text-center">
                <div className="text-gray-600 text-xl">จำนวนเอกสาร</div>
                <div className="mt-2">{((pivotTable?.header?.length || 0) - 1)} ใบ</div>
              </div>
            </div>
            <div className="flex gap-2 min-w-40 justify-end mr-2">
              <div
                className="hover:cursor-pointer p-3 border-gray-600 border rounded-xl flex items-center"
                onClick={() => {
                  downloadCSV()
                }}
              >
                <GrDocumentExcel />
                <span className="ml-2">
                  Export CSV
                </span>
              </div>
            </div>
          </div >
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center mb-4 ">
            <div className="flex py-2">
              <div
                className={`hover:cursor-pointer ${mainPick == "OISHI" && "border-b-3 text-red-700 border-red-700"} pt-2 pb-3 text-xl px-4 font-extrabold `} onClick={() => { setMainPick("OISHI") }}>
                ทำประมาณการสินค้าเดอะโออิชิ
              </div>
              <div
                className={`${mainPick == "KITZ" && "border-b-3 text-orange-600 border-orange-600"}  hover:cursor-pointer pt-2 pb-3 text-xl px-4 font-extrabold `} onClick={() => { setMainPick("KITZ") }}>
                ทำประมาณการสินค้าเดอะคิทซ์
              </div>
            </div>
          </div>
          <div className="min-w-50">
            <div className="  rounded-xl p-2  flex items-center w-full">
              <div className="w-35">
                เลือกหน่วยนับสินค้า
              </div>
              <div className="ml-2">
                <RowRadioButtonsGroup value={radioPick} setValue={changeRadioHandler} />
              </div>

              <div className="ml-2 mb-2 select-none">
                <Tooltip title={"กรองเฉพาะที่ใส่ยอดประมาณการ"}>
                  <div onClick={() => {
                    setValue("hasValue", !watch("hasValue"))
                  }} className="p-2 bg-gray-100 rounded-full shadow-md shadow-gray-300 hover:cursor-pointer border ">
                    <AiOutlineFilter className={` text-2xl  ${watch("hasValue") ? "text-gray-600" : "text-gray-400"}`} />
                  </div>
                </Tooltip>
              </div>
              <div className="ml-2 mb-2 select-none">
                <Tooltip title={"ลบข้อมูลทั้งหมด"}>
                  <div onClick={renewData}
                    className="w-10.5 aspect-square flex items-center justify-center   text-xl font-extrabold bg-red-500 text-white rounded-full shadow-md border-red-500 shadow-gray-300 hover:cursor-pointer border-3 ">
                    C
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full  h-[calc(100vh-250px)] overflow-x-scroll " style={{ scrollbarWidth: "none" }}>
          <table className="border-separate border-spacing-0 text-black text-sm ">
            <Header2 headerUnit={headerUnit} mainPick={mainPick} register={register} setValue={setValue} data={pivotTable?.header} />
            <tbody className="w-full divide-y divide-gray-100 ">
              {
                watch("filterProduct")
                  .map((field, i) => {
                    const filterObject = filterProductAndReturn(field)
                    if (!filterObject) {
                      return null
                    }
                    const data = pivotTable?.body.at(i) ?? []
                    return (
                      <BodyRow2
                        measure={measure}
                        header={pivotTable?.header ?? []}
                        data={data}
                        setRef={(el: any) => (itemRefs.current[filterObject.product_code1] = el)}
                        register={register}
                        key={field.product_code1}
                        product={filterObject} onKeyDown={(e: any) => handleKeyDown(e, filterObject, selectedList)} index={i}
                      />
                    )
                  })
              }
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-2 bg-gray-200 pt-2">
          <div className="flex gap-2 ">
            {
              Array.from({ length: catlistNumber }, (_, i) => {
                return (
                  // ${mainPick == "OISHI" ? "bg-red-600" : "bg-orange-500"}
                  <div onClick={() => { setSelectIndex(i) }} key={i}
                    style={{
                      background: selectIndex == i ? (mainPick == "OISHI" ? colors.red[600] : colors.orange[500]) : "",
                      color: selectIndex == i ? "white" : "",
                      border: selectIndex == i ? "none" : undefined
                    }}
                    className={`border pb-1 pt-2  px-3 hover:cursor-pointer rounded-xl`}>
                    {catList.filter(e => e.includes(mainPick))?.at(i) ?? ""}
                  </div>
                )
              })
            }
          </div>
          <div className="text-center mt-2">กด shift + ปุ่ม Arrow ด้านซ้าย หรือ ขวา เพื่อเลื่อนตัวกรอง </div>
        </div>
      </div >
      <div className="min-w-125 w-125 max-w-[50%]  px-6 h-screen bg-gray-50 shadow-2xl">
        <div className=" px-10 flex justify-center pt-4">
          <div className="w-full ">
            <div className="grid grid-cols-4 gap-4 mx-auto  text-center text-gray-500 underline ">
              <div>หน่วยนับ</div>
              <div>ปัจจุบัน</div>
              <div className="text-green-700">เป้าหมาย</div>
              <div className=" ">ยอดต่าง</div>
            </div>
            <div className="grid grid-cols-4 gap-4 mx-auto  text-center">
              <div className="">บาท</div>
              <div>{Math.round(curBahtSummation * 100) / 100}</div>
              <div className="w-20 border max-w-full ">
                <input value={tgBaht} onChange={(e) => {
                  const val = e.target.value
                  setTgBaht(val)
                }} className="w-full text-center  placeholder:text-[12px] placeholder:text-gray-400 placeholder:font-normal" placeholder="ใส่ยอดบาท" />
              </div>
              <div className="text-black font-extrabold">{(!!diffBaht && diffBaht < 0) ? "เกิน " : ""} {(!!diffBaht && diffBaht > 0) ? "ขาด " : ""} {diffBaht ? Math.abs(Math.round(diffBaht)) : "-"}</div>
            </div>
            <div className="grid grid-cols-4 gap-4 mx-auto  text-center">
              <div className="">{headerUnit}</div>
              <div>
                {Math.round(curUnitSummation * 100) / 100}
              </div>
              <div className="w-20 border max-w-full ">
                <input value={tgUnit} onChange={(e) => {
                  const val = e.target.value
                  setTgUnit(val)
                }} className="w-full text-center  placeholder:text-[12px] placeholder:text-gray-400 placeholder:font-normal" placeholder="ใส่ยอดชิ้น" />
              </div>
              <div className="text-black font-extrabold">{(!!diffUnit && diffUnit < 0) ? "เกิน " : ""} {(!!diffUnit && diffUnit > 0) ? "ขาด " : ""} {diffUnit ? Math.abs(diffUnit) : "-"}</div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center px-10 py-4">
          <Button onClick={() => setOpenSaveDialog(true)} fullWidth variant="contained">บันทึกประมาณการ</Button>
        </div>
        <div className="w-full  h-[calc(100vh-200px)] rounded-xl p-4 pt-0 shadow-2xl">
          <div className="flex flex-col gap-2 h-full  overflow-y-auto pr-4">
            {
              valueList.map((e, i) => {
                const productCat = e.productcategory
                const isOishi = productCat?.includes("OISHI")
                // console.log(isOishi)
                const type = isOishi ? "OISHI" : "KITZ"
                const unit = measure[type] == "group" ? "หิ้ว" : "ชิ้น"
                // console.log(unit)
                const index = fields.findIndex(it => it.product_code1 == e.product_code1)
                // console.log(index)
                return <Card setValue={setValue} currentUnit={unit} key={i} product={e} order={i + 1} index={index} />
              })
            }
          </div>
        </div>
      </div>
    </div >
  );
}


import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Tooltip } from "@mui/material";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { getEstimationDocumentDetailByDocname, TEstDetail } from "@/action/estimation-document/detail";
import { format } from "date-fns";
import Link from "next/link";
import DialogSaveEstimation from "./component/DialogSaveEstimation";
import { saveEstimationDocumentByDocId, TSavePayload } from "@/action/estimation-document/edit";
import { getPivotDataBySaleWithDateRange, TPivotHeader } from "@/action/estimation-document/fine-tune-document/get";

export function RowRadioButtonsGroup({ value, setValue }: { value: any, setValue: any }) {
  return (
    <FormControl  >
      <RadioGroup
        value={value}
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={(e) => {
          console.log(e.target.value);
          setValue(e.target.value)
        }}
      >
        <FormControlLabel sx={{ fontFamily: 'var(--font-ibm-sans)' }} value="single" control={<Radio />} label={<Typography sx={{ fontFamily: 'var(--font-ibm-sans)', fontWeight: 500 }}>ชิ้น</Typography>} />
        <FormControlLabel value="group" control={<Radio />} label={<Typography sx={{ fontFamily: 'var(--font-ibm-sans)', fontWeight: 500 }}>หิ้ว</Typography>} />
      </RadioGroup>
    </FormControl>
  );
}


function Header2({ mainPick, register, setValue, headerUnit, data }: { data?: TPivotHeader, mainPick: any; register: any; setValue: any; headerUnit: any }) {
  const summary = data?.at(data.length - 1) as { grandReturnPercent: number, totalSell: number } | undefined
  return (
    <thead className={`z-30 rounded-xl w-full sticky top-0 ${mainPick == "OISHI" ? "bg-[#e7000b] text-white" : "bg-orange-500"}`} >
      <tr className='h-10  w-full text-[12px] 2xl:text-[16px] '>
        <th className='sticky left-0 text-start w-32.5 rounded-tl-xl font-normal'>
          <div className={`pl-2 w-32.5 px-2  pb-2 pt-4  ${mainPick == "OISHI" ? "bg-[#e7000b] text-white" : "bg-orange-500"} rounded-tl-xl`}>
            <div className="font-extrabold  ">รหัสสินค้า</div>
            <div className="mt-2 text-black bg-white rounded-xl inline-flex items-center h-10 ">
              <div className="mx-2"><HiMiniMagnifyingGlass className="text-xl" /></div>
              <TextField
                autoComplete="off"
                slotProps={{ input: { disableUnderline: true } }}
                size="small"
                variant="standard"
                sx={{ background: "white" }}
                {...register("queryId")}
              />
              <div className="mx-2"><HiXMark className="text-xl" onClick={() => setValue("queryId", "")} /></div>
            </div>
          </div>
        </th>
        <th className='z-10 sticky left-32.5  text-start font-normal '>
          <div className={`pb-2 pt-4 w-52 overflow-x-hidden px-2 ${mainPick == "OISHI" ? "bg-[#e7000b] text-white" : "bg-orange-500"} `}>
            <div className="font-extrabold ">ชื่อสินค้า</div>
            <div className="mt-2 text-black bg-white rounded-xl inline-flex items-center h-10 w-full ">
              <div className="mx-2"><HiMiniMagnifyingGlass className="text-xl" /></div>
              <TextField
                autoComplete="off"
                fullWidth
                slotProps={{ input: { disableUnderline: true } }}
                size="small"
                variant="standard"
                sx={{ background: "white" }}
                {...register("queryName")}
              />
              <div className="mx-2"><HiXMark className="text-xl" onClick={() => setValue("queryName", "")} /></div>
            </div>
          </div>
        </th>
        <th colSpan={4} className='z-0  text-start font-normal'>
          <div className={`py-2  pb-2 `}>
            <div className={" font-bold text-black rounded-md bg-white  h-20 w-full flex text-[12px] px-2"}>
              {
                data?.slice(0, data.length - 1)?.map((e, i) => {
                  const docname = e?.docname
                  const sell = e?.sumUnits || 0
                  return (
                    < div key={i} className="flex flex-col items-center justify-end py-1 text-[12px] text-gray-500 font-normal min-w-30 w-30 border-r ">
                      {/* <div className="text-black text-[14px]">{date}</div> */}
                      <div className="w-full text-center   pb-0.75 text-[12px]  font-bold text-blue-700 ">
                        <Tooltip title={docname}>
                          <div className="pl-2 whitespace-nowrap overflow-clip text-[10px] text-left">
                            {i + 1}. {docname}
                          </div>
                        </Tooltip>
                      </div>
                      <div className="text-center font-black text-green-800 min-w-10 h-20   w-30 leading-relaxed   px-0.5">
                        <Tooltip title={`${e.custcode}:${e.custname}`}>
                          <div className="line-clamp-2 overflow-hidden whitespace-normal wrap-break-word leading-tight">
                            {`${e.custcode}:${e.custname}`}
                          </div>
                        </Tooltip>
                      </div>
                      <div className="flex  w-full font-extrabold border-t  border-gray-400 justify-center">
                        {sell}
                      </div>
                    </div>
                  )
                })
              }
              <div className="text-green-800 flex flex-col items-center justify-end py-1 text-[12px] w-full underline font-bold">
                <div >รวมทั้งสิ้น</div>
                <div className="border-t border-gray-400 w-full text-center">{summary?.totalSell}</div>
              </div>
            </div>
          </div>
        </th>
        <th className='sticky right-0  text-start  font-normal w-40  z-0'>
          <div className={`pb-2 pt-4 w-36 px-2 ${mainPick == "OISHI" ? "bg-[#e7000b] text-white" : "bg-orange-500"} rounded-tr-xl `}>
            <div className="font-extrabold ">ยอดสั่ง/<span className="underline">{headerUnit}</span></div>
            <div className="text-black mt-2 bg-white rounded-xl inline-flex items-center h-10">
              <div className="mx-2"><HiMiniMagnifyingGlass className="text-xl" /></div>
              <TextField
                autoComplete="off"
                slotProps={{ input: { disableUnderline: true } }}
                size="small"
                variant="standard"
                sx={{ background: "white" }}
                {...register("queryValue")}
              />
              <div className="font-bold text-sm pt-1">{headerUnit}</div>
              <div className="mx-2"><HiXMark className="text-xl" onClick={() => setValue("queryValue", "")} /></div>
            </div>
          </div>
        </th>
      </tr>
    </thead >
  )
}

function convert(measure: "single" | "group") {
  if (measure == "single") {
    return "ชิ้น"
  }
  return "หิ้ว"
}

function BodyRow2({ measure, header, data, setRef, onKeyDown, product, index, register }: { measure: any; header: any[]; data: any[] | undefined; setRef: any; onKeyDown: any; product: product_order & { id: string, input: string, conversion_factor: number }; index: number; register: any }) {
  // console.log(data)
  // console.log(product)
  const { product_name, product_code1, input, conversion_factor, productcategory } = product
  const { ref: registerRef, ...rest } = register(`filterProduct.${index}.input`);
  // console.log(input)
  const isKitz = productcategory?.includes("KITZ")

  const unitSpecify = isKitz ? convert(measure.KITZ as any) : convert(measure.OISHI as any)
  // console.log(unitSpecify)
  const diff = unitSpecify == "หิ้ว" ? +(input || "0") - ((data?.at(data.length - 1) || 0) / conversion_factor) : +(input || "0") - (data?.at(data.length - 1) || 0)
  // console.log(diff)
  // console.log(data?.at(data.length - 1))
  // console.log(data?.at(data.length - 1) / conversion_factor)
  // console.log(conversion_factor)
  return (
    <tr className="transition-colors focus-within:bg-blue-50 text-[14px] bg-white ">
      <td className="sticky left-0 border-b border-gray-200 pl-3 text-gray-500 z-10 bg-white">{product_code1}</td>
      <td className="sticky left-32.5 border-b border-gray-200 pl-3 truncate bg-white">
        <div className="w-49 overflow-hidden">
          {product_name}
        </div>
      </td>
      <td colSpan={4} className=" h-full border-b border-gray-200 text-gray-500 ">
        <div className="flex text-[16px] gap-y-0  overflow-hidden pl-2">
          {
            data?.slice(0, data.length - 1).map((e, i) => {
              return (
                <div key={i} className="col-span-2 flex text-[14px] min-w-30 w-30 justify-center border-r">
                  {unitSpecify == "หิ้ว" ? Math.round(((e || 0) / conversion_factor) * 100) / 100 : e || ""}
                </div>
              )
            })
          }
          <div className="col-span-1 text-center text-green-800 border-r font-extrabold rounded-l-sm w-20">
            {unitSpecify == "หิ้ว"
              ? (data?.at(data.length - 1) / conversion_factor) || "-"
              : data?.at(data.length - 1)}
          </div>
        </div>
      </td>
      <td className="sticky right-0 border-b  border-gray-200 px-4 bg-white">
        <div className="flex items-center h-full py-1 ">
          <div className="w-16">
            <input
              autoComplete="off"
              className="bg-gray-50 w-full border-b border-gray-200 rounded-md 2xl:h-10  pl-4 text-[16px] font-extrabold text-blue-600  "
              onKeyDown={onKeyDown}
              ref={(el) => {
                registerRef(el)
                setRef(el)
              }}
              {...rest}
              value={input ?? ""}
            />
          </div>
          <div className={`text-right flex-1   font-extrabold ${diff < 0 ? "text-red-500" : "text-green-700"}`}>
            {diff < 0 ? "-" : "+"}  {Math.abs(Math.round(diff))}
          </div>
        </div>
      </td>
    </tr >
  )
}

function Card({ setValue, product, order, currentUnit, index }: { setValue: any; product: any, order: number, currentUnit: "ชิ้น" | "หิ้ว"; index: number }) {
  // console.log(product)
  const { basicPrice, product_name, product_code1, input, conversion_factor, productcategory } = product
  // console.log(conversion_factor)
  const minus2 = () => { setValue(`filterProduct.${index}.input`, (+input - 1).toString()) }
  const plus1 = () => { setValue(`filterProduct.${index}.input`, (+input + 1).toString()) }

  const netValue = currentUnit == "หิ้ว"
    ? !!product.input ? (+input * +basicPrice! * conversion_factor).toFixed(1) : ""
    : !!product.input ? (+input * +basicPrice!).toFixed(1) : ""

  return (
    <div className="flex h-35 w-full select-none  rounded-md bg-white shadow shadow-gray-200 font-light">
      <div className="flex-1">
        <div className="w-full h-full p-4 px-5 flex">
          <div className="h-full">
            <div className="aspect-square h-[80%] border border-gray-300 rounded-xl flex items-center justify-center">picture</div>
            <div className="flex  mt-2">
              <div className="h-7.5 flex">
                <div className="border border-gray-300 hover:cursor-pointer rounded-full aspect-square h-5 flex justify-center items-center"
                  onClick={minus2}>-</div>
                <div className="w-10 h-5">
                  <TextField
                    value={input}
                    onChange={(e) => {
                      const value = e.target.value
                      // update(targetIndex, { ...targetObject, input: value } as any)
                      setValue(`filterProduct.${index}.input`, value)
                    }}
                    size="small"
                    sx={{
                      // จัดตำแหน่งกล่อง Input ให้กึ่งกลาง (ถ้า TextField มีความกว้าง)
                      "& .MuiInput-root": {
                        justifyContent: "center",
                      },
                    }}
                    slotProps={{
                      input: {
                        onFocus: (event) => {
                          event.target.select();
                        },
                        disableUnderline: true,
                        sx: {
                          paddingTop: '5px',
                          fontSize: 13,
                          border: "1px solid #d1d5dc",
                          borderRadius: 1,
                          marginInline: "2px",
                          height: 22,
                          textAlign: "center", // จัดตัวหนังสือและ Cursor ให้อยู่ตรงกลาง
                          "& input": {
                            textAlign: "center", // เน้นย้ำที่ตัว input element ภายใน
                          },
                        },
                      },
                    }}
                    variant="standard" />
                </div>
                <div className="border border-gray-300 hover:cursor-pointer rounded-full aspect-square h-5 flex justify-center items-center" onClick={plus1}>+</div>
              </div>
              <div className="h-7.5 ml-1 mr-2 pt-1  text-[12px] text-black  font-extrabold">{currentUnit}</div>
            </div>
          </div>
          <div className="flex-1 pl-2">
            <div className="text-[16px] font-medium  mt-1">{order}.{product_name}</div>
            <div className="flex gap-4">
              <div className="text-[14px] ">
                <div className="mt-2 text-gray-500">
                  ราคาขาย
                </div>
                <div className="font-medium">{basicPrice} บาท/ชิ้น</div>
              </div>
              <div className="text-[14px] ">
                <div className="mt-2 text-gray-500">
                  รวมท้ังหมด
                </div>
                <div className="font-medium">
                  {netValue} บาท
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div onClick={() => {
        setValue(`filterProduct.${index}.input`, "")
      }} className="h-full w-10 min-w-10 flex items-center justify-center border-l-3 border-gray-100 hover:cursor-pointer"><HiOutlineTrash /> </div>
    </div>
  )
}