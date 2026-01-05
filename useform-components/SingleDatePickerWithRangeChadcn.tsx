'use client'

import { th } from 'date-fns/locale'
import { format, setDate, subDays, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { useRef, useState } from 'react'

import { IoCalendarClearOutline } from "react-icons/io5";
import { Calendar } from '@/components/ui/calendar'
import { Controller, UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { useOnClickOutside } from 'usehooks-ts'
import dayjs, { Dayjs } from 'dayjs';


export function SingleDatePickerWithRangeChadcn(
    { className,
        formControl,
        name = "daterange", align = "start",
        size = "small",
        numberOfMonths = 1,
        selectYear
    }: {
        selectYear?: Dayjs
        selectLang?: any;
        size?: "small" | "medium",
        className?: string | undefined;
        formControl?: any; name?: string; align?: "center" | "end" | "start" | undefined
        numberOfMonths?: number
    }
) {

    const { watch } = formControl
    console.log(watch())

    const [month, setMonth] = useState(formControl?.watch(name as any)?.from)
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Controller
            control={formControl?.control}
            name={name as any}
            render={({ field }) => {
                const date = field?.value as Date | undefined
                // console.log(date)
                return (
                    <div className={cn("grid gap-2 font-light text-gray-500 rounded-xl", className)}>
                        <Popover
                            open={isOpen}
                            onOpenChange={(isOpen) => {
                                console.log(isOpen)
                                setIsOpen(isOpen)
                            }}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        `border-[#C4C4C4] pl-2 shadow-none min-w-50 rounded-[10px] ${size == "medium" ? " h-12 " : " h-[38px] "}  justify-start text-left  font-light text-gray-500`,
                                        (!date ? " text-muted-foreground " : '')
                                    )}
                                >
                                    <div className='flex items-center justify-between w-full pl-0'>
                                        <IoCalendarClearOutline className={"text-gray-400 text-[25px] "} />
                                        <div className='w-full text-[14px] text-gray-600 ml-2'>
                                            {
                                                !!date ? <span className='text-black '>{format(date, "dd-MM-yy")}</span> : "เลือกวันที่"
                                            }
                                        </div>

                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="z-9999! w-auto p-0  flex text-gray-500 rounded-xl" align={align}>
                                <div>
                                    <Calendar
                                        disabled={(date) => {
                                            if (!selectYear) return false

                                            console.log(selectYear?.year())
                                            const allowYear = selectYear!.year() - 543
                                            if (date.getFullYear() !== allowYear) {
                                                return true
                                            }
                                            return false
                                        }}
                                        lang='TH'
                                        formatters={{
                                            formatMonthDropdown(month, dateLib) {
                                                const monthThaiAbbr = {
                                                    1: "ม.ค.",
                                                    2: "ก.พ.",
                                                    3: "มี.ค.",
                                                    4: "เม.ย.",
                                                    5: "พ.ค.",
                                                    6: "มิ.ย.",
                                                    7: "ก.ค.",
                                                    8: "ส.ค.",
                                                    9: "ก.ย.",
                                                    10: "ต.ค.",
                                                    11: "พ.ย.",
                                                    12: "ธ.ค."
                                                };
                                                const monthThaiFull = {
                                                    1: "มกราคม",
                                                    2: "กุมภาพันธ์",
                                                    3: "มีนาคม",
                                                    4: "เมษายน",
                                                    5: "พฤษภาคม",
                                                    6: "มิถุนายน",
                                                    7: "กรกฎาคม",
                                                    8: "สิงหาคม",
                                                    9: "กันยายน",
                                                    10: "ตุลาคม",
                                                    11: "พฤศจิกายน",
                                                    12: "ธันวาคม"
                                                };
                                                console.log(month, dateLib)
                                                // return (month.getMonth() + 1).toString()
                                                return monthThaiFull[month.getMonth() + 1 as keyof typeof monthThaiFull]
                                            },
                                        }}
                                        captionLayout='dropdown-months'
                                        locale={th}
                                        className='mx-2 z-[100]'
                                        selected={field.value}
                                        mode="single"
                                        defaultMonth={date}
                                        onMonthChange={(e) => { console.log(e); setMonth(e) }}
                                        month={month}
                                        onSelect={(range, selectedDate, activeModifier) => {
                                            console.log(range)
                                            console.log(selectedDate)
                                            console.log(activeModifier)
                                            // console.log("active");
                                            // console.log(range, "range");
                                            // console.log(selectedDate, "selectDate");
                                            // console.log(activeModifier, "activemodifier");
                                            field.onChange(selectedDate);
                                            setIsOpen(false)
                                        }}
                                        numberOfMonths={numberOfMonths || 1}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div >
                )
            }}
        >

        </Controller>
    )
}

