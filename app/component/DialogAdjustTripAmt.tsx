'use client'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AutoCompleteUseform from '@/useform-components/AutoCompleteUseform';
import { DatePickerWithRange } from '@/useform-components/DatePickerWithRange';
import { useForm } from 'react-hook-form';
import TextFieldUseform from '@/useform-components/TextFieldUseform';
import { getTeamList } from '@/action/team/get';
import { useEffect, useState } from 'react';
import getCustList from '@/action/customer/get';
import { SingleDatePickerWithRangeChadcn } from '@/useform-components/SingleDatePickerWithRangeChadcn';

export default function DialogAdjustTripAmt({ onClose, submitFn }: { onClose: any; submitFn: any }) {


    async function getList() {
        const list = await getTeamList({ option: true }) as any[]
        console.log(list)
        setTeam(list)
    }

    const [team, setTeam] = useState<any[]>([])
    useEffect(() => {
        getList()
        // getCustListFn()
    }, [])

    const useform = useForm({ defaultValues: {} })
    const { getValues, } = useform

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
                    <div className='text-center text-3xl mb-4'>
                        สรุปและปรับประมาณการ
                    </div>
                </DialogTitle>
                <DialogContent sx={{ gap: 1.5, display: "flex", flexDirection: "column" }}>
                    <AutoCompleteUseform required formData={useform} options={team} name='saleman' label='สายขาย' placeholder='เลือกสายขายที่ต้องการ' />
                    <div className=''>
                        <div className='text-[14px]'>เลือกวันที่สายขายออกทริป</div>
                        {/* <DatePickerWithRange formControl={useform} name='daterange' /> */}
                        <DatePickerWithRange formControl={useform} name='daterange' />
                    </div>
                    {/* <div>หรือ</div>
                    <div><TextFieldUseform size='medium' formData={useform} label='เลือกจากเลขเอกสารประมาณการ' name='docname' placeholder='ระบุเลขที่เอกสาร' /></div> */}
                </DialogContent>
                <DialogActions sx={{ paddingInline: 3, marginBottom: 0, marginTop: 4 }}>
                    <Button sx={{ borderColor: "gray", color: 'gray', borderRadius: 2 }} fullWidth variant='outlined' onClick={handleClose}>ย้อนกลับ</Button>
                    <Button sx={{ borderRadius: 2 }} fullWidth variant='contained'
                        onClick={() => {
                            submitFn(getValues())
                        }} autoFocus>
                        ปรับปรุงยอดประมาณการ
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}