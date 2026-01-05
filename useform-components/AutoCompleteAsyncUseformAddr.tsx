'use client'
import axios from 'axios'
import { Autocomplete, Box, CircularProgress, InputAdornment, InputLabel, TextField } from '@mui/material'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react';
import { AxiosInstance } from '@/lib/axios_model';


function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}


type Props = { disabled?: boolean; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium" }

export default function AutoCompleteAsyncUseformAddr({ disabled = false, name, formData, label = "", size = "small", required = false, }: Props) {
    const {
        control,
        formState: { errors }
    } = formData;
    const errState = !!errors[name!]
    // console.log(errState)

    const [options, setOptions] = useState<readonly any[]>([]);
    const [loading, setLoading] = useState(false);


    const handleOpen = (queryText?: string) => {
        if (!queryText) {
            return;
        }
        (async () => {
            const res = await AxiosInstance(`/geo?querytext=${queryText}`)
            console.log(res.data)
            console.log("refresh")
            const resOptions = res.data
            setLoading(true);
            await sleep(500); // For demo purposes.
            setLoading(false);
            setOptions([...resOptions]);
        })();
    };

    const handleClose = () => {
        setOptions([]);
    };

    return (
        <Box component="div" sx={{}}>
            <CustomLabel text={label} required={required} isError={errState} />
            <Controller
                name={name!}
                control={control}
                render={({ field: { onChange, name, onBlur, ref, value, }, fieldState: { error, invalid, isDirty, isTouched, isValidating }, formState }) => {
                    return (
                        <Autocomplete
                            slotProps={{
                                listbox: { sx: { padding: 0 } },
                                // paper: { sx: { padding: 0, margin: 0, background: "red" } }, popper: { sx: { padding: 0, background: 'red' } }
                            }}
                            noOptionsText="-- ไม่มีตัวเลือก --"
                            disabled={disabled}
                            value={value || null}
                            onChange={(event, newValue) => onChange(newValue)}
                            onBlur={onBlur}
                            // modify here
                            onInputChange={(event, newInputValue, reason) => {
                                // เราจะ fetch ข้อมูลก็ต่อเมื่อผู้ใช้ "พิมพ์" เท่านั้น
                                // ไม่ใช่ตอนที่เลือกค่า (reset) หรือล้างค่า (clear)
                                if (reason === 'input' && !!newInputValue) {
                                    handleOpen(newInputValue);
                                }
                            }}

                            onOpen={() => handleOpen()}
                            onClose={handleClose}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            loading={loading}
                            getOptionLabel={(option) => option.label}
                            disablePortal
                            options={options}

                            renderInput={
                                (params) => {
                                    // console.log(params)
                                    return <TextField
                                        {...params}
                                        inputRef={ref}
                                        fullWidth
                                        placeholder={"ระบุรหัสไปรษณีย์, จังหวัด, เขต, หรือแขวง"}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                height: 40,
                                                borderRadius: 2,
                                            },
                                        }}
                                        // slotProps={{
                                        //     input: {
                                        //         ...params.InputProps,
                                        //         startAdornment: (
                                        //             <InputAdornment position="start">
                                        //                 <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />
                                        //             </InputAdornment>
                                        //         ),
                                        //         endAdornment: (
                                        //             <Fragment>
                                        //                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        //                 {params.InputProps.endAdornment}
                                        //             </Fragment>
                                        //         ),
                                        //     },
                                        // }}

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
        <div className='text-sm mb-1' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-secondary'>*</span>} </div>
    );
}
