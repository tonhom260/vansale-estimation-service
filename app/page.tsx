'use client'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import { TbPresentationAnalytics } from "react-icons/tb";
import DialogCreate from './component/DialogCreate';
import DialogAdjustTripAmt from './component/DialogAdjustTripAmt';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { getEstimationDocument, getEstimationDocumentByCustId, getEstimationDocumentByDateAndSale } from '@/action/estimation-document/get';
import EstDataTable from './component/EstTable';
import { SingleDatePickerWithRangeChadcn } from '@/useform-components/SingleDatePickerWithRangeChadcn';
import { useForm } from 'react-hook-form';
import AutoCompleteUseform from '@/useform-components/AutoCompleteUseform';
import { format } from 'date-fns';
import { createEstimationDocument } from '@/action/estimation-document/create';
import { TUser } from '@/action/user/get';
import { getTeamList } from '@/action/team/get';
import getCustList from '@/action/customer/get';
import { useRouter } from 'next/navigation';
import { createFinetuneDocument } from '@/action/estimation-document/fine-tune-document/create';

export default function Main() {
    async function getTeamListFn() {
        const list = await getTeamList({ option: true }) as any[]
        console.log(list)
        setTeam(list)
    }
    const [cust, setCust] = useState<any[]>([])
    async function getCustListFn() {
        const list = await getCustList({ option: true }) as any[]
        console.log(list)
        setCust(list)
    }
    const [team, setTeam] = useState<any[]>([])
    useEffect(() => {
        getTeamListFn()
        getCustListFn()
    }, [])

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
            console.log(data);
            setUser(data.user)
        } catch (error) {
        }
    };

    useEffect(() => {
        getSession()
    }, [])

    const [user, setUser] = useState<TUser>()
    // console.log(user)
    const [openCreate, setOpenCreate] = useState(false)
    const [openAdj, setOpenAdj] = useState(false)

    const useform = useForm({
        defaultValues: {
            datepick: undefined as Date | undefined,
            saleman: undefined as any,
            cust: undefined as any
        }
    })
    const { watch } = useform
    console.log(watch())

    // async function getList() {
    //     const list = await getEstimationDocument()
    //     console.log(list)
    //     setReport(list as any[])
    // }
    // useEffect(() => {
    //     getList()
    // }, [])
    async function getListBySaleAndDate() {
        const list = await getEstimationDocumentByDateAndSale({ startTripDate: watch("datepick")!, team: watch("saleman").value })
        console.log(list)
        setReport(list as any[])
    }
    async function getListByCust() {
        if (!watch("cust")) return
        const list = await getEstimationDocumentByCustId({ custId: watch("cust").value })
        console.log(list)
        setReport(list as any[])
    }




    const [report, setReport] = useState<any[]>([])
    console.log(report)

    const router = useRouter()

    async function createEst(data: any) {
        // console.log(user)
        // console.log(data)


        const { saleman, custcode, datepick } = data
        if (!saleman || !custcode || !datepick) alert("โปรดระบุข้อมูลให้ครบถ้วน")

        const saleVal = saleman.value as string
        const custVal = custcode.value as string
        const sellingDate = datepick as Date
        console.log(saleVal, custVal, sellingDate)
        const estDocname = `EST-${saleVal}-${format(sellingDate, "yyyyMMdd")}-${custVal}`
        console.log(estDocname)
        try {
            const res = await createEstimationDocument({ custcode: custVal, docname: estDocname, effectiveDate: sellingDate, slmname: saleVal, responsible: user!.name! })
            // console.log(res)
            if (res) {
                setOpenCreate(false)
                router.push(`/${res.orderDocname}`)
            }
        } catch (e: any) {
            console.log(e)
            alert(e.message)
        }
    }

    if (!user) {
        return <div className='text-center mt-10 font-extrabold'>
            -- Login ก่อนใช้ระบบ --
        </div>
    }

    async function createFineTuneDoc(data: any) {
        console.log(data)
        const sale = data?.saleman?.value as string
        const dateRange = data?.daterange as { from: Date, to: Date }
        if (sale == undefined || dateRange == undefined) {
            alert("กรุณากรอกข้อมูลให้ครบ")
            return
        }

        try {
            const result = await createFinetuneDocument({ ...data, editBy: user?.name ?? "" })
            if (!!result) {
                router.push(`/fine-tune-trip/${result.orderDocname}?range=${JSON.stringify(dateRange)}`)
            }
        } catch (e) { console.log(e) }



    }

    return (
        <div className='p-10 px-12 w-full h-full bg-white'>
            {openCreate && <DialogCreate onClose={() => setOpenCreate(false)} submitFn={createEst} />}
            {openAdj && <DialogAdjustTripAmt onClose={() => setOpenAdj(false)} submitFn={createFineTuneDoc} />}
            <div>
                <div className='flex  items-center justify-between'>
                    <div className='text-4xl font-semibold mb-4'>ประมาณการสายขาย | Estimation</div>
                    <div className='flex items-center'>
                        <Button
                            sx={{ width: 280 }} onClick={() => setOpenAdj(true)} size='large' variant='outlined'>
                            <TbPresentationAnalytics className='mr-2' />
                            สรุปยอดและปรับประมาณการ
                        </Button>
                        <div className='w-2' />
                        <Button sx={{ width: 280 }} size='large' variant='contained' onClick={() => setOpenCreate(true)}>
                            <MdOutlineCreateNewFolder className='mr-2' />
                            สร้างใบประมาณการ
                        </Button>
                    </div>
                </div>
                <div className='min-h-12.5 w-full 2xl:flex justify-between items-center'>
                    <div className='flex gap-4  justify-center w-full mt-8'>
                        <div>
                            <div className='text-sm mb-1'>เลือกวันที่ออกทริป *</div>
                            <SingleDatePickerWithRangeChadcn
                                formControl={useform}
                                name='datepick'
                            />
                        </div>
                        <div className='w-50 min-w-50'><AutoCompleteUseform formData={useform} name='saleman' options={team} required label='เลือกสายขาย' placeholder='โปรดระบุสายขาย' /></div>
                        <div className='line-clamp-1 flex items-end min-w-18'>
                            <Button onClick={getListBySaleAndDate} variant='text'>ดึงข้อมูล</Button>
                        </div>
                        <div className='w-20'></div>
                        <div className='min-w-100 '><AutoCompleteUseform formData={useform} name='cust' options={cust} required label='เลือกร้านค้า' placeholder='โปรดระบุร้านค้า' /></div>
                        <div className='flex items-end min-w-18'>
                            <Button onClick={getListByCust} variant='text'>ดึงข้อมูล</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-[calc(100%-130px)] bg-gray-100 mt-6 rounded-xl p-10 overflow-y-auto'>
                <div className='bg-white rounded-xl pt-3 pb-4  px-4 '>
                    <EstDataTable data={report} />
                </div>
            </div>
        </div >
    )
}
