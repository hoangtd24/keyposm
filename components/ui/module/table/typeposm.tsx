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
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import jwtDecode from "jwt-decode";
import { IRowProps } from 'ka-table/props';
import { PagingOptions } from 'ka-table/models';
import { useTableInstance } from 'ka-table';
import {
    Create
} from "@/components/ui/module/typeposm";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { AreaItem } from "@/lib/store/slices/areaSlice";
import { NEXT_PUBLIC_DETAIL_AREA_API } from "@/config/api";

const columns = [
    {
        key: "1",
        field: "no",
        title: "STT",
        width: 60
    },
    {
        key: "2",
        field: "typeName",
        title: "Tên POSM",
    },
    {
        key: "3",
        field: "typeDescription",
        title: "Mô tả posm",
    },
    {
        key: "12",
        field: "action",
        title: "",
        width: 80
    },
]

const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableAreaProps = {
    loading: boolean,
    data: any | [],
    paging: PagingOptions,
    totalRows: number | null,
    onChangeTablePage: (pageIndex: number, pageSize: number) => void,
    onRefresh: () => void,
}

export default function TableArea({ data, paging, loading, totalRows, onChangeTablePage, onRefresh }: TableAreaProps) {
    const { access_token } = useAppSelector((state: any) => state.auth);
    const { toast } = useToast()
    // const dispatch = useAppDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [openDel, setOpenDel] = useState<boolean>(false);
    const [openRestore, setOpenRestore] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [detail, setDetail] = useState<AreaItem | null>(null);
    const [roleId, setRoleId] = useState<number>(0);

    // console.log(data, status)

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

    const getDetailArea = (id: number) => {
        axiosWithHeaders("post", NEXT_PUBLIC_DETAIL_AREA_API, { id })
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        result,
                        message
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        setDetail(result);
                        console.log(result);
                        setOpenUpdate(true);
                        // alert("Chức năng đang phát triển");
                    } else {
                        console.log(message);
                    }
                }
            })
            .catch((error: any) => {
                console.log(error);
            })
    }

    const handleDelete = (id: number) => {
        setId(id);
        // const campaignId = data.find((item: any) => item.id === id)?.campaignId;
        // if (campaignId) {
        //     const listCampaignArea = data.filter((item: any) => item.campaignId === campaignId);
        //     if (listCampaignArea.length === 1) {
        //         toast({
        //             variant: "destructive",
        //             title: "Cảnh báo.",
        //             description: "Chiến dịch này chỉ có một vùng. Không thể xóa vùng này",
        //             action: <ToastAction altText="Xác nhận">Xác nhận</ToastAction>,
        //         })
        //         return;
        //     } else {
        //         setOpenDel(true);
        //     }
        // }
        setOpenDel(true);
    }

    const handleRestore = (id: number) => {
        setId(id);
        setOpenRestore(true);
    }

    const CellCheck = ({ rowKeyValue, isSelectedRow }: any) => {
        const table = useTableInstance();
        return (
            <Checkbox
                className="lg:hidden"
                checked={isSelectedRow}
                onCheckedChange={(checked) => {
                    table.deselectAllRows();
                    if (checked) {
                        table.selectRow(rowKeyValue);
                        // console.log(table.selectedRows)
                    } else {
                        table.deselectRow(rowKeyValue);
                    }
                }}
            // className="mr-2 ml-4"
            />
        )
    }

    const HeaderTextSelected = () => {
        const table = useTableInstance();
        if (table) {
            let id: number = 0;
            if (table.props.selectedRows)
                id = table.props?.selectedRows[0];
            return (
                <div className="space-x-2 flex items-center">
                    {/* <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button disabled={table.props.selectedRows && table.props.selectedRows.length > 0 ? false : true} onClick={() => getDetailArea(id)} size={`icon`} variant={`secondary`} className="w-8 h-8">
                                    <Edit className="text-foreground w-5 h-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Label>Cập nhật</Label>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                   (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button disabled={table.props.selectedRows && table.props.selectedRows.length > 0 ? false : true} onClick={() => handleDelete(id)} size={`icon`} variant={`ghost`} className="w-8 h-8">
                                        <Trash2 className="text-foreground w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Xóa </Label>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) */}
                </div>
            )
        }
        return null;
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
                {totalRows && totalRows !== 0 ? <Label className="px-0 text-muted-foreground h-auto">Hiển thị {`${paging.pageSize} trên tổng số ${totalRows}`} dòng.</Label> : <span>{` `}</span>}
                <div className="hidden lg:block">
                    {roleId === 1 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={`outline`} className="text-foreground" onClick={() => {
                                        setOpen(true)
                                    }}>
                                        <Plus className="pointer-events-none mr-2" />
                                        <Label className="pointer-events-none">Thêm </Label>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Thêm</Label>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    )}
                </div>
            </div>
            <div className="relative mt-3">
                <Table
                    columns={columns}
                    rowKeyField={"id"}
                    data={data}
                    loading={loading}
                    headRow={{
                        content: (props: any) => {
                            return (
                                <>
                                    <th colSpan={props.columns.length} className="lg:hidden ka-thead-cell ka-thead-cell-height ka-thead-fixed bg-background z-40" style={{ padding: `0px`, height: 40 }}>
                                        <div className="ka-thead-cell-wrapper">
                                            <div className="ka-thead-cell-content-wrapper">
                                                <div className={
                                                    cn(
                                                        //default
                                                        "ka-thead-cell-content flex items-center justify-between text-background",
                                                        //custom
                                                        "px-2",
                                                    )
                                                }>

                                                    {roleId === 1 && (
                                                        <>
                                                            <HeaderTextSelected {...props} />
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
                                                                        <Label>Thêm</Label>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </th>
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
                        elementAttributes: ({ isSelectedRow }: IRowProps) => {
                            return {
                                className: cn(
                                    ` cursor-pointer lg:min-h-[40px] group`,
                                    isSelectedRow ? `bg-accent` : `odd:bg-white even:bg-black/5`,
                                ),
                            }
                        },
                        content: (props: any) => {
                            // console.log(props.rowData)
                            return (
                                <>
                                    <td colSpan={props.columns.length} className="lg:hidden w-full flex-1 relative">
                                        <div className="w-full flex-col flex relative py-1">
                                            <div className="w-full h-full flex relative">
                                                <div className={
                                                    cn(
                                                        "w-12 h-auto flex justify-center items-start pt-2"
                                                    )
                                                }>
                                                    <CellCheck {...props} />
                                                    <span className="hidden lg:block">{props.rowData.no}</span>
                                                </div>
                                                <div className={
                                                    cn(
                                                        "relative py-1 w-[calc(100%-48px)]"
                                                    )
                                                }>

                                                    <div className="grid grid-cols-12 h-full w-full gap-x-2 space-y-0.5">
                                                        <div className="col-span-7 relative truncate">
                                                            <span className="">
                                                                Tên POSM: <Label className="text-sm truncate">{props.rowData.typeName}</Label>
                                                            </span>
                                                        </div>
                                                        <div className="col-span-5 relative truncate">
                                                            <span className="pr-3">Ngày tạo: <Label>{props.rowData.datecreate}</Label></span>
                                                        </div>
                                                        <div className="col-span-12 relative truncate">
                                                            <span className="flex items-center">
                                                                Mô tả: &nbsp;
                                                                <p className="text-sm text-muted-foreground font-normal truncate">{props.rowData.typeDescription}</p>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                                        {/* {roleId === 1 && (
                                                            <div className="hidden bg-transparent lg:group-hover:flex justify-end items-center absolute top-0 right-0 h-full px-3 z-20">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button onClick={() => getDetailArea(props.rowData.id)} size={`icon`} variant={`outline`} className="mr-1 w-8 h-8 bg-transparent">
                                                                                <Edit className="w-6 h-6" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <Label>Cập nhật</Label>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>


                                                            (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button onClick={() => handleDelete(props.rowData.id)} size={`icon`} variant={`ghost`} className="w-8 h-8 bg-transparent">
                                                                                    <Trash2 className="w-5 h-5" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <Label>Xóa</Label>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                )
                                                            </div>
                                                        )} */}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </>
                            )
                        }
                    }}
                    paging={paging}
                    onChangeTablePage={onChangeTablePage}
                />
            </div>
             <Create
                open={open}
                onClose={() => setOpen(!open)}
                onRefresh={onRefresh}
            />

            {/* <UpdateArea
                open={openUpdate}
                detail={detail}
                onClose={() => {
                    setOpenUpdate(!openUpdate);
                    setDetail(null);
                }}
                onRefresh={onRefresh}
            />

            <RestoreArea
                id={id}
                open={openRestore}
                onClose={() => {
                    setOpenRestore(!openRestore);
                    setId(0);
                }}
                onRefresh={onRefresh}
            />
            <DeleteArea
                id={id}
                open={openDel}
                onClose={() => {
                    setOpenDel(!openDel);
                    setId(0);
                }}
                onRefresh={onRefresh}
            />  */}
        </>
    )
}