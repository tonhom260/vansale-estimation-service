'use client'
import { Autocomplete, Box, CircularProgress, InputAdornment, InputLabel, TextField } from '@mui/material'
import { Controller, FieldValues, RegisterOptions, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react';
import { AxiosInstance } from '@/lib/axios_model';
import { PlaceData } from '@googlemaps/google-maps-services-js';


// function sleep(duration: number): Promise<void> {
//     return new Promise<void>((resolve) => {
//         setTimeout(() => {
//             resolve();
//         }, duration);
//     });
// }


type Props = { disabled?: boolean; required?: boolean; name?: string; formData: any; label?: string, size?: "small" | "medium"; onSelectPlaceFn: any }

export default function AutoCompleteAsyncUseformNearByPlace({ onSelectPlaceFn, disabled = false, name, formData, label = "", size = "small", required = false, }: Props) {
    const {
        control,
        formState: { errors }
    } = formData;
    const errState = !!errors[name!]
    // console.log(name)
    // console.log(errState)

    const [options, setOptions] = useState<readonly any[]>([]);
    // console.log(options)
    // console.log(options.length)
    const [loading, setLoading] = useState(false);

    const handleOpen = (queryText?: string) => {
        console.log(queryText)
        if (!queryText) {
            return;
        }
        setLoading(true);
        (async () => {
            const khonkeanCentre = [16.445981, 102.836853]
            console.log("object")
            const res = await AxiosInstance(`/get_addr/query_addr?lat=${khonkeanCentre.at(0)}&lng=${khonkeanCentre.at(1)}&keyword=${queryText}`)
            console.log(res.data)
            const resOptions = res.data
            console.log(resOptions)
            const modifyOption = resOptions.map((e: Partial<PlaceData & { location: any; key: number }>) => {
                console.log(e)
                return {
                    value: e.place_id,
                    name: e.name ?? "",
                    label: e?.vicinity ?? "",
                    latlng: e?.location ?? "", //  { lat: 13.8033034, lng: 100.6181374 }
                    key: e.key
                }
            })

            // await sleep(500); // For demo purposes.
            setLoading(false);
            // setOptions([...resOptions]);
            console.log(queryText, modifyOption)
            console.log(queryText, modifyOption.length)
            // setOptions(modifyOption);
            // const updateArr = [...modifyOption] // บังคับให้ rerender
            setOptions([...modifyOption]);
        })();
    };


    //test


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
                            filterOptions={(options) => { return options }}
                            slotProps={{ listbox: { sx: { padding: 0 } }, }}
                            noOptionsText="-- ไม่มีตัวเลือก --"
                            renderOption={(props, option, ownerState) => {
                                const { key, ...rest } = props
                                return <li
                                    key={key}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: "start",
                                        borderBottom: "1px solid #E5E5E5", minHeight: '60px'
                                    }}
                                    {...rest}
                                >
                                    <div className='truncate whitespace-nowrap'>{option.name}</div>
                                    <div className='text-xs text-[#61646B] line-clamp-2 '>{option.label}</div>
                                </li>
                            }}

                            disabled={disabled}
                            value={value || null}
                            onChange={(event, newValue) => {
                                // console.log(newValue)
                                const latlng = newValue?.latlng;
                                onSelectPlaceFn(latlng)
                                onChange(newValue)
                            }}
                            onBlur={onBlur}
                            // modify here
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'input' && !!newInputValue) {
                                    handleOpen(newInputValue);
                                }
                            }}

                            onOpen={() => handleOpen()}
                            onClose={handleClose}
                            isOptionEqualToValue={(option, value) => { return option.value === value.value }}
                            loading={loading}
                            getOptionLabel={(option) => option.name}// show ชื่อสถานที่แทน label
                            getOptionKey={(option) => option.value}
                            disablePortal
                            options={options}
                            renderInput={
                                (params) => {
                                    // console.log(params)
                                    return <TextField
                                        {...params}
                                        inputRef={ref}
                                        fullWidth
                                        placeholder={"ค้นหาสถานที่"}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                height: 40,
                                                borderRadius: 2,
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
                                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
        <div className='text-sm mb-1' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-secondary'>*</span>} </div>
    );
}
