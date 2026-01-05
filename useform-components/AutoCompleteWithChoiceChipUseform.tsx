'use client'

import { Autocomplete, Box, Chip, InputAdornment, InputLabel, SvgIcon, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';


type Props = { disabled?: boolean; options: any[]; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }
export default function AutoCompleteWithChoiceChipUseform({ disabled = false, name, formData, label = "", size = "small", required = false, options }: Props) {
    const {
        control,
        watch,
        formState: { errors }
    } = formData;
    const errState = !!errors[name!]
    console.log(errState)

    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                name={name!}
                control={control}
                render={({ field: { name, onBlur, onChange, ref, value, }, fieldState: { error, invalid, isDirty, isTouched, isValidating }, formState }) => {
                    console.log(value)
                    console.log(name)
                    return (
                        <Autocomplete
                            disabled={disabled}
                            onChange={(e, v, reason) => {
                                onChange(v)
                            }}
                            onBlur={onBlur}
                            value={value}
                            multiple
                            options={options}
                            getOptionLabel={(option) => option.label}
                            filterOptions={(options, state) => {
                                const input = state?.inputValue ?? ""
                                console.log(input)
                                // console.log(options)
                                const currentValues = value.map((e: any) => e.value)
                                // console.log(currentValues)
                                const filterOptions = options.filter(e => !(currentValues as any[]).includes(e.value))
                                // console.log(filterOptions)
                                if (!!input) {
                                    const filterInputValueOptions = filterOptions.filter(e => (e.label as any[]).includes(input))
                                    // console.log(filterInputValueOptions)
                                    return filterInputValueOptions
                                }
                                return filterOptions
                            }}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                        },
                                    }}
                                    label=""
                                    placeholder="pick multiple color"
                                    helperText={error ? error.message : null}
                                    error={!!error}
                                />
                            )}
                        // renderValue={(values, getItemProps) =>
                        //     values.map((option, index) => {
                        //         const { key, ...itemProps } = getItemProps({ index });
                        //         return (
                        //             <Chip
                        //                 sx={!!error ? errorChip : basicChip}
                        //                 key={key}
                        //                 label={option.label}
                        //                 {...itemProps}
                        //                 deleteIcon={<CloseIcon style={{ color: !!error ? "red" : "#A3C7F7" }} />}
                        //             />
                        //         );
                        //     })
                        // }
                        />
                    )
                }
                }
            />
        </Box>
    )
}

const basicChip = {
    background: "none",
    border: "1px solid #A3C7F7",
    borderRadius: 2,
    color: "#A3C7F7"
}

const errorChip = {
    background: "none",
    border: "1px solid red",
    borderRadius: 2,
    color: "red"
}

function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text: string; isError?: boolean }) {
    return (
        <div className='text-sm' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-secondary'>*</span>} </div>
    );
}
