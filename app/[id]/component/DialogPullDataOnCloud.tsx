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
import { SellingArea } from '@/generated/prisma/client';
import getCustList from '@/action/customer/get';
import { blue } from '@mui/material/colors';


export default function DialogPullDataOnCloud({ onClose, submitFn }: { onClose: any; submitFn: any }) {

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

    const [pick, setPick] = useState<"estimation" | "part-record">("estimation")

    return (
        <>
            <Dialog
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

                    <div className='w-full h-120 rounded-t-2xl bg-gray-50 border-x border-b'>
                        <div className='flex'>
                            <div onClick={() => { setPick("estimation") }} style={{ background: pick == "estimation" ? blue[50] : undefined }} className='py-2 w-full hover:cursor-pointer  border-gray-200 border rounded-t-2xl text-center font-bold'>ดึงยอดประมาณการ</div>
                            <div onClick={() => { setPick("part-record") }} style={{ background: pick == "part-record" ? blue[50] : undefined }} className='py-2 w-full hover:cursor-pointer  border-gray-200 border rounded-t-2xl text-center font-bold'>ดึงยอดเก่าในระบบ</div>
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