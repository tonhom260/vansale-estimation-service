'use client'

import { Autocomplete, Box, CircularProgress, InputAdornment, InputLabel, TextField } from '@mui/material'
import React, { Fragment, useState } from 'react'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { IoIosArrowDown } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { stat } from 'fs';
import CustomDeleteIconChips from './ChoiceChip';

type Props = { placeholder?: string; disabled?: boolean; options: any[]; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }
export default function AutoCompleteMultipleUseform({ placeholder = "", disabled = false, name, formData, label = "", size = "small", required = false, options }: Props) {
    const {
        control,
        watch,
        setValue,
        formState: { errors }
    } = formData;
    const errState = !!errors[name!]

    const watchedValue = watch(name); // ดึงค่าครั้งเดียวแบบ stable
    const selectedValues = React.useMemo(
        () => options?.find((opt) => opt.value == watchedValue?.value),
        [watchedValue, options],
    );
    console.log(watchedValue)

    const defaultValue = selectedValues?.label
    // console.log(defaultValue)

    const [inputValue, setInputValue] = React.useState(defaultValue ?? "");
    const [open, setOpen] = useState(false)
    console.log(open)
    const regularOptions = React.useMemo(() => options.filter((opt: any) => opt.value !== "all"), [options]);

    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                name={name!}
                control={control}
                render={({ field: { name, onBlur, onChange, ref, value, }, fieldState: { error, invalid, isDirty, isTouched, isValidating }, formState }) => {
                    const selectedValue = (value || []) as any[];
                    const isAllCheckedByCount = selectedValue.length === regularOptions.length && regularOptions.length > 0;
                    console.log(value)
                    return (
                        <Autocomplete
                            onOpen={() => setOpen(true)}
                            multiple
                            popupIcon={<MdKeyboardArrowDown className='text-gray-400' />}
                            onClose={(_, reason) => {
                                console.log(reason)
                                if (reason == "selectOption" || reason == "removeOption") {
                                    return;
                                }
                                setOpen(false)
                            }}
                            open={open}
                            onChange={(_, value, reason, detail) => {
                                console.log(detail)
                                if (reason == "clear") {
                                    onChange([])
                                }
                            }}
                            // list จะทะลุ dialog ได้ ถ้าไม่ใส่ มันจะกลับหัวย้อนขึ้น top แทนจะ bottom //
                            // If true, the Popper content will be under the DOM hierarchy of the parent component.  @default false
                            disablePortal={false}
                            noOptionsText="-- ไม่มีตัวเลือก --"
                            disabled={disabled}
                            // value={value || null}
                            // value={value ? value : null}
                            inputValue={inputValue}
                            // isOptionEqualToValue={(option, value) => option.value === value.value}
                            isOptionEqualToValue={(option, value) => {
                                console.log(option, value)
                                return option?.value === value?.value
                            }
                            }
                            getOptionLabel={(option) => {
                                console.log(option)
                                console.log(option.label)
                                option?.label == undefined && console.log("unde")
                                return option.label || option
                            }}
                            onBlur={onBlur}
                            // onChange={(_, newValue) => {
                            //     const allSelect = !!newValue.find(e => e.value == "all")
                            //     console.log(allSelect)
                            //     console.log(newValue)
                            //     if (allSelect) {
                            //         onChange(options)
                            //     } else {
                            //         onChange(newValue)
                            //     }
                            // }}
                            onInputChange={(event, newInputValue) => {
                                console.log(event?.type, "-> ", newInputValue)
                                !!event?.type && setInputValue(newInputValue);
                            }}
                            value={value || []}
                            options={options}
                            // renderOption={(props, option, state, ownerState) => {
                            //     const isAllSelect = option.value == "all"
                            //     const hasChecked = !!(value || []).find((e: any) => e.value == "all")
                            //     console.log(hasChecked)
                            //     console.log(props)
                            //     console.log(option)

                            //     console.log(state)
                            //     console.log(ownerState)
                            //     // 1. กระจาย props ไปยังองค์ประกอบหลัก (<li>) เพื่อให้การคลิกทำงาน
                            //     const isAllChecked = (value || []).length === options.length - 1;

                            //     console.log(isAllChecked)
                            //     const handleSelect = () => {
                            //         if (isAllSelect) {
                            //             // 1. ถ้าคลิก 'Select All'
                            //             if (hasChecked) {
                            //                 // 1.1 ถ้าถูกเลือกทั้งหมดอยู่แล้ว -> ยกเลิกการเลือกทั้งหมด
                            //                 onChange([]);
                            //             } else {
                            //                 // 1.2 ถ้ายังไม่ถูกเลือกทั้งหมด -> เลือกทุก options ยกเว้น option "all"
                            //                 // const allOptionsExceptAll = options.filter(opt => opt.value !== "all");
                            //                 // onChange(allOptionsExceptAll);
                            //                 onChange(options)
                            //             }
                            //         } else {
                            //             // 2. ถ้าคลิกตัวเลือกปกติ: ให้ MUI จัดการการเลือก/ยกเลิกการเลือกตามปกติ
                            //             // เราต้องใช้ logic ที่จะจำลองการทำงานของ Autocomplete 
                            //             const isSelected = (value || []).some((v: any) => v.value === option.value);

                            //             if (isSelected) {
                            //                 // ยกเลิกการเลือก
                            //                 onChange((value || []).filter((v: any) => v.value !== option.value && v.value !== "all"));
                            //             } else {
                            //                 // เลือก
                            //                 console.log(value)
                            //                 console.log(options)
                            //                 const isAlmostAllChecked = (value || []).length === options.length - 2;
                            //                 console.log(isAlmostAllChecked)
                            //                 if (isAlmostAllChecked) {
                            //                     onChange([...(value || []), option]);
                            //                 } else {
                            //                     onChange([...(value || []), option]);
                            //                 }
                            //             }
                            //         }
                            //         // ปิด Autocomplete หลังจากเลือก (ถ้าต้องการ)
                            //         // setOpen(false); // ลบออกเพื่อไม่ให้ปิดทันที
                            //     };
                            //     return (
                            //         <li
                            //             {...props}
                            //             // onClick={() => {
                            //             //     console.log("object")
                            //             //     console.log(isAllSelect)
                            //             //     if (isAllSelect) {
                            //             //         if (state.selected) {
                            //             //             onChange([])
                            //             //         } else {
                            //             //             onChange(options)
                            //             //         }
                            //             //     } else {

                            //             //     }
                            //             // }}
                            //             onClick={() => { handleSelect() }}

                            //             key={option.value}
                            //         >
                            //             <div
                            //                 className='flex items-center'>
                            //                 <input
                            //                     readOnly
                            //                     className='checkbox-default-small'
                            //                     type='checkbox'
                            //                     checked={state.selected} // ใช้ state.selected ที่ MUI ให้มา
                            //                     style={{ marginRight: 8 }}

                            //                 />
                            //                 <span className='ml-2'>
                            //                     {option.label}
                            //                 </span>
                            //             </div>
                            //         </li>
                            //     );
                            // }}
                            renderOption={(props, option, state, ownerState) => {
                                const isAllSelect = option.value === "all";
                                // 🚨 ใช้ isAllCheckedByCount ที่คำนวณไว้ด้านบน 🚨

                                const handleSelect = () => {
                                    if (isAllSelect) {
                                        // Logic: ถ้าถูกเลือกหมด (isAllCheckedByCount) ให้ยกเลิกการเลือกทั้งหมด, มิฉะนั้นให้เลือกทุก options ยกเว้น 'all'
                                        if (isAllCheckedByCount) {
                                            onChange([]); // ยกเลิกการเลือกทั้งหมด
                                        } else {
                                            // เลือกทุก options ที่ไม่ใช่ 'all'
                                            onChange(regularOptions);
                                        }
                                    } else {
                                        // Logic สำหรับการเลือก/ยกเลิกรายการปกติ
                                        const isSelected = selectedValue.some((v: any) => v.value === option.value);

                                        if (isSelected) {
                                            // ยกเลิกการเลือก: กรอง option นี้ออก
                                            onChange(selectedValue.filter((v: any) => v.value !== option.value));
                                        } else {
                                            // เลือก: เพิ่ม option เข้าไป
                                            onChange([...selectedValue, option]);
                                        }
                                    }
                                };

                                // *** การแสดงผล Checkbox ***
                                let checkedState = state.selected;
                                if (isAllSelect) {
                                    // ถ้าเป็นตัวเลือก 'all' ให้ใช้ Logic การนับ
                                    checkedState = isAllCheckedByCount;
                                }

                                return (
                                    <li
                                        {...props}
                                        onClick={handleSelect} // ใช้ฟังก์ชันการจัดการที่กำหนดเอง
                                        key={option.value}
                                    >
                                        <div
                                            className='flex items-center'>
                                            <input
                                                readOnly
                                                className='checkbox-default-small'
                                                type='checkbox'
                                                checked={checkedState} // 🚨 ใช้ checkedState ที่คำนวณใหม่
                                                style={{ marginRight: 8 }}
                                            />
                                            <span className='ml-2'>
                                                {option.label}
                                            </span>
                                        </div>
                                    </li>
                                );
                            }}
                            renderInput={
                                (params) => {
                                    return <TextField

                                        {...params}
                                        ref={ref}
                                        placeholder={placeholder}
                                        sx={{
                                            paddingTop: 0,
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "14px",
                                                top: "-3px !important",
                                                position: "relative !important",
                                            },
                                            "& .MuiInputBase-input": {
                                                paddingTop: 0
                                            },
                                            "& .MuiInputBase-root": {
                                                marginTop: 0,
                                                paddingTop: 0,
                                                minHeight: 38,
                                            },
                                            minHeight: 30,
                                            maxHeight: 30,
                                            '& .MuiAutocomplete-inputRoot': {
                                                border: "none",
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#E6E6E6 !important', // เปลี่ยนสีขอบเป็นสีแดงตลอดเวลา
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
            {watchedValue.length > 0 && <div className='mt-4 flex flex-wrap gap-1'>
                {
                    watchedValue.map((e: any, i: number) => {
                        console.log(e)
                        return (
                            <div key={i} className=''>
                                <CustomDeleteIconChips label={e.label}
                                    onClick={() => {
                                        console.log(e)
                                        console.log("object")
                                        setValue(name, (watchedValue || []).filter((v: any) => v.value !== e.value))
                                    }} />
                            </div>
                        )
                    })
                }
            </div>
            }
        </Box>
    )
}

// CustomLabel.js
function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text: string; isError?: boolean }) {
    return (
        <div className='text-[16px] mb-2 h-[20px]' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-error'>*</span>} </div>
    );
}