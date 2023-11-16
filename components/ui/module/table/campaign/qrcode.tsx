"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Table from "@/components/ui/module/table";
import { cn } from "@/lib/utils";
import { Edit, ArrowDownToLine } from 'lucide-react';

import { useToast } from "@/components/ui/use-toast";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import jwtDecode from "jwt-decode";

import moment from "moment";
// import { setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import Download from "@/components/ui/module/qrcode/download";
import { IMAGE_URI } from "@/config";
import Image from "next/image";
import { PagingOptions } from 'ka-table/models';
import {
    NEXT_PUBLIC_API_DETAIL_BRAND
} from "@/config/api";
import { IRowProps } from 'ka-table/props';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card";
import UpdateNoteQr from "@/components/ui/module/user/campaign/updateqr";

const columns = [
    {
        key: "1",
        field: "no",
        title: "STT",
        width: 40
    },
    {
        key: "2",
        field: "channelName",
        title: "Kênh",
        width: 200
    },
    {
        key: "3",
        field: "areaName",
        title: "Vùng",
        width: 200
    },
    {
        key: "4",
        field: "thumbnail",
        title: "Hình thumbnail QR",
        width: 150
    },
    {
        key: "5",
        field: "note",
        title: "Ghi chú",
        // width: 200
    },
    {
        key: "6",
        field: "action",
        title: "",
        width: 40
    }
]

const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableQRProps = {
    loading: boolean,
    data: any | [],
    paging: PagingOptions,
    totalRows: number | null,
    campaignId: string,
    selectedRows?: number[] | undefined,
    onChangeSelectedRows?: (selectedRows: number[] | undefined) => void,
    onChangeTablePage: (pageIndex: number, pageSize: number) => void,
    onRefresh: () => void,
}

export default function TableQR({ campaignId, data, paging, loading, totalRows, selectedRows, onChangeSelectedRows, onChangeTablePage, onRefresh }: TableQRProps) {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { access_token } = useAppSelector((state: any) => state.auth);
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [openUpdateNote, setOpenUpdateNote] = useState(false);

    const [id, setId] = useState<number>(0);
    const [posmId, setPosmId] = useState<string>("0");

    const [roleId, setRoleId] = useState<number>(0);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>("");

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

    const handleDelete = (id: number) => {
        setId(id);
        setOpenDel(true);
    }

    const handleUpdateNote = (posmId: string) => {
        setOpenUpdateNote(true);
        setPosmId(posmId);
    }

    const showImage = (image: string) => {
        setOpenDialog(true);
        setSelectedImage(image);
    }

    const CellCheck = ({ rowKeyValue, isSelectedRow }: any) => {
        return (
            <Checkbox
                className="lg:hidden"
                checked={isSelectedRow}
                onCheckedChange={(checked) => {
                    onChangeSelectedRows && onChangeSelectedRows([]);
                    if (checked) {
                        onChangeSelectedRows && onChangeSelectedRows([rowKeyValue]);
                    } else {
                        onChangeSelectedRows && onChangeSelectedRows([]);
                    }
                }}
            />
        )
    }

    // const DelUser = (selectedRows: any) => {
    //     axiosWithHeaders("post", NEXT_PUBLIC_DEL_USER_CAMPAIGN_API, {
    //         "campaignId": parseInt(campaignId),
    //         "listUsers": selectedRows
    //     })
    //         .then((response: any) => {
    //             if (response && response.status === enums.STATUS_RESPONSE_OK) {
    //                 const {
    //                     status,
    //                     message
    //                 } = response.data;
    //                 if (status === enums.STATUS_RESPONSE_OK) {
    //                     toast({
    //                         title: "Thông báo",
    //                         description: "xóa thành công !",
    //                     })
    //                     onRefresh();
    //                     // dispatch(setTableTimeStamp(moment().valueOf()));
    //                 } else {
    //                     toast({
    //                         title: "Lỗi",
    //                         description: message,
    //                     })
    //                 }
    //             }
    //         })
    //         .catch((error: any) => {
    //             console.log(error);
    //         })
    // }

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
                    <div className="hidden lg:flex justify-end">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={`outline`} className="text-foreground" onClick={() => {
                                        setOpen(true)
                                    }}>
                                        <ArrowDownToLine className="pointer-events-none mr-2" />
                                        <Label className="pointer-events-none">Tải mã QR</Label>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Thêm thương hiệu</Label>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="w-full flex justify-between lg:hidden mt-2 space-x-3">
                        <div className="space-x-1.5">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={(selectedRows && selectedRows.length > 0 ? false : true)}
                                            onClick={() => selectedRows ? handleUpdateNote(selectedRows[0].toString()) : null}
                                            size={`icon`}
                                            variant={`secondary`}
                                            className="h-8 w-8"
                                        >
                                            <Edit className="text-foreground w-5 h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Cập nhật ghi chú</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {/* <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={(selectedRows && selectedRows.length > 0 ? false : true)}
                                            onClick={() => selectedRows ? handleDelete(selectedRows[0]) : null}
                                            size={`icon`}
                                            variant={`destructive`}
                                            className="h-8 w-8"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Xóa thương hiệu</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider> */}
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={`outline`} className="h-8 px-2" onClick={() => {
                                        setOpen(true)
                                    }}>
                                        <ArrowDownToLine className="w-4 h-4 pointer-events-none mr-2" />
                                        <Label className="pointer-events-none">Tải mã QR</Label>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Tải mã QR</Label>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </>
            )}

            <div className="relative mt-3 rounded-md">

                <Table
                    columns={columns}
                    rowKeyField={"posmId"}
                    data={data}
                    loading={loading}
                    dataRow={{
                        elementAttributes: ({ isSelectedRow }: any) => {
                            return {
                                className: cn(
                                    `cursor-pointer min-h-[40px] group`,
                                    isSelectedRow ? `lg:bg-accent` : `lg:odd:bg-white lg:even:bg-black/5`,
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
                                                    <div className="w-20 h-20">
                                                        <picture >
                                                            <img
                                                                onClick={() => showImage(props.rowData.thumnail)}
                                                                src={`${IMAGE_URI}/${props.rowData.thumnail}`}
                                                                className="w-20 h-20 aspect-square"
                                                                data-te-img={`${IMAGE_URI}/${props.rowData.thumnail}`}
                                                                alt="Hình qr"
                                                            // className="w-full cursor-zoom-in data-[te-lightbox-disabled]:cursor-auto" 
                                                            />
                                                        </picture>
                                                    </div>
                                                    <div className="w-[calc(100%-80px)]">
                                                        <div className="text-sm text-black/50 font-medium line-clamp-2">Vùng: <Label className="text-foreground">{props.rowData.areaName}</Label></div>
                                                        <div className="text-sm text-black/50 font-medium line-clamp-2">Kênh: <Label className="text-foreground">{props.rowData.channelName}</Label></div>
                                                        <div className="text-sm text-black/50 font-medium line-clamp-2">Ghi chú: <Label className="text-foreground">{props.rowData.note}</Label></div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        {/* <div className="w-full flex-col flex relative group-hover:shadow-md py-1">
                                            <div className="w-full h-full flex relative">

                                                <div className={
                                                    cn(
                                                        "relative py-1 w-full"
                                                    )
                                                }>

                                                    <div className="grid grid-cols-12 h-full w-full gap-x-2 space-y-1">
                                                        <div className="col-span-12 justify-center h-full flex items-center">
                                                            <picture >
                                                                <img
                                                                    onClick={() => showImage(props.rowData.thumnail)}
                                                                    src={`${IMAGE_URI}/${props.rowData.thumnail}`}
                                                                    data-te-img={`${IMAGE_URI}/${props.rowData.thumnail}`}
                                                                    alt="Table Full of Spices"

                                                                    className="w-full max-w-[100px] aspect-square" />
                                                            </picture>
                                                        </div>
                                                        <div className="col-span-12 justify-center h-full flex items-center">
                                                            <p className="text-sm text-muted-foreground font-normal truncate">Vùng: <Label className="text-foreground">{props.rowData.areaName}</Label></p>
                                                        </div>
                                                        <div className="col-span-12 justify-center h-full flex items-center">
                                                            <p className="text-sm text-muted-foreground font-normal truncate">Kênh: <Label className="text-foreground">{props.rowData.channelName}</Label></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </td>
                                    {props.columns.map((column: any) => {
                                        // if (column.key === "0") {
                                        //     return (
                                        //         <td className="ka-cell hidden lg:table-cell" key={column.key} style={{ height: 40, padding: 0 }}>
                                        //             <div className={
                                        //                 cn(
                                        //                     "ka-cell-text truncate relative h-full",
                                        //                 )
                                        //             }>
                                        //                 <CellCheck {...props} />
                                        //             </div>
                                        //         </td>
                                        //     )
                                        // }

                                        if (column.key === "4") {
                                            return (
                                                <td className="ka-cell hidden lg:table-cell" key={column.key} style={{ height: 40, padding: 0 }}>
                                                    <div className={
                                                        cn(
                                                            "ka-cell-text truncate relative h-full",
                                                        )
                                                    }>
                                                        <div
                                                            data-te-lightbox-init
                                                            className="flex flex-col space-y-5 lg:flex-row lg:space-x-5 lg:space-y-0">
                                                            <div>
                                                                <picture >
                                                                    <img
                                                                        onClick={() => showImage(props.rowData.thumnail)}
                                                                        src={`${IMAGE_URI}/${props.rowData.thumnail}`}
                                                                        className="max-w-[100px] aspect-square"
                                                                        data-te-img={`${IMAGE_URI}/${props.rowData.thumnail}`}
                                                                        alt="Hình qr"
                                                                    />
                                                                </picture>
                                                            </div>
                                                        </div>
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
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    onClick={() => handleUpdateNote(props.rowData.posmId.toString())}
                                                                                    size={`icon`}
                                                                                    variant={`secondary`}
                                                                                    className="h-8 w-8"
                                                                                >
                                                                                    <Edit className="text-foreground w-5 h-5" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <Label>Cập nhật ghi chú</Label>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
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
                    tableWrapper={{
                        elementAttributes: () => ({
                            className: "max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-400px)]"
                        }),
                    }}
                    selectedRows={selectedRows}
                    onChangeTablePage={onChangeTablePage}
                />
            </div>
            <Download campaignId={parseInt(campaignId)} open={open} onClose={() => setOpen(false)} />
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[425px] py-5">
                    <DialogHeader>
                        <DialogTitle>Hình QR</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center">
                        <picture>
                            <img
                                src={`${IMAGE_URI}/${selectedImage}`}
                                alt="Hình qr"
                                className="h-44 w-44"
                            />
                        </picture>
                    </div>
                </DialogContent>
            </Dialog>
            <UpdateNoteQr
                open={openUpdateNote}
                onClose={() => setOpenUpdateNote(false)}
                posmId={posmId}
                onRefresh={onRefresh}
            />
        </>
    )
}