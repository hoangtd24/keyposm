"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { axiosWithHeaders, axiosWithHeadersUploadFile } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import moment from "moment";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
import {
    BrandDropdown,
    RoleDropdown
} from "@/components/ui/module/dropdown";

import {
    IMAGE_URI
} from "@/config";

import {
    NEXT_PUBLIC_API_ADMIN_UPDATE_USER,
    NEXT_PUBLIC_UPLOAD_API
} from "@/config/api";

export interface DetailUserProps {
    id: number;
    name: string;
    username: string;
    avatar: string;
    roleId: number;
    brands: any;
}

export interface UpdateUserProps {
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
    detail?: DetailUserProps;
}

export default function UpdateUser({ open, onClose, onRefresh, detail }: UpdateUserProps) {
    const { dataRole } = useAppSelector((state) => state.role);
    const { dataBrand } = useAppSelector((state) => state.brand);

    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const [roleId, setRoleId] = useState<number>(0);
    const [brandId, setBrandId] = useState<number>(0);

    const formSchema = z.object({
        id: z.number(),
        avatar: z.string(),
        username: z.string()
            .min(1, {
                message: "Tài khoản không được để trống !",
            }),
        // password: z.string()
        // .min(1, {
        //     message: "Tài khoản không được để trống !",
        // }),
        name: z.string()
            .min(1, {
                message: "Họ và tên không được để trống !",
            }),
        roleId: z.string().refine((value) => value !== "0", {
            message: "Quyền truy cập không được để trống !"
        }),
        brandId: z.string().optional(),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: 0,
            avatar: "",
            username: "",
            // password: "",
            name: "",
            roleId: "0",
            brandId: "0",
        },
    })

    // const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);

    const [fileLogo, setFileLogo] = useState("");

    useEffect(() => {
        if (detail) {
            form.setValue("name", detail.name);
            form.setValue("username", detail.username);

            if (detail.avatar) {
                form.setValue("avatar", detail.avatar);
                setFileLogo(`${IMAGE_URI}/${detail.avatar}`);
            }
            // console.log(detail);
            if (detail.roleId) {
                form.setValue("roleId", detail.roleId.toString());
                setRoleId(detail.roleId);
            }
            if (detail.brands) {
                if (detail.brands.length > 0)
                    form.setValue("brandId", detail.brands[0].id.toString());
                else
                    form.setValue("brandId", "0");
            }
            form.setValue("id", detail.id);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let objUpdate = _.cloneDeep(values);
        // objUpdate.id = detail?.id;

        setLoading(true);

        // console.log(objUpdate);
        axiosWithHeaders("post", `${NEXT_PUBLIC_API_ADMIN_UPDATE_USER}`, objUpdate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Cập nhật nhân viên thành công !",
                        })
                        onClose && onClose();
                        onRefresh && onRefresh();
                        dispatch(setTableTimeStamp(moment().valueOf()));
                    } else {
                        toast({
                            title: "Thông báo",
                            description: message,
                        })
                    }
                }
            })
            .catch((err) => {
                toast({
                    title: "Thông báo",
                    description: err.toString(),
                })
            })
            .finally(() => {
                setLoading(false);
                form.reset();
            })
    }

    async function onChangeFile(e: any, field: any) {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            var f = new FormData();
            f.append("file", file);

            if (field === "avatar") {
                setLoadingFile(true);
            }

            await axiosWithHeadersUploadFile("post", NEXT_PUBLIC_UPLOAD_API, f)
                .then((response) => {
                    if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                        if (field === "avatar") {
                            setFileLogo(`${IMAGE_URI}/${response.data.filePath}`);
                        }
                        form.setValue(field, response.data.filePath);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    if (field === "avatar") {
                        setLoadingFile(false);
                    }
                })
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            onClose();
            form.reset();
            setFileLogo("")
        }}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-6 relative z-10">
                    <DialogHeader className="relative z-10">
                        <DialogTitle>Cập nhật nhân viên</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background pt-8 rounded-md">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex justify-center">
                                                <Avatar className="w-24 h-24 cursor-pointer relative z-20" onClick={() => {
                                                    const fileLogo = document.getElementById("fileLogo");
                                                    fileLogo?.click();
                                                }}>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <>
                                                                    {fileLogo === "" ? <>
                                                                        <AvatarFallback>
                                                                            <Plus className="w-14 h-14" />
                                                                        </AvatarFallback>
                                                                        <AvatarImage src={fileLogo} alt="" />
                                                                    </> :
                                                                        <picture>
                                                                            <img src={fileLogo} alt="" className="w-24 h-24 object-contain" />
                                                                        </picture>}
                                                                </>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Thay đổi logo</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                </Avatar>
                                                <Input id="fileLogo" accept="image/*" type="file" className="hidden" onChange={(e) => onChangeFile(e, "avatar")} disabled={(loadingFile) ? true : false} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tài khoản</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tài khoản" {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Họ và tên" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quyền truy cập</FormLabel>
                                        <RoleDropdown
                                            listRole={dataRole}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setRoleId(parseInt(value))
                                                if (value !== "3") {
                                                    form.setValue("brandId", "0");
                                                }
                                            }}
                                            value={field.value}
                                            type="dropdown"
                                        />

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {(roleId === 3 || roleId === 5) && (
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thương hiệu</FormLabel>
                                            <BrandDropdown
                                                listBrand={dataBrand}
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                                type="dropdown"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <DialogFooter className="space-y-4">
                                <Button type="submit" disabled={(loading || loadingFile) ? true : false}>
                                    {(loading || loadingFile) && (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Xác nhận
                                </Button>
                            </DialogFooter>
                        </form>

                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}