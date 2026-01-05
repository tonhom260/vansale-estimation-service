'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Box, InputAdornment, InputLabel, TextField } from '@mui/material'
import React from 'react'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';

type TRule =
    | Omit<
        RegisterOptions<FieldValues, string>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >
    | undefined;
export default function TextFieldUseformMultiRow(
    { hasIcon = false, disabled = false, name, formData, label = "", size = "small", required = false, placeholder = "", rules, onBlur }
        : { onBlur?: () => void; rules?: TRule; tabIndex?: number; hasIcon?: boolean; disabled?: boolean; placeholder?: string; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }) {

    const {
        control,
        formState
    } = formData;

    const errors = formState?.errors
    const errState = !!errors && !!errors[name!]

    return (
        <Box component="div" sx={{ width: "100%", }} >
            {label.length > 0 && <CustomLabel text={label} required={required} isError={errState} />}
            <Controller
                rules={rules ?? undefined}
                disabled={disabled}
                name={name!}
                control={control}
                render={({ field, fieldState: { error } }) => {
                    // console.log(field)
                    return (
                        <TextField
                            multiline
                            rows={3}
                            placeholder={placeholder}


                            fullWidth
                            inputProps={{ className: "focus:ring-0" }}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: hasIcon ? (
                                    <InputAdornment position="start">
                                        <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />
                                    </InputAdornment>
                                ) : undefined,
                                sx: {
                                    paddingY: 0,
                                    fontSize: 16,
                                }
                            }}
                            error={!!error}
                            helperText={error ? error.message : null}
                            {...field}
                            onBlur={onBlur}
                            autoComplete={'off'}
                            variant="standard"
                        // variant="filled"
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
        <div className='text-sm mb-1 h-[20px]' style={{ color: isError ? "red" : undefined }}>
            {text}
            {required && <span className='text-error ml-1'>*</span>}
        </div>
    );
}
