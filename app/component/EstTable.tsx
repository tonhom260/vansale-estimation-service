"use client"
import { BiEditAlt } from "react-icons/bi";
import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TEstDoc } from "@/action/estimation-document/get"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { HiOutlineTrash } from "react-icons/hi2"
import Link from "next/link";
import { delEstimationDocument } from "@/action/estimation-document/del";


export const columnsEst: ColumnDef<TEstDoc>[] = [
    {
        id: "orderDocname" as keyof TEstDoc,
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "estdocname" as keyof TEstDoc,
        header: "ชื่อเอกสาร",
        cell: ({ row }) => {
            const docname = row.original.orderDocname
            return (
                <div>{docname}</div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        filterFn: (row, fieldname, filterValue) => {
            console.log(filterValue)
            const custname = row.original.customerDB?.custname ?? ""
            const docname = row.original.orderDocname || ""
            const custcode = row.original.custcode?.toLocaleLowerCase() ?? ""
            console.log(docname, docname.includes(filterValue))
            return custname.toLocaleLowerCase().includes(filterValue)
                || docname.toLowerCase().includes(filterValue)
                || custcode.includes(filterValue)
        },
        accessorKey: "custname" as keyof TEstDoc,
        header: "ชื่อลูกค้า",
        cell: ({ row }) => {
            // console.log(row.original.customerDB)
            const customer = row.original.customerDB
            const custname = customer?.custname ?? ""

            return (
                < div className="capitalize" > {custname}</div>
            )
        },
    },
    {
        accessorKey: "createAt" as keyof TEstDoc,
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    สร้างเมื่อ
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            // console.log(row.original.createAt)
            const createDate = new Date(row.original.createAt as any)
            // console.log(createDate)
            const formated = format(createDate, "dd-MM-yyyy")
            // console.log(formated)
            return <div className="lowercase pl-4">{formated}</div>
        },
    },
    {
        accessorKey: "responsible" as keyof TEstDoc,
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ผู้แก้ไขล่าสุด
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase pl-4">{row.getValue("responsible")}</div>,
    },

    {
        accessorKey: "netamount", enableHiding: false,
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }}
                >
                    ยอดประมาณการ
                    <ArrowUpDown />
                </Button>
            )
        },
        sortingFn: (rowA, rowB, columnId) => {
            const valA = rowA.getValue(columnId) as number;
            const valB = rowB.getValue(columnId) as number;

            // ตัวอย่าง: ถ้าค่าเท่ากัน ให้ไปดูที่ custcode แทน
            if (valA === valB) {
                return rowA.original.netamount || 0 > (rowB.original.netamount || 0) ? 1 : -1;
            }
            return valA > valB ? 1 : -1;
        },
        cell: ({ row }) => {
            // console.log(row)
            const amount = row.original.netamount
            // console.log(amount)
            const formatted = new Intl.NumberFormat("TH", {
                style: "currency",
                currency: "THB",
            }).format(amount || 0)

            return (
                <div className="ml-3">
                    {formatted}
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        header: "คำสั่ง",
        cell: ({ row }) => {
            // console.log(row)
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>การดำเนินการ</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(row.original.orderDocname)}
                        >
                            คัดลอกเลขที่เอกสาร
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-blue-500 hover:text-blue-500!"> <Link className="flex" href={`/${row.original.orderDocname}`}>แก้ไขประมาณการ <BiEditAlt className="text-blue-500 ml-2" /></Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => {
                            try {
                                await delEstimationDocument({ docname: row.original.orderDocname! })
                                window.location.reload()
                            } catch (e) { console.log(e) }
                        }} className="text-red-500 hover:text-red-500!">ลบประมาณการ<HiOutlineTrash className="text-red-500" /> </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]


export default function EstDataTable({ data }: { data: any[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: data,
        columns: columnsEst,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            pagination: {
                pageIndex: 0,
                pageSize: 40
            },
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center justify-end space-x-2 pb-4">
                <div className="text-muted-foreground flex-1 text-sm text-end">
                    พบข้อมูลทั้งหมด <span className="font-bold">{table.getFilteredRowModel().rows.length}</span> แถว
                </div>
            </div>
            <div className="flex items-center py-4">
                <Input
                    // children={<div>hello</div>}
                    autoComplete="off"
                    placeholder="คัดกรองชื่อเอกสาร ชื่อร้านค้า หรือ รหัสร้านค้า "
                    value={(table.getColumn("custname")?.getFilterValue() as string) ?? ""}
                    onChange={
                        (event) => {
                            console.log(table.getColumn("custname")?.getFilterValue())
                            const col = table.getColumn("custname")
                            console.log(col)
                            table.getColumn("custname")?.setFilterValue(event.target.value)
                        }}
                    className="max-w-sm"
                />

            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columnsEst.length}
                                    className="h-24 text-center"
                                >
                                    <div className="">-- โปรดระบุสายขาย และ วันที่ --</div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
