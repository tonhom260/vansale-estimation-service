'use client'

import { Autocomplete, Box, InputAdornment, InputLabel, TextField } from '@mui/material'
import React from 'react'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type Props = { placeholder?: string; disabled?: boolean; options: any[]; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }
export default function AutoCompleteUseform({ placeholder = "", disabled = false, name, formData, label = "", size = "small", required = false, options }: Props) {
    const {
        control,
        watch,
        formState: { errors }
    } = formData;
    const errState = !!errors[name!]

    const watchedValue = watch(name); // ดึงค่าครั้งเดียวแบบ stable
    const selectedValues = React.useMemo(
        () => options?.find((opt) => opt.value == watchedValue?.value),
        [watchedValue, options],
    );

    // const defaultValue = selectedValues?.label
    // console.log(defaultValue)

    // const [inputValue, setInputValue] = React.useState(defaultValue ?? "");

    // console.log("call", name)

    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                name={name!}
                control={control}
                render={({ field: { name, onBlur, onChange, ref, value, }, fieldState: { error, invalid, isDirty, isTouched, isValidating }, formState }) => {
                    console.log(value)
                    return (
                        <Autocomplete
                            // list จะทะลุ dialog ได้ ถ้าไม่ใส่ มันจะกลับหัวย้อนขึ้น top แทนจะ bottom //
                            // If true, the Popper content will be under the DOM hierarchy of the parent component.  @default false
                            disablePortal={false}
                            noOptionsText="-- ไม่มีตัวเลือก --"
                            disabled={disabled}
                            // value={value || null}
                            value={value ? value : null}
                            // value={value}
                            // inputValue={inputValue}
                            // isOptionEqualToValue={(option, value) => option.value === value.value}
                            isOptionEqualToValue={(option, value) => {
                                console.log(option, value)
                                console.log(option?.value === value?.value)
                                return option?.value === value?.value
                            }
                            }
                            getOptionLabel={(option) => option?.label ?? ""}
                            onBlur={onBlur}
                            onChange={(_, newValue) => onChange(newValue)}
                            // onInputChange={(event, newInputValue) => {
                            //     console.log(event?.type, "-> ", newInputValue)
                            //     !!event?.type && setInputValue(newInputValue);
                            // }}
                            options={options}
                            renderInput={
                                (params) => {
                                    console.log(params)
                                    console.log(value)
                                    // console.log(params)
                                    return <TextField
                                        {...params}
                                        ref={ref}
                                        placeholder={placeholder}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: 38,
                                                borderRadius: 2,
                                            },
                                        }}
                                        slotProps={{
                                            ...params.inputProps,
                                            select: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        helperText={error ? error.message : null}
                                        error={!!error}
                                    />
                                }
                            }
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
        <div className='text-sm mb-1 h-[20px]' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-error'>*</span>} </div>
    );
}