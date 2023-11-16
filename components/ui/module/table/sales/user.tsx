"use client";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Table from "@/components/ui/module/table";;
import { cn } from "@/lib/utils";
import { Trash2, Edit, Plus } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import jwtDecode from "jwt-decode";
import { ICellTextProps } from 'ka-table/props';
import { NEXT_PUBLIC_DETAIL_CAMPAIGN_API } from "@/config/api";
import { setTempAreaData } from "@/lib/store/slices/areaSlice";
import { setTempChannelData } from "@/lib/store/slices/channelSlice";
import { setTempPosmData } from "@/lib/store/slices/typeDefaultSlice";
import {
    CreateCampaign,
    UpdateCampaign,
    DeleteCampaign
} from "@/components/ui/module/campaign";
import { DetailCampaignProps } from "@/components/ui/module/campaign/update";
import { PagingOptions } from 'ka-table/models';

import Link from "next/link";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import _ from "lodash"
import { useRouter } from "next/router";

const columns = [
    {
        key: "1",
        field: "no",
        title: "STT",
        width: 50
    },
    {
        key: "2",
        field: "campaignName",
        title: "Tên chiến dịch",
        // width: 200
    },
    {
        key: "3",
        field: "campaignDescription",
        title: "Mô tả chiến dịch",
        // width: 300
    },
    {
        key: "4",
        field: "brandName",
        title: "Thương hiệu",
        // width: 100
    },
    {
        key: "5",
        field: "datecreate",
        title: "Thời gian tạo",
        // width: 150
    },
    {
        key: "8",
        field: "action",
        title: "",
        width: 80
    }
]

const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableCampaignProps = {
    loading: boolean,
    data: any | [],
    paging: PagingOptions,
    totalRows: number | null,
    selectedRows?: number[] | undefined,
    onChangeTablePage: (pageIndex: number, pageSize: number) => void,
    onChangeSelectedRows?: (selectedRows: number[] | undefined) => void,
    onRefresh: () => void,
}

export default function TableCampaign({ data, paging, loading, totalRows, selectedRows, onChangeSelectedRows, onChangeTablePage, onRefresh }: TableCampaignProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { access_token } = useAppSelector((state: any) => state.auth);
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<number>(0);
    const [detail, setDetail] = useState<DetailCampaignProps>();
    const [roleId, setRoleId] = useState<number>(0);


    useEffect(() => {
        const token = localStorage.getItem(token_storage) ? localStorage.getItem(token_storage) : access_token;
        // console.log(token)
        if (token) {
            const decoded: any = jwtDecode(token);
            const info: any = decoded.data;

            const roleId = info.roleId;

            setRoleId(roleId);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [access_token])

    const getDetailCampaign = (id: number | undefined) => {
        // console.log(id);

        if (id) {
            axiosWithHeaders("post", NEXT_PUBLIC_DETAIL_CAMPAIGN_API, { id })
                .then((response: any) => {
                    if (response && response.status === enums.STATUS_RESPONSE_OK) {
                        const {
                            status,
                            result,
                            message
                        } = response.data;
                        if (status === enums.STATUS_RESPONSE_OK) {
                            if (result) {
                                const {
                                    detail,
                                    areas,
                                    channels,
                                    typeposm
                                } = result;

                                setDetail(detail);
                                dispatch(setTempAreaData(areas));
                                dispatch(setTempChannelData(channels));
                                dispatch(setTempPosmData(typeposm));
                            }
                            // console.log(result);
                            setOpenUpdate(true);
                        } else {
                            console.log(message);
                        }
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
        }
    }

    const handleDelete = (id: number | undefined) => {
        if (id) {
            setId(id);
            setOpenDelete(true);
        }
    }

    const CellCheck = ({ rowKeyValue, isSelectedRow }: ICellTextProps) => {
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

    const saveLastProject = (item: any) => {
        // console.log(item)

        let list: any = []
        let localStorageList = localStorage.getItem("lastProject");
        if (localStorageList) {
            list = JSON.parse(localStorageList);
        }

        console.log(list);

        let exist: any = list.findIndex((x: any) => x.id === item.id);

        console.log(exist);
        list.push({
            id: item.id,
            campaignName: item.campaignName
        })

        localStorage.setItem("lastProject", JSON.stringify(list))

        router.push(`/campaign/${item.id}/overview`)
        // let list: any = []   
        // let lastProject: any = localStorage.getItem("lastProject");

        // console.log(lastProject)

        // if (lastProject) {
        //     list = JSON.stringify(lastProject);
        // }

        // console.log(list);


        // let index: number = _.findIndex(list, { id: item.id });


        // if (index === -1) {
        //     list.push(item)
        // }

        // console.log(list);

        // localStorage.setItem("lastProject", JSON.stringify(list))
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
                                        <Label className="pointer-events-none">Thêm chiến dịch</Label>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Thêm chiến dịch</Label>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="w-full flex justify-between lg:hidden mt-2 space-x-3">
                        {/* {(selectedRows && selectedRows.length > 0) ? ( */}
                        <div className="space-x-1.5">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={(selectedRows && selectedRows.length > 0 ? false : true)}
                                            onClick={() => selectedRows ? getDetailCampaign(selectedRows[0]) : null}
                                            size={`icon`}
                                            variant={`secondary`}
                                            className="h-8 w-8"
                                        >
                                            <Edit className="text-foreground w-5 h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Sửa chiến dịch</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
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
                                            {/* <Label>Xóa</Label> */}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Xóa chiến dịch</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        {/* ) : (
                            <span></span>
                        )} */}

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size={`icon`} variant={`outline`} className="h-8 w-8" onClick={() => {
                                        setOpen(true)
                                    }}>
                                        <Plus className="w-5 h-5" />
                                        {/* <Label>Thêm</Label> */}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Thêm chiến dịch</Label>
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
                                        <th key={column.key} className="hidden lg:table-cell ka-thead-cell ka-thead-cell-height ka-thead-fixed bg-foreground z-50" style={{ padding: `0px`, height: 40 }}>
                                            <div className="ka-thead-cell-wrapper">
                                                <div className="ka-thead-cell-content-wrapper">
                                                    <div className={
                                                        cn(
                                                            "ka-thead-cell-content flex items-center text-background px-2",
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
                                                        "relative z-0 py-0.5 pb-2 space-y-0.5 flex flex-col overflow-x-hidden",
                                                        roleId === 1 ? "w-[calc(100%-32px)] pr-1": "w-full px-3"
                                                    )
                                                }>
                                                    <button onClick={() => saveLastProject(props.rowData)}
                                                        // href={`/campaign/${props.rowData.id}/overview`} 
                                                        className="absolute w-full h-full inline-block top-0">
                                                        &nbsp;
                                                    </button>
                                                    <div className="w-full relative flex">
                                                        <div className="w-[calc(100%-70px)]">
                                                            <div className="w-full relative">
                                                                <p className="text-sm font-bold truncate"> {props.rowData.campaignName}</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-[70px]">
                                                            <Label className="text-xs">{props.rowData.datecreate}</Label>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-black/60 font-medium line-clamp-2">{props.rowData.campaignDescription}</div>
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
                                                    <Link onClick={() => saveLastProject(props.rowData)} href={`/campaign/${props.rowData.id}/overview`} className="inline-flex w-full h-full">
                                                        <span className="w-full h-auto inline-block align-middle truncate px-2">
                                                            {props.rowData[column.field]}
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <>
                                                        {roleId === 1 && (
                                                            <div className="hidden bg-transparent lg:group-hover:flex justify-end items-center absolute top-0 right-0 h-full px-3 z-20">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button onClick={() => getDetailCampaign(props.rowData.id)} size={`icon`} variant={`outline`} className="mr-1 w-8 h-8 bg-transparent">
                                                                                <Edit className="w-6 h-6" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Sửa</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>

                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button onClick={() => handleDelete(props.rowData.id)} size={`icon`} variant={`ghost`} className="w-8 h-8 bg-transparent">
                                                                                <Trash2 className="w-5 h-5" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Xóa</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
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
                            className: "max-h-[calc(100vh-310px)] lg:max-h-[calc(100vh-400px)]"
                        }),
                    }}
                    selectedRows={selectedRows}
                    paging={paging}
                    onChangeTablePage={onChangeTablePage}
                />
            </div>
            <CreateCampaign open={open} onClose={() => setOpen(!open)} onRefresh={onRefresh} />
            <UpdateCampaign open={openUpdate} onClose={() => setOpenUpdate(false)} detail={detail} onRefresh={onRefresh} />
            <DeleteCampaign id={id} open={openDelete} onClose={() => setOpenDelete(!openDelete)} onRefresh={onRefresh} />
        </>
    )
}