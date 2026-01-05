import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { gray } from 'tailwindcss/colors';

export default function BasicDropdown({ disable = false, placeholder = "", options, pxWidth = "w-full", onChange, value, name = '', label = '' }: { disable?: boolean; placeholder?: string; label?: string; name?: string; options: any[], pxWidth?: string, onChange?: (e: SelectChangeEvent<any>) => void, value?: any }) {
    console.log(placeholder)
    console.log(value)
    // const [option, setOption] = React.useState('');
    // const handleChange = (event: SelectChangeEvent) => {
    //     setOption(event.target.value);
    // };
    console.log(value)
    console.log(options)

    // ในกรณีที่มันมี value เข้ามา และ ไม่มี options
    const hasValueWithoutOptions = !!value && options.length === 0

    console.log(hasValueWithoutOptions)


    return (
        <FormControl className={`${pxWidth}`}
            sx={{ minWidth: 120, width: '100%', bgcolor: "white", borderRadius: 2 }} size="small">
            <CustomLabel text={label} required={false} />
            <Select
                disabled={disable}
                displayEmpty
                fullWidth
                name={name}
                // value={onChange ? value : option}
                // value={value}
                value={value}
                // onChange={onChange ?? handleChange}
                onChange={onChange}
            >

                {["", ...options].map((e, i) =>
                    <MenuItem
                        key={i} value={e}><span className={!!e ? 'text-black' : "text-[#9E9E9E] small"}>{!!e ? e : placeholder}</span></MenuItem>
                )}
            </Select>
        </FormControl>
    );
}// CustomLabel.js
function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text: string; isError?: boolean }) {
    return (
        <div className='text-sm my-1' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-error'>*</span>} </div>
    );
}