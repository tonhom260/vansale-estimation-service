'use client'
import "../app/globals.css"
import { th, enUS } from 'date-fns/locale'
import { format, setDate, subDays, subMonths, startOfWeek, endOfWeek } from "date-fns"
import * as React from "react"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import { Controller } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@heroicons/react/24/outline'

export function DatePickerWithRange(
    { className,
        onClose,
        formControl,
        name = "daterange", align = "start",
        size = "small",
        selectLang = "TH",
        numberOfMonths = 2
    }: {
        numberOfMonths?: number;
        selectLang?: any;
        onClose?: () => void;
        size?: "small" | "medium",
        className?: string | undefined; formControl?: any; name?: string; align?: "center" | "end" | "start" | undefined
    }
) {

    // console.log('DatePickerWithRangeChadcn')
    function setToday(setFn: (event: DateRange) => void) {
        setFn({ from: new Date(), to: new Date() })
        setMonth(new Date())
    }
    function setYesterday(setFn: (event: DateRange) => void) {
        setFn({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) })
        setMonth(subDays(new Date(), 1))
    }

    function set7DayBefore(setFn: (event: DateRange) => void) {
        const seven7daysBefore = subDays(new Date(), 7)
        setFn({ from: seven7daysBefore, to: seven7daysBefore })
        setMonth(seven7daysBefore)
    }

    function setThisWeek(setFn: (event: DateRange) => void) {
        // const tgDate = subDays(new Date(), 30)
        const today = new Date();
        // console.log(today)
        const startWeekDate = startOfWeek(today, { weekStartsOn: 0 })
        const endWeekDate = endOfWeek(today, { weekStartsOn: 0 })
        // console.log(startWeekDate)
        // console.log(endWeekDate)
        setFn({ from: startWeekDate, to: endWeekDate })
        setMonth(startWeekDate)
    }

    function setLastWeek(setFn: (event: DateRange) => void) {
        // const tgDate = subDays(new Date(), 30)
        const today = new Date();
        const lastWeek = subDays(today, 7)

        // console.log(today)
        const startWeekDate = startOfWeek(lastWeek, { weekStartsOn: 0 })
        const endWeekDate = endOfWeek(lastWeek, { weekStartsOn: 0 })
        // console.log(startWeekDate)
        // console.log(endWeekDate)
        setFn({ from: startWeekDate, to: endWeekDate })
        setMonth(startWeekDate)
    }

    function setThisMonth(setFn: (event: DateRange) => void) {
        // console.log("setThisMonth")
        // const tgDate = subDays(new Date(), 30)
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setFn({ from: start, to: end })
        setMonth(start)
    }
    function setLastMonth(setFn: (event: DateRange) => void) {
        // console.log("setThisMonth")
        // const tgDate = subDays(new Date(), 30)
        const today = new Date();
        const lastMonthDate = subMonths(today, 1)
        // console.log(lastMonthDate)
        const start = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1);
        const end = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 0);
        setFn({ from: start, to: end })
        setMonth(start)
    }
    function setThisYear(setFn: (event: DateRange) => void) {
        // const tgDate = subDays(new Date(), 30)
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        // End date of the current year (December 31st)
        const endOfYear = new Date(new Date().getFullYear(), 11, 31);
        setFn({ from: startOfYear, to: endOfYear })
        setMonth(startOfYear)
    }
    function setPrevYear(setFn: (event: DateRange) => void) {
        const today = new Date();
        const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
        // End date of last year (December 31st of last year)
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        setFn({ from: startOfLastYear, to: endOfLastYear })
        setMonth(startOfLastYear)
    }
    const [month, setMonth] = React.useState(formControl?.watch(name as any)?.from)
    const [isOpen, setIsOpen] = React.useState(false)
    console.log(isOpen)
    return (
        <Controller
            control={formControl?.control}
            name={name as any}
            render={({ field }) => {
                const date = field?.value as DateRange | undefined
                return (
                    <div className={cn("grid gap-2 font-thai1 text-gray-500 ", className)}>
                        <Popover
                            onOpenChange={(isOpen) => {
                                setIsOpen(isOpen)
                                // console.log(isOpen)
                                if (!isOpen) {
                                    !!onClose && onClose!()
                                }
                            }}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    // className={cn(
                                    // `w-[300px] ${size == "medium" ? " h-12 " : " h-9 "}  justify-start text-left text-[18px] font-normal text-gray-500`,
                                    //     (!date ? " text-muted-foreground " : '')
                                    // )}
                                    className={cn(
                                        `min-w-[360px] h-[38px]  justify-start text-left text-sm font-normal border-[#C4C4C4] rounded-[8px] ${isOpen ? "border-blue-500 border-2" : "hover:border-black"} text-[#000000de] hover:bg-transparent `,
                                        (!date ? "text-muted-foreground " : ''),
                                        (isOpen ? "border-blue-500 border-2" : "")
                                    )}
                                >
                                    <div className='flex items-center justify-between w-full'>
                                        <div className='w-full'>
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(date.from, "dd LLL  y", { locale: selectLang == "TH" ? th : undefined })} -{" "}
                                                        {format(date.to, "dd LLL y", { locale: selectLang == "TH" ? th : undefined })}
                                                    </>
                                                ) : (
                                                    format(date.from, "dd LLL y", { locale: selectLang == "TH" ? th : undefined })
                                                )
                                            ) : (
                                                <span className="text-[16px] text-gray-400">
                                                    {"ช่วงเวลาที่เลือก"}
                                                </span>
                                            )}
                                        </div>
                                        {/* <IoCalendarClearOutline className={cn(`font-thai1 text-gray-500 text-xl`, size == 'medium' && "text-2xl")} /> */}
                                        <CalendarIcon className="icon-default" />
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="z-9999! w-auto p-0 font-thai1 flex text-gray-500" align={align}>
                                <div className='text-gray-500 flex flex-col justify-evenly max-h-[300px] h-[300px]my-3 mt-5'>
                                    <div onClick={() => { setToday(field.onChange) }} className='w-[103px] border rounded-md px-2 font-thai1 text-sm  mx-2 mt-1 hover:cursor-pointer py-2 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-500'>
                                        {"วันนี้"}
                                    </div>
                                    <div onClick={() => { setYesterday(field.onChange) }} className='w-[103px] border rounded-md px-2 font-thai1 text-sm  mx-2 hover:cursor-pointer py-2 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-500'>
                                        {"เมื่อวาน"}
                                    </div>
                                    <div onClick={() => { setThisWeek(field.onChange) }} className='w-[103px] border rounded-md px-2 font-thai1 text-sm  mx-2 hover:cursor-pointer py-2 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-500'>
                                        {"อาทิตย์นี้"}
                                    </div>
                                    <div onClick={() => { setLastWeek(field.onChange) }} className='w-[103px] border rounded-md px-2 font-thai1 text-sm  mx-2 hover:cursor-pointer py-2 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-500'>
                                        {"อาทิตย์ที่แล้ว"}
                                    </div>
                                    <div onClick={() => { setThisMonth(field.onChange) }} className='w-[103px] border rounded-md px-2 font-thai1 text-sm  mx-2 hover:cursor-pointer py-2 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-500'>
                                        {"เดือนนี้"}
                                    </div>
                                    <div onClick={() => { setLastMonth(field.onChange) }} className='w-[103px] border rounded-md px-2 font-thai1 text-sm  mx-2 hover:cursor-pointer py-2 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-500'>
                                        {"เดือนที่แล้ว"}
                                    </div>
                                    <div onClick={() => { setPrevYear(field.onChange) }} className='w-[103px] border rounded-md px-2 font-thai1 text-sm  mx-2 hover:cursor-pointer py-2 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-500'>
                                        {"ปีนี้"}
                                    </div>
                                </div>
                                <div>
                                    <div className='text-[12px] mx-4 my-2'>
                                        <div className='mb-1 h-4'>

                                            {/* {"ช่วงเวลาที่เลือก"} */}
                                        </div>
                                        <div className='text-xl text-black font-thai2'>

                                            {date?.from ? (
                                                date.to ? (
                                                    <div className=''>
                                                        <span className='border px-2 py-2 rounded-md text-sm font-normal  inline-flex items-center'>
                                                            {format(date.from, "dd LLL  yy", { locale: selectLang == "TH" ? th : undefined })}
                                                            <span><CalendarIcon className="icon-default size-5 ml-3 -translate-y-[2px]" /></span>
                                                        </span>
                                                        <span> {" "}</span>
                                                        <span className='border px-2 py-2 rounded-md text-sm font-normal  inline-flex items-center'>
                                                            {format(date.to, "dd LLL yy", { locale: selectLang == "TH" ? th : undefined })}
                                                            <span><CalendarIcon className="icon-default size-5 ml-3 -translate-y-[2px]" /></span>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    format(date.from, "dd LLL yy", { locale: selectLang == "TH" ? th : undefined })
                                                )
                                            ) : (
                                                <span>{"เลือกวันที่"}</span>
                                            )}
                                        </div>
                                    </div>
                                    <Calendar
                                        locale={selectLang == "TH" ? th : undefined}
                                        className='mx-2'
                                        selected={field.value}
                                        mode="range"
                                        defaultMonth={date?.from}
                                        onMonthChange={(e) => { console.log(e); setMonth(e) }}
                                        month={month}
                                        onSelect={(range, selectedDate, activeModifier) => {
                                            // console.log("active");
                                            // console.log(range, "range");
                                            // console.log(selectedDate, "selectDate");
                                            // console.log(activeModifier, "activemodifier");
                                            field.onChange(range);
                                        }}
                                        numberOfMonths={numberOfMonths}
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

