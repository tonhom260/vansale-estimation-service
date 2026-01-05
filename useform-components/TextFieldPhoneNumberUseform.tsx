'use client'

import { Box, InputLabel, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { Controller, } from 'react-hook-form';


export const formatThaiPhoneNumber = (phoneNumber: any) => {
    console.log("object", phoneNumber)
    // ... โค้ดจากขั้นตอนที่ 1 ...
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        console.log("str")
        return '';
    }
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.length === 10) {
        console.log("object")
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    if (cleaned.length === 9 && cleaned.startsWith('02')) {
        console.log("object")
        console.log(cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3'))
        return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    if (cleaned.length === 9) {
        console.log("object")
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    }
    console.log("object", cleaned)
    return cleaned;
};

export default function TextFieldPhoneNumberUseform({ disabled = false, name, formData, label = "", size = "small", required = false, placeholder = "" }: { tabIndex?: number; disabled?: boolean; placeholder?: string; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }) {
    const {
        control,
        watch,
        formState: { errors },
        setValue
    } = formData;
    const errState = !!errors[name!]
    const isStringValue = (watch(name) as string)?.toString()?.includes("-")
    console.log((watch(name) as string)?.toString()?.includes("-"))
    // console.log(errState)

    const [textType, setTextType] = useState(false)
    console.log(textType)
    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                disabled={disabled}
                name={name!}
                control={control}
                render={({ field, fieldState: { error, invalid, isDirty, isTouched, isValidating } }) => {
                    console.log(field.value)
                    // console.log(error)
                    const handleBlur = (e: any) => {

                        field.onBlur();
                        const formattedValue = formatThaiPhoneNumber(e.target.value);
                        console.log(formattedValue)
                        setValue(name, formattedValue, { shouldValidate: false });
                    };
                    console.log((textType || isStringValue) ? 'text' : 'number')

                    return (
                        <TextField
                            // type={(textType || isStringValue) ? 'text' : 'number'}
                            size={size}
                            placeholder={placeholder}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, }, }}
                            fullWidth
                            slotProps={{
                                input: {
                                    sx: {
                                        borderRadius: 20,
                                        paddingY: 0, fontSize: 16,
                                    }
                                }
                            }}
                            onClick={() => { setTextType(false) }}
                            error={!!error}
                            helperText={error ? error.message : null}
                            {...field}
                            // value={formatThaiPhoneNumber(field.value)}
                            value={field.value}
                            autoComplete={'off'}
                            variant="outlined"
                            onBlur={(e) => {
                                setTextType(true)
                                handleBlur(e)
                            }}
                        />
                    )
                }

                }
            />
        </Box>
    )
}


// CustomLabel.js
function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text: string; isError?: boolean }) {
    return (
        <div className='text-sm mb-1' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-secondary'>*</span>} </div>
    );
}
