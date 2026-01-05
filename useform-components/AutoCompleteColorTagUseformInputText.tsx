'use client'

import { Autocomplete, Box, InputAdornment, InputLabel, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type Props = { placeholder?: string; freeSolo?: boolean; disabled?: boolean; options: any[]; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }
export default function AutoCompleteColorTagUseformInputText({ freeSolo, placeholder, disabled = false, name, formData, label = "", size = "small", required = false, options }: Props) {
    const {
        control,
        watch,
        formState: { errors }
    } = formData;
    const errState = !!errors[name!]
    console.log(errState)

    const selectedValues = React.useMemo(
        () => options?.find((opt) => opt.value == watch(name)?.value),
        [watch, options],
    );
    const defaultValue = selectedValues?.label
    console.log(defaultValue)
    const [inputValue, setInputValue] = React.useState(defaultValue ?? "");
    console.log(options)
    const baseBath = process.env.NEXT_PUBLIC_HOSTIP
    console.log(baseBath)
    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                name={name!}
                control={control}
                render={({ field: { name, onBlur, onChange, ref, value, }, fieldState: { error, invalid, isDirty, isTouched, isValidating }, formState }) => {
                    const matchValueOption = options?.find(e => e?.label == value) || value

                    return (
                        <Autocomplete
                            renderOption={(props, option) => {
                                console.log(option)
                                const { key, ...optionProps } = props;
                                return (
                                    <Box
                                        key={key}
                                        component="li"
                                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                        {...optionProps}
                                    >
                                        <div className='rounded-full aspect-square h-[15px] border border-gray-light mr-2' style={{ background: option.value }}></div>
                                        {option.label}
                                    </Box>
                                );
                            }}
                            forcePopupIcon // บังคับให้มี arrow เสมอ ไม่ว่าจะเป็น free solo หรือ ไม่เป็น
                            noOptionsText="-- ไม่มีตัวเลือก --"
                            disabled={disabled}
                            // value={value || null}
                            value={matchValueOption || null}
                            inputValue={inputValue}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            getOptionLabel={(option) => {
                                return option.label ?? option
                            }}
                            freeSolo={freeSolo}
                            onBlur={() => {
                                freeSolo && onChange(inputValue)
                                onBlur()
                            }}
                            onKeyDown={(e) => {
                                const enterKeyDownKey = e.code == "Enter"
                                if (enterKeyDownKey && matchValueOption == undefined) {
                                    const optionalMatchValueToOption = { label: value, value: value }
                                    console.log("pass")
                                    console.log(optionalMatchValueToOption)

                                }
                            }}
                            onChange={(_, newValue) => {
                                console.log(newValue)
                                const freeSoloText = newValue
                                const text = newValue?.label || freeSoloText

                                console.log(text)
                                if (text) {
                                    console.log(text)
                                    onChange(text)
                                }
                            }}
                            onInputChange={(event, newInputValue) => {
                                // console.log(event?.type, "-> ", newInputValue)
                                !!event?.type && setInputValue(newInputValue);
                            }}
                            disablePortal
                            options={options}

                            renderInput={
                                (params) => {
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
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />
                                                </InputAdornment>
                                            ),
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

function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text: string; isError?: boolean }) {
    return (
        <div className='text-sm' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-secondary'>*</span>} </div>
    );
}
