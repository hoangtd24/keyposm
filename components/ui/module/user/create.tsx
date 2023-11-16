"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

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
import { useAppSelector } from "@/lib/store";
import {
    BrandDropdown,
    RoleDropdown
} from "@/components/ui/module/dropdown";

import {
    NEXT_PUBLIC_CREATE_USER_API,
    NEXT_PUBLIC_UPLOAD_API
} from "@/config/api";
import { IMAGE_URI } from "@/config";

type CreateUserProps = {
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}

export default function CreateUser({ open, onClose, onRefresh }: CreateUserProps) {
    const { dataRole } = useAppSelector((state: any) => state.role);
    const { dataBrand } = useAppSelector((state: any) => state.brand);
    const { toast } = useToast();

    const formSchema = z.object({
        avatar: z.string(),
        username: z.string()
            .min(1, {
                message: "Tài khoản không được để trống !",
            }),
        password: z.string()
            .min(1, {
                message: "Mật khẩu không được để trống !",
            }),
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
            avatar: "",
            username: "",
            password: "",
            name: "",
            roleId: "0",
            brandId: "0",
        },
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingFile, setLoadingFile] = useState<boolean>(false);
    const [roleId, setRoleId] = useState<number>(0);

    const [fileLogo, setFileLogo] = useState<string>("");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let objCreate = _.cloneDeep(values);
        setLoading(true);
        axiosWithHeaders("post", `${NEXT_PUBLIC_CREATE_USER_API}`, objCreate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Tạo nhân viên thành công !",
                        })
                        onClose && onClose();
                        onRefresh && onRefresh()
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
                setRoleId(0);
            })
    }

    async function onChangeFile(e: any, field: any) {
        const file = e.target.files[0];
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
            // setOpen(!open)
            form.reset();
            // setFileBackground("")
            setFileLogo("")
            setRoleId(0)
            return onClose();
        }}>


            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-6 relative z-10">
                    <DialogHeader className="relative z-10">
                        <DialogTitle>Thêm nhân viên</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background pt-8 rounded-md">
                            {/* {fileBackground} */}
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
                                            <Input placeholder="Nhập tài khoản" autoComplete="false" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Nhập mật khẩu" autoComplete="false" {...field} />
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