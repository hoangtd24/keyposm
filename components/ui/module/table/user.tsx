"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Table from "@/components/ui/module/table";
import { cn } from "@/lib/utils";
import { Trash2, Edit, Plus, KeyRound } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpdateUser, DeleteUser, CreateUser, ChangePassword } from "@/components/ui/module/user";
import { DetailUserProps } from "@/components/ui/module/user/update";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import jwtDecode from "jwt-decode";

import {
    NEXT_PUBLIC_API_ADMIN_DETAIL_USER
} from "@/config/api";
import { PagingOptions } from 'ka-table/models';
import { Card, CardContent } from "@/components/ui/card";
import { AccountProps } from "@/components/ui/module/user/change-password";

const columns = [
    {
        key: "1",
        field: "no",
        title: "STT",
        width: 60
    },
    {
        key: "2",
        field: "name",
        title: "Họ và tên",
        width: 300
    },
    {
        key: "3",
        field: "username",
        title: "Tài khoản",
        width: 300
    },
    {
        key: "4",
        field: "roleName",
        title: "Quyền sử dụng",
    },
    {
        key: "6",
        field: "nameusercreate",
        title: "Người tạo",
    },
    {
        key: "7",
        field: "datecreate",
        title: "Ngày tạo",
        width: 120
    },
    {
        key: "8",
        field: "action",
        title: "",
        width: 120
    }
]

const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableUserProps = {
    loading: boolean,
    data: any | [],
    paging: PagingOptions,
    totalRows: number | null,
    selectedRows?: number[] | undefined,
    onChangeTablePage: (pageIndex: number, pageSize: number) => void,
    onChangeSelectedRows?: (selectedRows: number[] | undefined) => void,
    onRefresh: () => void,
}

export default function TableUser({ data, paging, loading, totalRows, selectedRows, onChangeTablePage, onChangeSelectedRows, onRefresh }: TableUserProps) {
    const { access_token } = useAppSelector((state: any) => state.auth);
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openChange, setOpenChange] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [detail, setDetail] = useState<DetailUserProps>();
    const [roleId, setRoleId] = useState<number>(0);

    const [account, setAccount] = useState<AccountProps>({
        username: "",
        password: ""
    });

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

    const getDetailUser = (id: number) => {
        const item = data.find((item: any) => item.id === id);
        axiosWithHeaders("post", NEXT_PUBLIC_API_ADMIN_DETAIL_USER, { username: item.username })
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        result,
                        message
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        setDetail(result);
                        console.log(result)
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

    const handleDelete = (id: number) => {
        // setId(id);
        const item = data.find((item: any) => item.id === id);
        setUsername(item.username);
        setOpenDelete(true);
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

    const handleChangePassword = (id: number) => {
        const item = data.find((item: any) => item.id === id);
        setOpenChange(true);
        setAccount({
            username: item.username,
            password: "123456"
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
                    <div className="hidden lg:flex justify-end">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={`outline`} className="text-foreground" onClick={() => {
                                        setOpen(true)
                                    }}>
                                        <Plus className="pointer-events-none mr-2" />
                                        <Label className="pointer-events-none">Thêm tài khoản</Label>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Thêm tài khoản</Label>
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
                                            onClick={() => selectedRows ? getDetailUser(selectedRows[0]) : null}
                                            size={`icon`}
                                            variant={`secondary`}
                                            className="h-8 w-8"
                                        >
                                            <Edit className="text-foreground w-5 h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Cập nhật tài khoản</Label>
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
                                        <Label>Xóa tài khoản</Label>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={(selectedRows && selectedRows.length > 0 ? false : true)}
                                            onClick={() => selectedRows ? handleChangePassword(selectedRows[0]) : null}
                                            size={`icon`}
                                            variant={`ghost`}
                                            className="w-8 h-8"
                                        >
                                            <KeyRound className="text-foreground w-5 h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <Label>Cập nhật mật khẩu</Label>
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
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Label>Thêm tài khoản</Label>
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
                                                                <span className="text-sm text-black/60">Tài khoản:</span><Label>{` ` + props.rowData.username}</Label>
                                                            </div>
                                                        </div>
                                                        <div className="w-[70px]">
                                                            <Label className="text-xs">{props.rowData.datecreate}</Label>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-black/60 font-medium line-clamp-2">{props.rowData.campaignDescription}</div>
                                                    <div>
                                                        <span className="text-sm text-black/60">Quyền truy cập:</span><Label>{` ` + props.rowData.roleName}</Label>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-black/60">Người tạo:</span><Label>{` ` + props.rowData.nameusercreate}</Label>
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
                                                            <div className="hidden bg-transparent lg:group-hover:flex justify-end items-center absolute top-0 right-0 h-full px-3 z-30">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button onClick={() => getDetailUser(props.rowData.id)} size={`icon`} variant={`outline`} className="mr-1 w-8 h-8 bg-transparent">
                                                                                <Edit className="w-6 h-6" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <Label>Cập nhật tài khoản</Label>
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
                                                                        <TooltipContent className="z-[51]">
                                                                            <Label>Xóa tài khoản</Label>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button size={`icon`} variant={`ghost`} onClick={() => handleChangePassword(props.rowData.id)} className="w-8 h-8 bg-transparent">
                                                                                <KeyRound className="w-5 h-5" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="z-[51]">
                                                                            <Label>Cập nhật mật khẩu</Label>
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
                            className: "max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-400px)]"
                        }),
                    }}
                    selectedRows={selectedRows}
                    paging={paging}
                    onChangeTablePage={onChangeTablePage}
                />
            </div>
            <CreateUser open={open} onClose={() => setOpen(!open)} onRefresh={onRefresh} />
            <UpdateUser open={openUpdate} onClose={() => setOpenUpdate(!openUpdate)} detail={detail} onRefresh={onRefresh} />
            <DeleteUser username={username} open={openDelete} onClose={() => setOpenDelete(!openDelete)} onRefresh={onRefresh} />
            <ChangePassword account={account} open={openChange} onClose={() => setOpenChange(!openChange)} onRefresh={onRefresh} />
        </>
    )
}