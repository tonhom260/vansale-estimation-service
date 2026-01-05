'use client'

import { Autocomplete, Box, InputAdornment, InputLabel, TextField } from '@mui/material'
import React from 'react'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { blue } from 'tailwindcss/colors';

type Props = { freeSolo?: boolean, placeholder?: string; disabled?: boolean; options: any[]; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }
export default function AutoCompleteUseformInputText({ freeSolo = false, placeholder = "", disabled = false, name, formData, label = "", size = "small", required = false, options }: Props) {
    const {
        control,
        watch,
        formState: { errors }
    } = formData;
    const errState = !!errors[name!]

    const selectedValues = React.useMemo(
        () => options?.find((opt) => opt?.value == watch(name)?.value),
        [watch, options],
    );
    const defaultValue = selectedValues?.label || ""
    console.log(defaultValue)
    const [inputValue, setInputValue] = React.useState(defaultValue ?? "");


    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                name={name!}
                control={control}
                render={({ field: { name, onBlur, onChange, ref, value, }, fieldState: { error, invalid, isDirty, isTouched, isValidating }, formState }) => {
                    console.log(value)
                    const matchValueOption = options?.find(e => e?.label == value) || value

                    return (
                        <Autocomplete
                            slotProps={{
                                popper: {
                                },
                                listbox: {
                                    sx: {
                                        padding: 0,
                                        // '[aria-selected="true"]': {
                                        //     color: "white",
                                        //     background: "black",
                                        //     fill: "white"
                                        // },
                                        // ".MuiAutocomplete-option.Mui-focusVisible": { // ตอนมี keyboard arrowdown
                                        //     background: "yellow"
                                        // },
                                        // ".MuiAutocomplete-option.Mui-focused": {
                                        //     background: "#E05639"
                                        // },
                                        // "& .MuiAutocomplete-option:hover": {
                                        //     backgroundColor: "#90caf9", // สีฟ้าอ่อน
                                        // },
                                        // "& .MuiAutocomplete-option[aria-selected='true']": {
                                        //     backgroundColor: "black", // ✅ สีดำเมื่อ selected
                                        //     color: "white",
                                        //     fontWeight: "bold",
                                        // },
                                        // "& .MuiAutocomplete-option.Mui-focused": {
                                        //     backgroundColor: "black !important", // ใช้ !important ฆ่า default MUI
                                        // },
                                        "& .MuiAutocomplete-option": {
                                            "&[aria-selected='true']": {
                                                backgroundColor: "#F5F9FF !important", // ✅ สีดำเมื่อ selected
                                                // color: "#E05639",
                                            }
                                        },
                                        "& .MuiAutocomplete-option[aria-selected='true']:hover": {
                                            backgroundColor: "#deeafc !important", // สีดำเข้มกว่าเล็กน้อยตอน hover อยู่บนตัวที่เลือกแล้ว
                                            // color: "white",
                                        },
                                        // "& .MuiAutocomplete-option:hover": {
                                        //     // backgroundColor: "red", // ✅ สีดำเมื่อ selected
                                        // },
                                        // "& .MuiAutocomplete-option[aria-selected='false']": {
                                        //     backgroundColor: "yellow", // ✅ สีดำเมื่อ selected
                                        //     color: "white",
                                        //     fontWeight: "bold",
                                        // },
                                    }
                                },
                            }}
                            // renderOption={(props, option, { selected }) => (
                            //     <li
                            //         {...props}
                            //         key={props.key}
                            //         className={`px-2 py-2 ${selected ? 'bg-blue-800 text-white' : 'bg-transparent'} hover:bg-red-300 `}
                            //     >
                            //         {option.label}
                            //     </li>
                            // )}
                            forcePopupIcon // บังคับให้มี arrow เสมอ ไม่ว่าจะเป็น free solo หรือ ไม่เป็น
                            popupIcon={options?.length == 0 ? <div /> : undefined}
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
                            onChange={(_, newValue, reason) => {
                                // console.log(reason)
                                // console.log(newValue)
                                const freeSoloText = newValue
                                const text = newValue?.label || freeSoloText
                                if (reason == "clear") {
                                    onChange(null)
                                }
                                // console.log(text)
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
                                    return <TextField
                                        {...params}
                                        // value={inputValue}
                                        ref={ref}
                                        placeholder={placeholder}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                height: 38,
                                                borderRadius: 2,
                                            },
                                        }}
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                // startAdornment: (
                                                //     <InputAdornment position="start">
                                                //         <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />
                                                //     </InputAdornment>
                                                // ),
                                            }
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


