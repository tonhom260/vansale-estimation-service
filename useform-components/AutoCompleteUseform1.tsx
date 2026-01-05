'use client'

import { Autocomplete, Box, CircularProgress, InputAdornment, InputLabel, TextField } from '@mui/material'
import React, { Fragment } from 'react'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { IoIosArrowDown } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';

type Props = { placeholder?: string; disabled?: boolean; options: any[]; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }
export default function AutoCompleteUseform1({ placeholder = "", disabled = false, name, formData, label = "", size = "small", required = false, options }: Props) {
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

    const defaultValue = selectedValues?.label
    // console.log(defaultValue)

    const [inputValue, setInputValue] = React.useState(defaultValue ?? "");


    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                name={name!}
                control={control}
                render={({ field: { name, onBlur, onChange, ref, value, }, fieldState: { error, invalid, isDirty, isTouched, isValidating }, formState }) => {

                    return (
                        <Autocomplete
                            popupIcon={<MdKeyboardArrowDown className='text-gray-400' />}

                            // list จะทะลุ dialog ได้ ถ้าไม่ใส่ มันจะกลับหัวย้อนขึ้น top แทนจะ bottom //
                            // If true, the Popper content will be under the DOM hierarchy of the parent component.  @default false
                            disablePortal={false}
                            noOptionsText="-- ไม่มีตัวเลือก --"
                            disabled={disabled}
                            // value={value || null}
                            value={value ? value : null}
                            inputValue={inputValue}
                            // isOptionEqualToValue={(option, value) => option.value === value.value}
                            isOptionEqualToValue={(option, value) =>
                                option?.value === value?.value
                            }
                            getOptionLabel={(option) => option.label}
                            onBlur={onBlur}
                            onChange={(_, newValue) => onChange(newValue)}
                            onInputChange={(event, newInputValue) => {
                                console.log(event?.type, "-> ", newInputValue)
                                !!event?.type && setInputValue(newInputValue);
                            }}

                            options={options}
                            // renderOption={(props, option, ownerState) => {
                            //     const { key, ...rest } = props
                            //     return <li
                            //         key={key}
                            //         style={{
                            //             display: 'flex', flexDirection: 'column', alignItems: "start",
                            //             borderBottom: "1px solid #E5E5E5", minHeight: '60px'
                            //         }}
                            //         {...rest}
                            //     >
                            //         <div className='truncate whitespace-nowrap'>{option.name}</div>
                            //         <div className='text-xs text-[#61646B] line-clamp-2 '>{option.label}</div>
                            //     </li>
                            // }}
                            renderInput={
                                (params) => {
                                    // console.log(params)
                                    return <TextField
                                        {...params}
                                        ref={ref}
                                        placeholder={placeholder}
                                        sx={{
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "14px"
                                            },
                                            // border: "none",
                                            height: 30,
                                            "& .MuiInputBase-root": {
                                                minHeight: 38,
                                                // border: "none"
                                                // maxHeight: 30,
                                                // height: 30,

                                            },
                                            minHeight: 30,
                                            maxHeight: 30,
                                            '& .MuiAutocomplete-inputRoot': {
                                                // border: "1px solid red",
                                                border: "none",
                                            },

                                            '& .MuiOutlinedInput-root': {

                                                // height: 38,
                                                height: 30,
                                                borderRadius: 3,
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E6E6E6 !important', // เปลี่ยนสีขอบเป็นสีแดงตลอดเวลา
                                                // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.015), 0 1px 3px rgba(0, 0, 0, 0.08)',
                                            },
                                        }}

                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <Fragment>
                                                        {params.InputProps.endAdornment}
                                                    </Fragment>
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
        <div className='text-[16px] mb-2 h-[20px]' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-error'>*</span>} </div>
    );
}