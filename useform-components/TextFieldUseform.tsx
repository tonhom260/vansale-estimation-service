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

type TProps = {
    forceErr?: string;
    startIcon?: React.ReactNode; onKeyDown?: React.KeyboardEventHandler<HTMLDivElement> | undefined; minRows?: number; onBlur?: () => void; rules?: TRule; tabIndex?: number; hasIcon?: boolean; disabled?: boolean; placeholder?: string; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium"
}

export default function TextFieldUseform(
    { forceErr, onKeyDown, minRows, hasIcon = false, disabled = false, name, formData, label = "", size = "small", required = false, placeholder = "", rules, onBlur, startIcon }: TProps) {

    const {
        control,
        formState
    } = formData;

    const errors = formState?.errors
    const errState = !!errors && !!errors[name!]

    return (
        <Box component="div" sx={{ width: "100%" }} >
            {label.length > 0 && <CustomLabel text={label} required={required} isError={errState} />}
            <Controller
                rules={rules ?? undefined}
                disabled={disabled}
                name={name!}
                control={control}
                render={({ field, fieldState: { error, invalid, isDirty, isTouched, isValidating } }) => {
                    // console.log(field)
                    return (
                        <TextField
                            onKeyDown={onKeyDown}
                            size={size}
                            placeholder={placeholder}
                            sx={{
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                    borderRadius: 2,
                                },
                                "& .MuiFormHelperText-root": {
                                    marginLeft: 0,
                                },
                            }}
                            minRows={minRows}
                            multiline
                            fullWidth
                            slotProps={{
                                formHelperText: {},
                                input: {
                                    startAdornment: hasIcon ? (
                                        <InputAdornment position="start">
                                            {startIcon ? startIcon : <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />}
                                        </InputAdornment>
                                    ) : undefined,
                                    sx: {
                                        paddingY: 0,
                                        fontSize: 16,
                                        // minHeight: {
                                        //     xs: 40,   // mobile
                                        //     sm: 40,   // tablet
                                        //     md: 48,   // desktop
                                        // },
                                        padding: 1,
                                        paddingInline: 2
                                    }
                                }
                            }}

                            error={!!error || !!forceErr}
                            helperText={(error || forceErr) ? (error?.message ?? forceErr ?? "") : null}
                            {...field}
                            onBlur={onBlur}
                            autoComplete={'off'}
                            variant="outlined"
                        // onBlur={onBlur}
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

