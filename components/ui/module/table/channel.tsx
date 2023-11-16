"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Table from "@/components/ui/module/table";
import { cn } from "@/lib/utils";
import { Trash2, Edit, RotateCcw, Plus } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import jwtDecode from "jwt-decode";
import { PagingOptions } from 'ka-table/models';
import {
    CreateChannel,
    UpdateChannel,
    RestoreChannel,
    DeleteChannel
} from "@/components/ui/module/channel";
import { ChannelItem } from "@/lib/store/slices/channelSlice";
import { Card, CardContent } from "@/components/ui/card";

const columns = [
    {
        key: "1",
        field: "no",
        title: "STT",
        width: 60
    },
    {
        key: "2",
        field: "channelName",
        title: "Kênh",
    },
    {
        key: "3",
        field: "channelDescription",
        title: "Mô tả kênh",
    },
    {
        key: "4",
        field: "brandName",
        title: "Thương hiệu",
    },
    {
        key: "8",
        field: "datecreate",
        title: "Ngày tạo",
    },
    {
        key: "9",
        field: "action",
        title: "",
        width: 80
    }
]

const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableChannelProps = {
    loading: boolean,
    status: boolean,
    data: any | [],
    selectedRows?: number[] | undefined,
    paging: PagingOptions,
    totalRows: number | null,
    onChangeTablePage: (pageIndex: number, pageSize: number) => void,
    onChangeSelectedRows?: (selectedRows: number[] | undefined) => void,
    onRefresh: () => void,
}

export default function TableArea({ data, paging, status, loading, totalRows, selectedRows, onChangeTablePage, onChangeSelectedRows, onRefresh }: TableChannelProps) {
    const { access_token } = useAppSelector((state: any) => state.auth);
    const [open, setOpen] = useState<boolean>(false);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [openDel, setOpenDel] = useState<boolean>(false);
    const [openRestore, setOpenRestore] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [detail, setDetail] = useState<ChannelItem | null>(null);
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

    const getDetailChannel = (id: number) => {
        const item = data.find((item: any) => item.id === id);
        setDetail(item);
        setOpenUpdate(true);
    }

    const handleDelete = (id: number) => {
        setId(id);
        setOpenDel(true);
    }

    const handleRestore = (id: number) => {
        setId(id);
        setOpenRestore(true);
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
                                        <Plus className="pointer-events-none mr-2" />
                                        <Label className="pointer-events-none">Thêm kênh</Label>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Thêm kênh</Label>
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
                                            onClick={() => selectedRows ? getDetailChannel(selectedRows[0]) : null}
                                            size={`icon`}
                                            variant={`secondary`}
                                            className="h-8 w-8"
                                        >
                                            <Edit className="text-foreground w-5 h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Cập nhật kênh</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {!status ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={() => selectedRows ? handleRestore(selectedRows[0]) : null}
                                                size={`icon`}
                                                variant={`ghost`}
                                                className="w-8 h-8"
                                                disabled={(selectedRows && selectedRows.length > 0 ? false : true)}
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <Label>Đổi trạng thái</Label>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={() => selectedRows ? handleDelete(selectedRows[0]) : null}
                                                size={`icon`}
                                                variant={`destructive`}
                                                className="h-8 w-8"
                                                disabled={(selectedRows && selectedRows.length > 0 ? false : true)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <Label>Xóa kênh</Label>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
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
                                    <Label>Thêm kênh</Label>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </>
            )}
            <div className="relative mt-1 lg:mt-2">
                <Table
                    columns={columns}
                    rowKeyField={"id"}
                    data={data}
                    loading={loading}
                    headRow={{
                        content: (props: any) => {
                            return (
                                <>
                                    {props.columns.map((column: any) => (
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
                                    ))}
                                </>
                            )
                        }
                    }}
                    dataRow={{
                        elementAttributes: () => ({
                            className: `lg:odd:bg-white lg:even:bg-black/5 cursor-pointer min-h-[40px] group`,
                        }),
                        content: (props: any) => {
                            // console.log(props.rowData)
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
                                                    <div className="w-full relative flex">
                                                        <div className="w-[calc(100%-70px)]">
                                                            <div>
                                                                <span className="text-sm text-black/60">Kênh:</span><Label>{` ` + props.rowData.channelName}</Label>
                                                            </div>
                                                        </div>
                                                        <div className="w-[70px]">
                                                            <Label className="text-xs">{props.rowData.datecreate}</Label>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-black/50 font-medium line-clamp-2">Mô tả: {props.rowData.channelDescription}</div>
                                                    <div>
                                                        <span className="text-sm text-black/60">Thương hiệu:</span><Label>{` ` + props.rowData.brandName}</Label>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </td>
                                    {props.columns.map((column: any) => (
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
                                                            <div className="hidden bg-transparent lg:group-hover:flex justify-end items-center absolute top-0 right-0 h-full px-3 z-20">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button onClick={() => getDetailChannel(props.rowData.id)} size={`icon`} variant={`outline`} className="mr-1 w-8 h-8 bg-transparent">
                                                                                <Edit className="w-6 h-6" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <Label>Cập nhật kênh</Label>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                {!status ? (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button onClick={() => handleRestore(props.rowData.id)} size={`icon`} variant={`ghost`} className="w-8 h-8 bg-transparent">
                                                                                    <RotateCcw className="w-5 h-5" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <Label>Đổi trạng thái</Label>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                ) : (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button onClick={() => handleDelete(props.rowData.id)} size={`icon`} variant={`ghost`} className="w-8 h-8 bg-transparent">
                                                                                    <Trash2 className="w-5 h-5" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <Label>Xóa kênh</Label>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </>
                            )
                        }
                    }}
                    tableWrapper={{
                        elementAttributes: () => ({
                            className: "max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-400px)]"
                        }),
                    }}
                    selectedRows={selectedRows}
                    paging={paging}
                    onChangeTablePage={onChangeTablePage}
                />
            </div>

            <CreateChannel
                open={open}
                onClose={() => {
                    setOpen(!open);
                }}
                onRefresh={onRefresh}
            />

            <UpdateChannel
                detail={detail}
                open={openUpdate}
                onClose={() => {
                    setOpenUpdate(!openUpdate);
                    setDetail(null);
                }}
                onRefresh={onRefresh}
            />

            <RestoreChannel
                id={id}
                open={openRestore}
                onClose={() => {
                    setOpenRestore(!openRestore);
                    setId(0);
                }}
                onRefresh={onRefresh}
            />
            <DeleteChannel
                id={id}
                open={openDel}
                onClose={() => {
                    setOpenDel(!openDel);
                    setId(0);
                }}
                onRefresh={onRefresh}
            />
        </>
    )
}