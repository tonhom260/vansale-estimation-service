'use client'

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function DropdownInPayment({ disable = false, placeholder = "", options, pxWidth = "w-full", onChange, value, label = '', }: { disable?: boolean; placeholder?: string; label?: string; name?: string; options: any[], pxWidth?: string, onChange?: (e: SelectChangeEvent<any>) => void, value?: any }) {
    console.log(placeholder)
    console.log(value)
    console.log(options)
    console.log(value)

    return (
        <FormControl className={`${pxWidth}`}
            sx={{ minWidth: 120, width: '100%', bgcolor: "", border: "none", height: "100%" }} size="small">
            <CustomLabel text={label} required={false} />
            <Select
                autoFocus
                inputProps={{ style: { height: 200 } }}
                sx={{
                    "& .MuiSelect-select:focus": {
                        backgroundColor: "transparent",
                    },
                }}
                style={{ height: "100%", margin: 0 }}
                disableUnderline // เอาไว้ลบเส้นใต้
                variant='standard'
                disabled={disable}
                displayEmpty
                fullWidth
                value={value}
                onChange={onChange}
            >
                {options.filter(e => !!e).map((e, i) => {
                    // console.log(e)
                    return <MenuItem key={i} value={e?.value}
                        style={{ paddingInline: 0 }}>
                        <span className={!!e?.value ? 'text-black pl-5 flex pt-1  items-center h-full ' : "text-[#9E9E9E] small  pl-5"}>
                            {!!e?.value ? e.label : placeholder}
                        </span>
                    </MenuItem>
                })}
            </Select>
        </FormControl>
    );
}// CustomLabel.js
function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text?: string; isError?: boolean }) {
    return (
        text ? <div className='text-sm my-1' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-error'>*</span>} </div> : <span></span>
    );
}