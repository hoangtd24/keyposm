"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Table from "@/components/ui/module/table";
import { cn } from "@/lib/utils";
import { Trash2, Edit, Plus, MoreVertical, Download } from 'lucide-react';
import {
    CreateLocation,
    DeleteLocation,
    ImportLocation,
    DeleteMultipleLocation
} from "@/components/ui/module/location";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast"

import { axiosWithHeaders } from "@/lib/axiosWrapper";
import {
    NEXT_PUBLIC_DOWNLOAD_TEMPLATE_LOCATION,
    NEXT_PUBLIC_DOWNLOAD_TEMPLATE_PROVINCES_DISTRICTS,
    NEXT_PUBLIC_DOWNLOAD_LOCATION
} from "@/config/api";

import * as enums from "@/lib/enums";
import jwtDecode from "jwt-decode";
import { useTableInstance } from 'ka-table';
import { ICellTextProps } from 'ka-table/props';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { PagingOptions } from 'ka-table/models';
import _ from "lodash";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card";

const columns = [
    {
        key: "0",
        field: "",
        title: "",
        width: 30
    },
    {
        key: "2",
        field: "code",
        title: "Mã địa điểm",
        width: 150
    },
    {
        key: "3",
        field: "locationName",
        title: "Địa điểm",
        width: 350
    },
    {
        key: "4",
        field: "province",
        title: "Tỉnh/Thành phố",
        width: 200
    },
    {
        key: "5",
        field: "district",
        title: "Quận/Huyện",
        width: 200
    },
    // {
    //     key: "6",
    //     field: "ward",
    //     title: "Phường/ Xã",
    //     width: 200
    // },
    // {
    //     key: "7",
    //     field: "address",
    //     title: "Địa chỉ",
    //     width: 450
    // },
    // {
    //     key: "9",
    //     field: "contact",
    //     title: "Liên hệ",
    //     width: 300
    // },
    // {
    //     key: "8",
    //     field: "note",
    //     title: "Ghi chú",
    //     width: 300
    // }
]

const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableLocationProps = {
    loading: boolean,
    data: any | [],
    paging: PagingOptions,
    selectedRows?: number[] | undefined,
    totalRows: number | null,
    onChangeTablePage: (pageIndex: number, pageSize: number) => void,
    onChangeSelectedRows?: (selectedRows: number[] | undefined) => void,
    onRefresh: () => void,
    onAssign: () => void;
}

export default function TableLocation({ data, paging, loading, totalRows, onChangeTablePage, onChangeSelectedRows, onRefresh, onAssign, selectedRows }: TableLocationProps) {
    const { access_token } = useAppSelector((state: any) => state.auth);

    const [roleId, setRoleId] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem(token_storage) ? localStorage.getItem(token_storage) : access_token;
        if (token) {
            const decoded: any = jwtDecode(token);
            const info: any = decoded.data;

            const roleId = info.roleId;

            setRoleId(roleId);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [access_token])

    const HeaderCheck = () => {
        // const table = useTableInstance();
        let areAllRowsSelected = false;
        if (selectedRows) {
            areAllRowsSelected = (selectedRows?.length === data.length && data.length > 0) ? true : false;
        }

        return (
            <Checkbox
                checked={areAllRowsSelected}
                className={
                    cn("mr-1 ml-1 bg-background data-[state=checked]:bg-background data-[state=checked]:text-foreground")
                }
                onCheckedChange={(checked) => {
                    if (checked) {
                        let listIds: number[] = [];
                        data.forEach((item: any) => {
                            listIds.push(item.id);
                        })
                        onChangeSelectedRows && onChangeSelectedRows(listIds);
                    } else {
                        onChangeSelectedRows && onChangeSelectedRows([]);
                    }
                }}
            />
        )
    }

    const CellCheck = ({ rowKeyValue, isSelectedRow }: ICellTextProps) => {
        // const table = useTableInstance();
        return (
            <Checkbox
                checked={isSelectedRow}
                onCheckedChange={(checked) => {
                    let listIds: any = _.cloneDeep(selectedRows);
                    if (checked) {
                        // table.selectRow(rowKeyValue);
                        listIds.push(rowKeyValue);
                    } else {
                        // table.deselectRow(rowKeyValue);
                        listIds = listIds.filter((item: any) => item !== rowKeyValue);
                    }
                    onChangeSelectedRows && onChangeSelectedRows(listIds);
                }}
                className="mr-2 ml-3 mt-2"
            />
        )
    }

    return (
        <>
            <style jsx global>
                {`
                    .ka-table colgroup{
                        display: none;
                    }

                    @media (min-width: 1024px) {
                        .ka-table colgroup{
                            display: table-column-group;
                        }
                    }
                `}
            </style>
            <div className="flex justify-between mt-2 items-end">
                {totalRows && totalRows !== 0 ? <Label className="px-0 text-xs lg:text-sm sm: text-muted-foreground h-auto">Hiển thị {`${paging.pageSize} trên tổng số ${totalRows}`} dòng.</Label> : <span>{` `}</span>}
            </div>
            {roleId === 1 && (
                <>
                    <div className="hidden lg:flex justify-between mt-2">
                        {selectedRows && selectedRows.length > 0 ? (
                            <div className="space-x-2">

                            </div>
                        ) : (
                            <span></span>
                        )}
                        <div className="space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={`outline`} className="text-foreground" onClick={() => onAssign()} disabled={selectedRows && selectedRows.length > 0 ? false : true}>
                                            <Plus className="pointer-events-none mr-2" />
                                            <Label className="pointer-events-none">Chỉ định</Label>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Chỉ định địa điểm</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <div className="w-full flex justify-between lg:hidden mt-2 space-x-3">
                        <div className="space-x-1.5">
                            <div className="px-2 h-auto flex justify-start items-center space-x-1">
                                <HeaderCheck />
                                <div className="w-8 h-8"></div>
                            </div>
                        </div>
                        <div className="space-x-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={`icon`} variant={`outline`} className="text-foreground w-8 h-8" onClick={() => {
                                            onAssign();
                                        }} disabled={selectedRows && selectedRows.length > 0 ? false : true}>
                                            <Plus className="w-5 h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="z-[51]">
                                        <Label>Chỉ định</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </>
            )}
            <div className="relative mt-2">
                <Table
                    columns={columns}
                    rowKeyField={"id"}
                    data={data}
                    headRow={{
                        content: (props: any) => {
                            return (
                                <>
                                    {props.columns.map((column: any) => {
                                        if (column.key === "0") {
                                            return (
                                                <th key={column.key} className="hidden lg:table-cell ka-thead-cell ka-thead-cell-height ka-thead-fixed bg-foreground z-40" style={{ padding: `0px`, height: 40 }}>
                                                    <div className="ka-thead-cell-wrapper">
                                                        <div className="ka-thead-cell-content-wrapper">
                                                            <div className={
                                                                cn(
                                                                    //default
                                                                    "ka-thead-cell-content flex items-center text-background px-2",
                                                                    //custom
                                                                )
                                                            }>
                                                                <HeaderCheck  {...props} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </th>
                                            )
                                        }
                                        return (
                                            <th key={column.key} className="hidden lg:table-cell ka-thead-cell ka-thead-cell-height ka-thead-fixed bg-foreground z-40" style={{ padding: `0px`, height: 40 }}>
                                                <div className="ka-thead-cell-wrapper">
                                                    <div className="ka-thead-cell-content-wrapper">
                                                        <div className={
                                                            cn(
                                                                //default
                                                                "ka-thead-cell-content flex items-center text-background px-2",
                                                                //custom
                                                            )
                                                        }>
                                                            {column.title}
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                        )
                                    })}
                                </>
                            )
                        }
                    }}
                    dataRow={{
                        elementAttributes: ({ isSelectedRow }: any) => {
                            return {
                                className: cn(
                                    `cursor-pointer lg:min-h-[40px] group`,
                                    isSelectedRow ? `bg-transparent lg:bg-accent` : `lg:odd:bg-white lg:even:bg-black/5`,
                                ),
                            }
                        },
                        content: (props: any) => {
                            return (
                                <>
                                    <td colSpan={props.columns.length} className="lg:hidden w-full flex-1 relative">
                                        <Card className="shadow-none">
                                            <CardContent className="p-0 w-full flex space-x-1">
                                                {roleId === 1 && (
                                                    <div className="p-2 h-auto flex justify-center items-start py-2.5 w-8">
                                                        <CellCheck {...props} />
                                                    </div>
                                                )}
                                                <div className={
                                                    cn(
                                                        "relative z-0 py-0.5 pb-2  space-y-0.5 flex flex-col overflow-x-hidden",
                                                        roleId === 1 ? "w-[calc(100%-32px)] pr-1" : "w-full px-3",
                                                    )
                                                }>
                                                    <div>
                                                        <p className="font-bold line-clamp-2 sm:text-lg">{` ` + props.rowData.locationName}</p>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-black/70 line-clamp-2 font-medium">
                                                        <span className="text-black/60 text-xs sm:text-sm font-normal">Địa chỉ:</span>{` ` + props.rowData.address}
                                                    </p>
                                                    <div>
                                                        <span className="text-black/60 text-xs sm:text-sm">Liên hệ:</span><Label className="text-xs sm:text-sm">{` ` + props.rowData.contact}</Label>
                                                    </div>
                                                    {props.rowData.note && (
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Ghi chú:</span><Label className="text-xs sm:text-sm">{` ` + props.rowData.note}</Label>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </td>
                                    {props.columns.map((column: any) => {
                                        if (column.key === "0") {
                                            return (
                                                <td className="ka-cell hidden lg:table-cell" key={column.key} style={{ height: 40, padding: 0 }}>
                                                    <div className={
                                                        cn(
                                                            "ka-cell-text truncate relative h-full",
                                                        )
                                                    }>
                                                        <CellCheck {...props} />
                                                    </div>
                                                </td>
                                            )
                                        }
                                        return (
                                            <td className="ka-cell hidden lg:table-cell" key={column.key} style={{ height: 40, padding: 0 }}>
                                                <div className={
                                                    cn(
                                                        "ka-cell-text truncate relative h-full",
                                                    )
                                                }>
                                                    {column.field !== "action" ? (
                                                        <span className="w-full h-auto inline-block align-middle truncate px-2">
                                                            {props.rowData[column.field]}
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {roleId === 1 && (
                                                                <div className="hidden bg-transparent lg:group-hover:flex justify-end items-center absolute top-0 right-0 h-full px-3 z-30">

                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </>
                            )
                        }
                    }}
                    loading={loading}
                    paging={paging}
                    selectedRows={selectedRows}
                    onChangeTablePage={onChangeTablePage}
                />
            </div>
        </>
    )
}