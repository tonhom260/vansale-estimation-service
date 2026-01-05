'use client'

import { Autocomplete, Box, Checkbox, TextField } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const SELECT_ALL_OPTION = {
    value: "SELECT_ALL",
    label: "เลือกทั้งหมด"
};

type Props = { disabled?: boolean; options: any[]; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium", placeholder?: string }
export default function AutoCompleteWithCheckboxUseformSelectAll({ placeholder = "", disabled = false, name, formData, label = "", size = "small", required = false, options }: Props) {
    const {
        control,
        formState: { errors }
    } = formData;
    const errState = !!errors[name!]

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const indeterminateIcon = <IndeterminateCheckBoxIcon fontSize="small" />; // ไอคอนสำหรับเลือกบางส่วน

    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                name={name!}
                control={control}
                render={({ field: { onChange, onBlur, value, ...field }, fieldState: { error } }) => {
                    // ตรวจสอบว่า "เลือกทั้งหมด" ควรถูกเลือกหรือไม่
                    const allSelected = options.length > 0 && value?.length === options.length;
                    console.log(value, allSelected)
                    return (
                        <Autocomplete
                            {...field}
                            size={size}
                            noOptionsText="-- ไม่มีตัวเลือก --"
                            multiple
                            disableCloseOnSelect
                            disabled={disabled}
                            // 2. เพิ่ม "เลือกทั้งหมด" เข้าไปในลิสต์ตัวเลือก
                            options={[SELECT_ALL_OPTION, ...options]}
                            value={value || []}
                            onBlur={onBlur}
                            // 3. จัดการ Logic การเลือก
                            onChange={(event, newValue) => {
                                // ตรวจสอบว่ามีการคลิกที่ "เลือกทั้งหมด" หรือไม่
                                const selectAllClicked = newValue.some(option => option.value === SELECT_ALL_OPTION.value);

                                if (selectAllClicked) {
                                    // ถ้าคลิก "เลือกทั้งหมด" และปัจจุบันได้เลือกไว้ทั้งหมดแล้ว -> ให้ยกเลิกทั้งหมด
                                    if (allSelected) {
                                        onChange([]);
                                    } else {
                                        // ถ้ายังไม่ได้เลือกทั้งหมด -> ให้เลือกทั้งหมด
                                        onChange(options);
                                    }
                                } else {
                                    // ถ้าเลือกรายการปกติ ให้ส่งค่าที่เลือกไปตามปกติ
                                    onChange(newValue);
                                }
                            }}
                            getOptionLabel={(option) => option.label || ""}
                            // prop นี้สำคัญมากเพื่อให้ Autocomplete เปรียบเทียบ object ได้ถูกต้อง
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            renderOption={(props, option, { selected }) => {
                                const { key, ...optionProps } = props;

                                if (option.value === SELECT_ALL_OPTION.value) {
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                indeterminateIcon={indeterminateIcon}
                                                checked={allSelected}
                                                // แสดงสถานะ "เลือกบางส่วน"
                                                indeterminate={value?.length > 0 && !allSelected}
                                            />
                                            {option.label}
                                        </li>
                                    );
                                }
                                // สำหรับ Option ทั่วไป
                                return (
                                    <li key={key} {...optionProps}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            checked={selected}
                                        />
                                        {option.label}
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: 38,
                                            borderRadius: 2,
                                        },
                                    }}
                                    placeholder={value?.length > 0 ? "" : placeholder}
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                            renderTags={(values) => {
                                const isSelectedAll = options.length == value.length
                                if (isSelectedAll) {
                                    return <div className='px-[10px] pb-[2px]'>เลือกทั้งหมด</div>
                                } else {
                                    return (
                                        <div className='flex pl-3'>
                                            {
                                                values.map((option, index) => {
                                                    const len = values.length
                                                    // console.log(len)
                                                    // console.log(index + 1)
                                                    const lastOption = len == index + 1
                                                    return (
                                                        <div className='pr-[5px] pb-[2px]'> {option.label}{!lastOption && <span className=''>,</span>}</div>
                                                    );
                                                })
                                            }
                                        </div>
                                    )
                                }


                            }

                            }
                        />
                    )
                }}
            />
        </Box>
    )
}

function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text: string; isError?: boolean }) {
    return (
        <div className='text-sm mb-1' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-secondary'>*</span>} </div>
    );
}

// เพิ่ม import สำหรับไอคอน Indeterminate
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';