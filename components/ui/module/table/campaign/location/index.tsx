"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Table from "@/components/ui/module/table";
import { cn } from "@/lib/utils";
import { Trash2, MoreVertical } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { useToast } from "@/components/ui/use-toast";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import jwtDecode from "jwt-decode";
import { ICellTextProps } from 'ka-table/props';
import { ToastAction } from "@/components/ui/toast"
import {
    NEXT_PUBLIC__DEL_LOCATION_ASSIGN_CAMPAIGN_API,
    NEXT_PUBLIC_DOWNLOAD_TEMPLATE_LOCATION,
    NEXT_PUBLIC_DOWNLOAD_TEMPLATE_PROVINCES_DISTRICTS,
    NEXT_PUBLIC_DOWNLOAD_LOCATION
} from "@/config/api";
import { PagingOptions } from 'ka-table/models';
import _ from "lodash";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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
import { numberWithCommas } from "@/lib/function"


const columns = [
    {
        key: "0",
        field: "",
        title: "",
        width: 40,
        roles: [1]
    },
    {
        key: "1",
        field: "code",
        title: "Mã CH",
        width: 100,
        roles: [1, 2, 3]
    },
    {
        key: "2",
        field: "locationName",
        title: "Địa điểm",
        width: 300,
        roles: [1, 2, 3]
    },
    {
        key: "3",
        field: "total",
        title: "Số lượng POSM",
        width: 150,
        roles: [1, 2, 3]
    },
    {
        key: "11",
        field: "totalNow",
        title: "Số lượng thực tế",
        width: 150,
        roles: [1, 2, 3]
    },
    {
        key: "4",
        field: "totalTransaction",
        title: "Số lượng đã lắp đặt",
        width: 150,
        roles: [1, 2, 3]
    },
    {
        key: "5",
        field: "totalTicket",
        title: "Số lượng sự cố",
        width: 150,
        roles: [1, 2, 3]
    },
    {
        key: "6",
        field: "channelName",
        title: "Kênh",
        width: 200,
        roles: [1, 2, 3]
    },
    {
        key: "7",
        field: "areaName",
        title: "Vùng",
        width: 200,
        roles: [1, 2, 3]
    },
    {
        key: "8",
        field: "province",
        title: "Tỉnh / Thành phố",
        width: 250,
        roles: [1, 2, 3]
    },
    {
        key: "9",
        field: "district",
        title: "Quận / Huyện",
        width: 250,
        roles: [1, 2, 3]
    },
    {
        key: "10",
        field: "address",
        title: "Địa chỉ",
        width: 300,
        roles: [1, 2, 3]
    },
    // {
    //     key: "8",
    //     field: "action",
    //     title: "",
    //     width: 80
    // }
]

import Link from "next/link";

const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableCampaignLocationProps = {
    campaignId: string,
    loading: boolean,
    data: any | [],
    paging: PagingOptions,
    selectedRows?: number[] | undefined,
    totalRows: number | null,
    onChangeTablePage: (pageIndex: number, pageSize: number) => void,
    onChangeSelectedRows?: (selectedRows: number[] | undefined) => void,
    onRefresh: () => void,
}


export default function TableLocation({ campaignId, data, paging, loading, totalRows, onChangeTablePage, onChangeSelectedRows, onRefresh, selectedRows }: TableCampaignLocationProps) {
    const { toast } = useToast();
    const { access_token } = useAppSelector((state: any) => state.auth);
    const [id, setId] = useState<number>(0);
    const [openDelMultiple, setOpenDelMultiple] = useState(false);
    const [openImport, setOpenImport] = useState(false);
    const [roleId, setRoleId] = useState<number>(0);
    const [listRoleColumns, setListRoleColumns] = useState<any>([]);

    useEffect(() => {
        const token = localStorage.getItem(token_storage) ? localStorage.getItem(token_storage) : access_token;
        // console.log(token)
        if (token) {
            const decoded: any = jwtDecode(token);
            const info: any = decoded.data;

            const roleId = info.roleId;

            setRoleId(roleId);

            let listColumns = _.filter(columns, (col: any) => {
                return col.roles.includes(roleId);
            })

            setListRoleColumns(listColumns);
        }
        console.log(data)
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
                className="mr-2 ml-3 mt-2"
            />
        )
    }

    const onDownloadTemplateLocation = (e: any) => {
        e.preventDefault();

        axiosWithHeaders("get", NEXT_PUBLIC_DOWNLOAD_TEMPLATE_LOCATION, null)
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    // console.log(response)
                    const {
                        status,
                        result,
                        message
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        var element = document.createElement("a");
                        element.href = result;
                        element.setAttribute("download", "TemplateLocation");
                        element.style.display = 'none';
                        document.body.appendChild(element);

                        element.click();

                        document.body.removeChild(element);
                        toast({
                            title: "Thông báo.",
                            description: "Tải tệp thành công!.",
                            action: <ToastAction altText="OK">Xác nhận</ToastAction>,
                        })
                        // link.click();
                    } else {
                        console.log(message);
                    }
                }
            })
            .catch((error: any) => {
                console.log(error);
            })
        // alert("Đang cập nhật")
    }

    const onDownloadTemplateProvinces = (e: any) => {
        e.preventDefault();
        axiosWithHeaders("get", NEXT_PUBLIC_DOWNLOAD_TEMPLATE_PROVINCES_DISTRICTS, null)
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    // console.log(response)
                    const {
                        status,
                        result,
                        message
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        var element = document.createElement("a");
                        element.href = result;
                        element.setAttribute("download", "TemplateProvinceDistrict");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                        toast({
                            title: "Thông báo.",
                            description: "Tải tệp thành công!.",
                            action: <ToastAction altText="OK">Xác nhận</ToastAction>,
                        })
                        // link.click();
                    } else {
                        console.log(message);
                    }
                }
            })
            .catch((error: any) => {
                console.log(error);
            })
    }

    const onDownloadLocation = (e: any) => {
        e.preventDefault();
        axiosWithHeaders("get", NEXT_PUBLIC_DOWNLOAD_LOCATION, null)
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    // console.log(response)
                    const {
                        status,
                        result,
                        message
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        var element = document.createElement("a");
                        element.href = result;
                        element.setAttribute("download", "Location");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                        toast({
                            title: "Thông báo.",
                            description: "Tải tệp thành công!.",
                            action: <ToastAction altText="OK">Xác nhận</ToastAction>,
                        })
                        // link.click();
                    } else {
                        console.log(message);
                    }
                }
            })
            .catch((error: any) => {
                console.log(error);
            })
    }

    const onDeleteMultiple = (ids: Number[] | any) => {
        console.log(ids)
        setId(ids)
        setOpenDelMultiple(true);
    }

    // const DelLocation = (selectedRows: any) => {

    // }

    const onImport = (e: any) => {
        e.preventDefault();
        setOpenImport(true);
    }

    // const onDownloadTemplate = (e: any) => {
    //     e.preventDefault();
    //     // setOpenTemplate(true);
    // }

    const onDeleteMultipleLocation = () => {
        axiosWithHeaders("post", NEXT_PUBLIC__DEL_LOCATION_ASSIGN_CAMPAIGN_API, {
            "campaignId": parseInt(campaignId),
            "listLocation": id
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
                            description: "xóa thành công !",
                        })
                        onRefresh();
                        onChangeSelectedRows && onChangeSelectedRows([])
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
                                    onClick={() => onDeleteMultiple(selectedRows)}
                                    variant={`destructive`}>
                                    <Trash2 className="pointer-events-none mr-2" />
                                    <Label className="pointer-events-none">Xóa</Label>
                                </Button>
                            </div>
                        ) : (
                            <span></span>
                        )}
                        <div className="space-x-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="secondary" size={`icon`}>
                                        <MoreVertical />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 lg:mr-4 px-5 p-0">
                                    <div className="h-10 px-8 flex items-center cursor-pointer hover:bg-muted" onClick={onImport}>
                                        <Label>Import</Label>
                                    </div>
                                    <div className="h-10 px-8 flex items-center cursor-pointer hover:bg-muted" onClick={onDownloadTemplateLocation}>
                                        <Label>Mẫu danh sách cửa hàng</Label>
                                    </div>
                                    <div className="h-10 px-8 flex items-center cursor-pointer hover:bg-muted" onClick={onDownloadTemplateProvinces}>
                                        <Label>Mẫu Tỉnh thành/Quận huyện</Label>
                                    </div>
                                    <div className="h-10 px-8 flex items-center cursor-pointer hover:bg-muted" onClick={onDownloadLocation}>
                                        <Label>Tải danh sách cửa hàng</Label>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="w-full flex justify-between lg:hidden mt-2 space-x-3">
                        <div className="space-x-1.5">
                            <div className="px-2 h-auto flex justify-start items-center space-x-1">
                                <HeaderCheck />
                                {selectedRows && selectedRows.length > 0 ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => onDeleteMultiple(selectedRows)}
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
                        <div className="space-x-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size={`icon`} className="text-foreground w-8 h-8">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 mr-2 px-5 p-0">
                                    <div className="h-10 px-8 flex items-center cursor-pointer hover:bg-muted" onClick={onImport}>
                                        <Label>Import</Label>
                                    </div>
                                    <div className="h-10 px-8 flex items-center cursor-pointer hover:bg-muted" onClick={onDownloadTemplateLocation}>
                                        <Label>Mẫu danh sách cửa hàng</Label>
                                    </div>
                                    <div className="h-10 px-8 flex items-center cursor-pointer hover:bg-muted" onClick={onDownloadTemplateProvinces}>
                                        <Label>Mẫu Tỉnh thành/Quận huyện</Label>
                                    </div>
                                    <div className="h-10 px-8 flex items-center cursor-pointer hover:bg-muted" onClick={onDownloadLocation}>
                                        <Label>Tải danh sách cửa hàng</Label>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </>
            )}

            <div className="relative mt-2">
                <Table
                    columns={listRoleColumns}
                    rowKeyField={"locationId"}
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
                                                    <div className="p-2 h-auto flex justify-center items-start py-2.5">
                                                        <CellCheck {...props} />
                                                    </div>
                                                )}
                                                <div className={
                                                    cn(
                                                        "relative z-0 py-0.5 pb-2  space-y-0.5 flex flex-col overflow-x-hidden",
                                                        roleId === 1 ? "w-[calc(100%-32px)] pr-1" : "w-full px-3",
                                                    )
                                                }>
                                                    <Link href={`/campaign/${campaignId}/location/${props.rowData.locationId}`} className="w-full block absolute z-50 top-0 left-0 h-full">&nbsp;</Link>
                                                    <div>
                                                        <p className="font-bold line-clamp-2 sm:text-lg">{` ` + props.rowData.locationName}</p>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-black/70 line-clamp-2 font-medium">
                                                        <span className="text-black/60 text-xs sm:text-sm font-normal">Địa chỉ:</span>{` ` + props.rowData.address}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-x-1">
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Số lượng POSM:</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{props.rowData.hasOwnProperty("total") && props.rowData.total ? ` ` + numberWithCommas(props.rowData.total) : ` ` + 0}</Label>
                                                        </div>
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Số lượng thực tế:</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{props.rowData.hasOwnProperty("totalNow") && props.rowData.totalNow ? ` ` + numberWithCommas(props.rowData.totalNow) : ` ` + 0}</Label>
                                                        </div>
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Số lượng đã lắp đặt:</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{props.rowData.hasOwnProperty("totalTransaction") && props.rowData.totalTransaction ? ` ` + numberWithCommas(props.rowData.totalTransaction) : ` ` + 0}</Label>
                                                        </div>
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Số lượng sự cố:</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{props.rowData.hasOwnProperty("totalTicket") && props.rowData.totalTicket ? ` ` + numberWithCommas(props.rowData.totalTicket) : ` ` + 0}</Label>
                                                        </div>
                                                    </div>
                                                    {props.rowData.contact && (
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Người liên hệ:</span><Label className="text-xs sm:text-sm">{` ` + props.rowData.contact}</Label>
                                                        </div>
                                                    )}

                                                    {props.rowData.phoneContact && (
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Liên hệ:</span><Label className="text-xs sm:text-sm">{` ` + props.rowData.phoneContact}</Label>
                                                        </div>
                                                    )}
                                                    {props.rowData.noteLocation && (
                                                        <div>
                                                            <span className="text-black/60 text-xs sm:text-sm">Ghi chú:</span><Label className="text-xs sm:text-sm">{` ` + props.rowData.noteLocation}</Label>
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
                                                        <Link href={`/campaign/${campaignId}/location/${props.rowData.locationId}`}>
                                                            <span className="w-full h-auto inline-block align-middle truncate px-2">
                                                                {(column.field === "total" || column.field === "totalNow" || column.field === "totalTransaction" || column.field === "totalTicket") ? props.rowData[column.field] ? numberWithCommas(props.rowData[column.field]) : 0 :
                                                                    props.rowData[column.field]}
                                                            </span>
                                                        </Link>
                                                    ) : (
                                                        <>
                                                            {roleId === 1 && (
                                                                <div className="hidden bg-transparent lg:group-hover:flex justify-end items-center absolute top-0 right-0 h-full px-3 z-30">
                                                                    {/*do something*/}
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
                    tableWrapper={{
                        elementAttributes: () => ({
                            className: "max-h-[calc(100vh-515px)] lg:max-h-[calc(100vh-380px)]"
                        }),
                    }}
                    paging={paging}
                    selectedRows={selectedRows}
                    onChangeTablePage={onChangeTablePage}
                />
            </div>

            {/* <AssignLocation campaignId={campaignId} open={open} onClose={() => setOpen(false)} onRefresh={onRefresh} /> */}
            {/* <AssignLocation campaignId={campaignId}/> */}
            <AlertDialog open={openDelMultiple} onOpenChange={setOpenDelMultiple}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có muốn xóa địa điểm đã chọn khỏi chiến dịch này không ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={onDeleteMultipleLocation}>Tiếp tục</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}