'use client'

import { Autocomplete, Box, InputAdornment, InputLabel, TextField } from '@mui/material'
import React from 'react'
import { Controller, } from 'react-hook-form';

type Props = { disabled?: boolean; options: any[]; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }
export default function AutoCompleteColorTagUseform({ disabled = false, name, formData, label = "", size = "small", required = false, options }: Props) {
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

                    return (
                        <Autocomplete
                            noOptionsText="-- ไม่มีตัวเลือก --"
                            autoHighlight // test
                            disabled={disabled}
                            value={value || null}
                            inputValue={inputValue}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            getOptionLabel={(option) => option.label}
                            onBlur={onBlur}
                            onChange={(_, newValue) => onChange(newValue)}
                            onInputChange={(event, newInputValue) => {
                                console.log(event?.type, "-> ", newInputValue)
                                !!event?.type && setInputValue(newInputValue);
                            }}
                            disablePortal
                            options={options}
                            // sx={{ width: 300 }}
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
                            renderInput={
                                (params) => {
                                    // console.log(params)
                                    return <TextField
                                        {...params}
                                        ref={ref}
                                        placeholder={"เลือกยี่ห้อรถ"}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                height: 38,
                                                borderRadius: 2,
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

function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text: string; isError?: boolean }) {
    return (
        <div className='text-sm' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-secondary'>*</span>} </div>
    );
}
