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


export default function DialogCreate({ onClose, submitFn }: { onClose: any; submitFn: any }) {

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

    return (
        <>
            <Dialog
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 800,
                            padding: 4,
                            paddingTop: 2,
                            paddingInline: 14
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
                        สร้างประมาณการร้านค้า
                    </div>
                </DialogTitle>
                <DialogContent sx={{ gap: 1.5, display: "flex", flexDirection: "column" }}>
                    <AutoCompleteUseform required formData={useform} options={team} name='saleman' label='เลือกสายขาย' placeholder='เลือกสายที่เข้าบริการ' />
                    <AutoCompleteUseform required formData={useform} options={cust} name='custcode' label='เลือกร้านค้า' placeholder='เลือกสายร้านค้า' />
                    <div className=''>
                        <div className='text-[14px] mb-1'>เลือกวันที่ออกขาย</div>
                        <SingleDatePickerWithRangeChadcn formControl={useform} name='datepick' />
                    </div>
                </DialogContent>
                <DialogActions sx={{ paddingInline: 3, marginBottom: 0, marginTop: 4 }}>
                    <Button sx={{ borderColor: "gray", color: 'gray', borderRadius: 2 }} fullWidth variant='outlined' onClick={handleClose}>ย้อนกลับ</Button>
                    <Button sx={{ borderRadius: 2 }} fullWidth variant='contained' onClick={() => submitFn(getValues())} autoFocus>
                        สร้างประมาณการร้านค้า
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}