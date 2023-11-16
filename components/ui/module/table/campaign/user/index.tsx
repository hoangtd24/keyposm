"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Table from "@/components/ui/module/table";
import { cn } from "@/lib/utils";
import { Trash2, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import jwtDecode from "jwt-decode";
import { ICellTextProps } from 'ka-table/props';
import {
    NEXT_PUBLIC_DEL_USER_CAMPAIGN_API,
} from "@/config/api";
import moment from "moment";
import AssignUser from "@/components/ui/module/user/campaign/assign";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { PagingOptions } from 'ka-table/models';
import _ from "lodash";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
        title: "Họ và tên",
        // width: 200
    },
    {
        key: "3",
        field: "username",
        title: "Tài khoản",
    },
    {
        key: "4",
        field: "roleName",
        title: "Quyền",
    }
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
}

export default function TableData({ campaignId, data, paging, loading, totalRows, onChangeTablePage, onRefresh, selectedRows, onChangeSelectedRows }: TableCampaignUserProps) {
    const { toast } = useToast();
    const { access_token } = useAppSelector((state: any) => state.auth);
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [roleId, setRoleId] = useState<number>(0);


    useEffect(() => {
        const token = localStorage.getItem(token_storage) ? localStorage.getItem(token_storage) : access_token;
        if (token) {
            const decoded: any = jwtDecode(token);
            const info: any = decoded.data;

            const roleId = info.roleId;

            setRoleId(roleId);
            console.log(roleId)
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
                            listIds.push(item.locationId);
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

    const onDeleteMultipleUser = () => {
        axiosWithHeaders("post", NEXT_PUBLIC_DEL_USER_CAMPAIGN_API, {
            "campaignId": parseInt(campaignId),
            "listUsers": selectedRows
        })
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Xóa thành công !",
                        })
                        onRefresh();
                        onChangeSelectedRows && onChangeSelectedRows([]);
                    } else {
                        toast({
                            title: "Lỗi",
                            description: message,
                        })
                    }
                }
            })
            .catch((error: any) => {
                console.log(error);
            })
    }

    const onDeleteMultiple = () => {
        setOpenDel(true);
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
                                <Button
                                    onClick={() => onDeleteMultiple()}
                                    variant={`destructive`}>
                                    <Trash2 className="pointer-events-none mr-2" />
                                    <Label>Xóa nhân viên đã chọn</Label>
                                </Button>
                            </div>
                        ) : (
                            <span></span>
                        )}
                        <div className="space-x-2">
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
                        </div>
                    </div>
                    <div className="w-full flex justify-between lg:hidden mt-2 space-x-3">
                        <div className="px-2 h-auto flex justify-between items-center space-x-1">
                            <div className="space-x-1.5 flex items-center">
                                <HeaderCheck />
                                {selectedRows && selectedRows.length > 0 ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => onDeleteMultiple()}
                                                    variant={`destructive`}
                                                    size={`icon`}
                                                    className="w-8 h-8"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="z-[51]">
                                                <Label>Xóa nhiều địa điểm</Label>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                ) : (
                                    <div className="w-8 h-8"></div>
                                )}
                            </div>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size={`icon`} variant={`outline`} className="text-foreground w-8 h-8" onClick={() => {
                                        setOpen(true)
                                    }}>
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="z-[51]">
                                    <Label>Chỉ định nhân viên</Label>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </>
            )}
            <div className="relative mt-2">
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
            <AlertDialog open={openDel} onOpenChange={setOpenDel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có muốn xóa nhân viên đã chọn khỏi chiến dịch này không ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={onDeleteMultipleUser}>Tiếp tục</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}