'use client'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AutoCompleteUseform from '@/useform-components/AutoCompleteUseform';
import { useForm } from 'react-hook-form';
import { DatePickerWithRange } from '@/useform-components/DatePickerWithRange';
import { SingleDatePickerWithRangeChadcn } from '@/useform-components/SingleDatePickerWithRangeChadcn';
import { getTeamList } from '@/action/team/get';
import { useEffect, useState } from 'react';
import { product_order, SellingArea } from '@/generated/prisma/client';
import getCustList from '@/action/customer/get';
import { blue } from '@mui/material/colors';
import { getEstimationDocumentByCustId, TEstDoc } from '@/action/estimation-document/get';
import { getPastSaleRecordByCustId, TSaleHistory } from '@/action/sale-history/get';
import { format } from 'date-fns';

const thaiBaht = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
});

type DisplayReport = {
    docname: string;
    netAmount: number;
    netUnitAmount: number;
    effectiveDate: Date;
    updateBy: string;
    listOfOrder?: { index: number; nextOrder: number }[]

}


export default function DialogPullDataOnCloud({ onClose, submitFn, custId, productOrderList }: { onClose: any; submitFn: any; custId: string, productOrderList?: (product_order & { conversion_factor: number })[] }) {
    console.log(productOrderList)
    async function getList() {
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
        getList()
        getCustListFn()
    }, [])

    const useform = useForm({ defaultValues: {} })
    const { getValues } = useform
    const handleClose = () => {
        onClose()
    };

    const [pick, setPick] = useState<"estimation" | "past-record">("estimation")

    const [report, setReport] = useState<DisplayReport[]>([])
    console.log(report)
    console.log(productOrderList)
    async function getEstimationList() {
        const report = await getEstimationDocumentByCustId({ custId }) as TEstDoc[]
        const modifyReport: DisplayReport[] = report.map(e => {
            const { effectiveDate, areacode, custcode, netamount, orderDocname, responsible, CustomerOrderEstimation } = e
            console.log(CustomerOrderEstimation)
            const sumUnitAmt = CustomerOrderEstimation.reduce((prev, e) => (e.nextOrder || 0) + prev, 0)
            console.log(sumUnitAmt)
            return {
                docname: orderDocname,
                effectiveDate: effectiveDate,
                netAmount: netamount ?? 0,
                netUnitAmount: sumUnitAmt,
                updateBy: responsible ?? "-",
                listOfOrder: CustomerOrderEstimation.map((e, i) => {
                    return {
                        index: productOrderList?.findIndex(prod => e.productcode == prod.product_code1),
                        nextOrder: e.nextOrder,
                        cat: e.productcategory,
                        conversion_unit: productOrderList?.find(prod => e.productcode == prod.product_code1)?.conversion_factor || 1
                    } as { index: number; nextOrder: number; cat: string }
                })
            }
        })
        console.log(report)
        setReport(modifyReport)
    }

    async function getPastSaleRecordList() {
        const report = await getPastSaleRecordByCustId({ custId }) as TSaleHistory[]
        const modifyReport: DisplayReport[] = report.map(e => {
            // console.log(e)

            const { returngoods, customer_transaction, order_no } = e
            const dataList = productOrderList?.map((e, i) => {
                const code = e.product_code1
                const saleAmt = customer_transaction?.find(e => e.product_code1 == code)?.sale_units || 0
                const retAmt = returngoods?.find(e => e.product_code1 == code)?.ret_unit || 0
                return {
                    index: i,
                    nextOrder: saleAmt + retAmt,
                    cat: e.productcategory,
                    conversion_unit: productOrderList?.find(prod => code == prod.product_code1)?.conversion_factor || 1
                } as { index: number; nextOrder: number }
            }).filter(e => e.nextOrder != 0)

            const sumSaleUnitAmt = customer_transaction.reduce((p, e) => {
                const unitAmt = e.sale_units || 0
                return unitAmt + p
            }, 0)
            const sumReturnUnitAmt = returngoods.reduce((p, e) => {
                const unitAmt = e.ret_unit || 0
                return unitAmt + p
            }, 0)
            const sumSaleBahtAmt = customer_transaction.reduce((p, e) => {
                const unitAmt = e.netamt || 0
                return unitAmt + p
            }, 0)
            const sumReturnBahtAmt = returngoods.reduce((p, e) => {
                const unitAmt = e.net_return_amt || 0
                return unitAmt + p
            }, 0)
            return {
                docname: e.order_no!,
                effectiveDate: e.created_at!,
                netAmount: sumSaleBahtAmt + sumReturnBahtAmt,
                netUnitAmount: sumSaleUnitAmt + sumReturnUnitAmt,
                updateBy: e.created_by_whom,
                listOfOrder: dataList
            }
        })
        console.log(modifyReport)
        setReport(modifyReport)
    }


    useEffect(() => {
        if (pick == "estimation") {
            getEstimationList()
        } else {
            getPastSaleRecordList()
        }
    }, [pick])

    return (
        <>
            <Dialog
                disablePortal
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 1000,
                            padding: 4,
                            paddingTop: 2,
                            paddingInline: 2
                        }
                    }
                }}
                open
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle >
                    <div className='text-center text-3xl mb-3'>
                        ดึงข้อมูลจากระบบ
                    </div>
                </DialogTitle>
                <DialogContent sx={{ gap: 1.5, display: "flex", flexDirection: "column" }}>

                    <div className='w-full h-120 rounded-t-2xl bg-gray-50 border-x border-b '>
                        <div className='flex'>
                            <div onClick={() => { setPick("estimation") }} style={{ background: pick == "estimation" ? blue[50] : undefined }} className='py-2 w-full hover:cursor-pointer  border-gray-200 border rounded-t-2xl text-center font-bold'>ดึงยอดประมาณการ</div>
                            <div onClick={() => { setPick("past-record") }} style={{ background: pick == "past-record" ? blue[50] : undefined }} className='py-2 w-full hover:cursor-pointer  border-gray-200 border rounded-t-2xl text-center font-bold'>ดึงยอดเก่าในระบบ</div>
                        </div>
                        <div className='grid grid-cols-7 w-full h-10 pt-2 border-b-2 border-gray-300 shadow'>
                            <div className='col-span-2 pl-2'>{'ชื่อเอกสาร'} </div>
                            <div className='col-span-1 '>วันที่ดำเนินการ </div>
                            <div className='col-span-1 '>รวมขายบาท </div>
                            <div className='col-span-1 '>รวมขายชิ้น </div>
                            <div className='col-span-1 '>แก้ไขโดย </div>
                            <div className='col-span-1 '>ดำเนินการ </div>
                        </div>
                        <div className='h-[calc(100%-100px)] overflow-auto'>
                            {
                                report.map(e => {

                                    const { docname, effectiveDate, netAmount, netUnitAmount, updateBy, listOfOrder } = e
                                    return (
                                        <div key={docname} className='grid grid-cols-7 w-full h-16 pt-2 items-center'>
                                            <div className='col-span-2 pl-2 font-medium '>{docname} </div>
                                            <div className='col-span-1 pl-2'>{format(effectiveDate, "dd-MM-yy")} </div>
                                            <div className='col-span-1 pl-2'>{thaiBaht.format(netAmount)} </div>
                                            <div className='col-span-1 pl-2'>{netUnitAmount} </div>
                                            <div className='col-span-1 pl-2'>{updateBy} </div>
                                            <Button onClick={() => { submitFn(docname, listOfOrder) }} variant='text'>เลือก</Button>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                    {/* <AutoCompleteUseform required formData={useform} options={team} name='saleman' label='เลือกสายขาย' placeholder='เลือกสายที่เข้าบริการ' />
                    <AutoCompleteUseform required formData={useform} options={cust} name='custcode' label='เลือกร้านค้า' placeholder='เลือกสายร้านค้า' />
                    <div className=''>
                        <div className='text-[14px] mb-1'>เลือกวันที่ออกขาย</div>
                        <SingleDatePickerWithRangeChadcn formControl={useform} name='datepick' />
                    </div> */}
                </DialogContent>
                <DialogActions sx={{ paddingInline: 3, marginBottom: 0, marginTop: 4 }}>
                    <Button sx={{ borderColor: "gray", color: 'gray', borderRadius: 2 }} fullWidth variant='outlined' onClick={handleClose}>ย้อนกลับ</Button>
                    {/* <Button sx={{ borderRadius: 2 }} fullWidth variant='contained' onClick={() => submitFn(getValues())} autoFocus>
                        ดึงข้อมูลจากระบบ
                    </Button> */}
                </DialogActions>
            </Dialog>
        </>
    );
}