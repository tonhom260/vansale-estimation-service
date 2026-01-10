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
import { format } from 'date-fns';
import TextFieldUseform from '@/useform-components/TextFieldUseform';

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


export default function DialogSaveEstimation({ loading, note, onClose, submitFn, docId, session, sellingArea }: { loading: boolean, sellingArea: string; note?: string; onClose: any; submitFn: any; session: any, docId: string }) {
    console.log(session)
    console.log(sellingArea)
    // async function getList() {
    //     const list = await getTeamList({ option: true }) as any[]
    //     console.log(list)
    // }
    // const [cust, setCust] = useState<any[]>([])
    // async function getCustListFn() {
    //     const list = await getCustList({ option: true }) as any[]
    //     console.log(list)
    //     setCust(list)
    // }
    // useEffect(() => {
    //     getList()
    //     getCustListFn()
    // }, [])

    const useform = useForm({ defaultValues: { note: note || "" } })
    const { getValues, watch } = useform

    const handleClose = () => {
        onClose()
    };


    const [report, setReport] = useState<any>([])

    function getEstimationById(orderNumber: string) {
        console.log(orderNumber)
    }


    useEffect(() => {
        getEstimationById(docId)
    }, []);

    console.log(report)


    return (
        <>
            <Dialog
                disablePortal
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 800,
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
                <DialogTitle sx={{}}>
                    <div>
                        <div className='text-center text-3xl mb-3'>
                            บันทึกประมาณการ
                        </div>
                        <div className='flex justify-between mt-4'>
                            <div className='font-medium'>
                                {docId}
                            </div>
                            <div className='flex'>
                                <div>บันทึกโดย</div>
                                <div className='ml-4 font-normal'>{session.name}</div>
                            </div >
                        </div>
                        <div className='flex mt-2'>
                            <div className=''>ผู้ให้บริการ</div>
                            <div className='ml-4 font-normal'>{sellingArea}</div>
                        </div>
                    </div>

                </DialogTitle>
                <DialogContent sx={{ gap: 1.5, display: "flex", flexDirection: "column" }}>
                    <div className='w-full rounded-t-2xl '>
                        <div className='flex '>
                            <TextFieldUseform formData={useform} minRows={4} label='หมายเหตุ' name='note' />
                        </div>
                    </div>
                    {/* <AutoCompleteUseform required formData={useform} options={team} name='saleman' label='เลือกสายขาย' placeholder='เลือกสายที่เข้าบริการ' />
                    <AutoCompleteUseform required formData={useform} options={cust} name='custcode' label='เลือกร้านค้า' placeholder='เลือกสายร้านค้า' />
                    <div className=''>
                        <div className='text-[14px] mb-1'>เลือกวันที่ออกขาย</div>
                        <SingleDatePickerWithRangeChadcn formControl={useform} name='datepick' />
                    </div> */}
                </DialogContent>
                <DialogActions sx={{ paddingInline: 3, marginBottom: 0, marginTop: 0 }}>
                    <Button sx={{ borderColor: "gray", color: 'gray', borderRadius: 2 }} fullWidth variant='outlined' onClick={handleClose}>ย้อนกลับ</Button>
                    <Button loading={loading} sx={{ borderRadius: 2 }} fullWidth variant='contained' onClick={() => submitFn(watch("note"))} autoFocus>
                        บันทึกประมาณการ
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}