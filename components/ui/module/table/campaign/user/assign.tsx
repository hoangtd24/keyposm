"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Table from "@/components/ui/module/table";
import { cn } from "@/lib/utils";
import { Trash2, Edit, ChevronDown, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { DetailUserProps } from "@/components/ui/module/brand/update";
import { useToast } from "@/components/ui/use-toast";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import jwtDecode from "jwt-decode";
// import { IHeadRowProps } from "ka-table/props";
import { useTableInstance } from 'ka-table';
import { ICellTextProps } from 'ka-table/props';
import {
    NEXT_PUBLIC_DEL_USER_CAMPAIGN_API,
    NEXT_PUBLIC_ASSIGN_USER_CAMPAIGN_API
} from "@/config/api";
import moment from "moment";
import { setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import AssignUser from "@/components/ui/module/user/campaign/assign";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { PagingOptions } from 'ka-table/models';
import _ from "lodash";

import { Card, CardContent } from "@/components/ui/card";

const columns = [
    {
        key: "0",
        field: "selection-cell",
        title: "",
        width: 40
    },
    {
        key: "1",
        field: "no",
        title: "STT",
        width: 40
    },
    {
        key: "2",
        field: "name",
        title: "Tài khoản",
        // width: 200
    },
    {
        key: "3",
        field: "username",
        title: "UserName",
        // width: 200
    },
    {
        key: "4",
        field: "roleName",
        title: "Quyền",
        // width: 200
    },
    // {
    //     key: "7",
    //     field: "action",
    //     title: <span>&nbsp;</span>,
    //     width: 80
    // }
]

const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableCampaignUserProps = {
    loading: boolean,
    data: any | [],
    paging: PagingOptions,
    totalRows: number | null,
    campaignId: string,
    selectedRows?: number[] | []
    onChangeSelectedRows?: (selectedRows: number[] | undefined) => void,
    onChangeTablePage: (pageIndex: number, pageSize: number) => void,
    onRefresh: () => void,
    onAssign: () => void
}

export default function TableData({ campaignId, data, paging, loading, totalRows, onChangeTablePage, onRefresh, selectedRows, onChangeSelectedRows, onAssign }: TableCampaignUserProps) {
    // const { data, loading } = useAppSelector((state: any) => state.table);
    const { access_token } = useAppSelector((state: any) => state.auth);
    // const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    // const [detail, setDetail] = useState<DetailUserProps>();
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
                    // console.log(checked)
                    let listIds: number[] = [];
                    if (checked) {
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

    const onCheckAll = (isCheck: boolean) => {
        let listIds: number[] = [];

        if (isCheck) {
            data.forEach((item: any) => {
                listIds.push(item.id);
            })
            onChangeSelectedRows && onChangeSelectedRows(listIds);
        } else {
            onChangeSelectedRows && onChangeSelectedRows([]);
        }
    }

    const CellCheck = ({ rowKeyValue, isSelectedRow }: ICellTextProps) => {
        // console.log(selectedRows)
        // const table = useTableInstance();
        return (
            <Checkbox
                checked={isSelectedRow}
                onCheckedChange={(checked) => {
                    let listIds: any = _.cloneDeep(selectedRows);
                    if (checked) {
                        listIds.push(rowKeyValue);
                    } else {
                        listIds = listIds.filter((item: any) => item !== rowKeyValue);
                    }
                    onChangeSelectedRows && onChangeSelectedRows(listIds);
                }}
                className="mr-2 ml-3 lg:mt-2"
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
            {/* <div className="flex justify-between mt-0 items-end">
                {totalRows && totalRows !== 0 ? <Label className="px-0 text-xs lg:text-sm sm: text-muted-foreground h-auto">Hiển thị {`${paging.pageSize} trên tổng số ${totalRows}`} dòng.</Label> : <span>{` `}</span>}
            </div> */}
            {roleId === 1 && (
                <>
                    <div className="hidden lg:flex justify-end mt-2">
                        {selectedRows && selectedRows.length > 0 ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={`outline`} className="text-foreground" onClick={() => {
                                            setOpen(true)
                                        }}>
                                            <Label className="pointer-events-none">Chỉ định nhân viên</Label>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Chỉ định nhân viên</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <span></span>
                        )}

                    </div>
                    <div className="w-full flex justify-between lg:hidden mt-0 space-x-3">
                        <div className="px-1 w-full h-auto flex justify-between items-center">
                            {selectedRows?.length === data.length ? (
                                <Button variant={`outline`} onClick={()=>onCheckAll(false)}>Bỏ chọn tất cả</Button>
                            ): (
                                <Button variant={`outline`} onClick={()=>onCheckAll(true)}>Chọn tất cả</Button>
                            )}
                            {selectedRows && selectedRows.length > 0 ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={onAssign}>Chỉ định</Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="z-[51]">
                                            <Label>Chỉ định nhân viên</Label>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                            ) : (
                                <div className="w-8 h-8"></div>
                            )}
                        </div>

                    </div>
                </>
            )}
            <div className="relative mt-0 rounded-md">
                <Table
                    columns={columns}
                    rowKeyField={"id"}
                    data={data}
                    loading={loading}
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
                                                                <HeaderCheck />
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
                        elementAttributes: ({ isSelectedRow, rowData }: any) => {
                            return {
                                className: cn(
                                    `cursor-pointer lg:min-h-[40px] group`,
                                    isSelectedRow ? `bg-transparent lg:bg-accent` : `lg:odd:bg-white lg:even:bg-black/5`,
                                ),
                                onClick: () => {
                                    let listIds: any = _.cloneDeep(selectedRows);
                                    if (!listIds.includes(rowData.id)) {
                                        console.log("add")
                                        listIds.push(rowData.id);
                                    } else {
                                        listIds = listIds.filter((item: any) => item !== rowData.id);
                                    }
                                    onChangeSelectedRows && onChangeSelectedRows(listIds);
                                }
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
                                                    <div className="grid grid-cols-1 gap-x-1">
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Tài khoản: &nbsp;</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{props.rowData.username}</Label>
                                                        </div>
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Họ và tên: &nbsp;</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{props.rowData.name}</Label>
                                                        </div>
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Quyền sử dụng: &nbsp;</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{props.rowData.roleName}</Label>
                                                        </div>
                                                    </div>
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
                    paging={paging}
                    selectedRows={selectedRows}
                    onChangeTablePage={onChangeTablePage}
                />
            </div>
            <AssignUser campaignId={campaignId} open={open} onClose={() => setOpen(false)} onRefresh={onRefresh} />
        </>
    )
}