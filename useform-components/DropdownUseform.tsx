'use client'

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Controller } from 'react-hook-form';

export default function DropdownUseform({ required = false, variant = "outlined", formData, disable = false, placeholder = "", options, pxWidth = "w-full", onChange, value, name = '', label = '' }: { required?: boolean; variant?: "filled" | "outlined" | "standard" | undefined; formData: any; disable?: boolean; placeholder?: string; label?: string; name?: string; options: any[], pxWidth?: string, onChange?: (e: SelectChangeEvent<any>) => void, value?: any }) {
    const {
        control,
        watch,
        formState: { errors }
    } = formData;

    return (
        <FormControl className={`${pxWidth} border`}
            sx={{ minWidth: 120, width: '100%', bgcolor: "", border: "none", height: "100%", }} size="small"
        >
            <CustomLabel text={label} required={required} />
            <Controller
                disabled={disable}
                name={name!}
                control={control}
                render={({ field: { name, onBlur, onChange, ref, value } }) => {
                    return (
                        <Select
                            sx={{
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: "transparent",
                                },
                                // minHeight: "46px !important",
                                minHeight: "26px !important",
                                borderRadius: 3
                            }}
                            variant={variant}
                            disabled={disable}
                            displayEmpty
                            fullWidth
                            name={name}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            ref={ref}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        // ปรับสไตล์ Paper Component ภายใน Menu
                                        borderRadius: '16px', // เพื่อให้เป็น rounded-2xl
                                    }
                                }
                            }}
                        >
                            {[{ label: "", value: "" }, ...options].map((e, i) =>
                                <MenuItem key={i} value={e.value}>
                                    <span
                                        className={!!e.value ? 'text-black  flex items-center h-full ' : "text-[#9E9E9E]  font-light h-full flex items-center"}>
                                        {!!e.value ? e.label : placeholder}
                                    </span>
                                </MenuItem>

                            )}
                        </Select>
                    )
                }
                }
            />

        </FormControl >
    );
}// CustomLabel.js
function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text?: string; isError?: boolean }) {
    return (
        text ? <div className='text-sm my-1' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-error'>*</span>} </div> : <span></span>
    );
}