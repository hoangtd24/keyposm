"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
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
import { useAppDispatch } from "@/lib/store";
import { setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import moment from "moment";

import {
    NEXT_PUBLIC_UPLOAD_API,
    NEXT_PUBLIC_CREATE_BRAND_API
} from "@/config/api";

import {
    IMAGE_URI
} from "@/config";

export type PageProps = {
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}


export default function CreateBrand({ open, onClose, onRefresh }: PageProps) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();

    const formSchema = z.object({
        brandName: z.string(),
        // .min(1, {
        //     message: "Tài khoản không được để trống !",
        // }),
        brandDescription: z.string(),
        // .min(1, {
        //     message: "Mật khẩu không được để trống !",
        // }),
        brandLogo: z.string(),
        brandBackground: z.string(),
        brandColor: z.string(),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            brandName: "",
            brandDescription: "",
            brandLogo: "",
            brandBackground: "",
            brandColor: "",
        },
    })

    // const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);
    const [loadingFileBackground, setLoadingFileBackground] = useState(false);

    const [fileLogo, setFileLogo] = useState("");
    const [fileBackground, setFileBackground] = useState("");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objCreate = _.cloneDeep(values);
        // console.log(objCreate);
        setLoading(true);
        axiosWithHeaders("post", `${NEXT_PUBLIC_CREATE_BRAND_API}`, objCreate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Tạo thương hiệu thành công !",
                        })
                        onClose && onClose();
                        onRefresh && onRefresh();
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
        if (file) {
            var f = new FormData();
            f.append("file", file);

            if (field === "brandLogo") {
                setLoadingFile(true);
            }

            if (field === "brandBackground") {
                setLoadingFileBackground(true);
            }


            await axiosWithHeadersUploadFile("post", NEXT_PUBLIC_UPLOAD_API, f)
                .then((response) => {
                    if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                        if (field === "brandLogo") {
                            setFileLogo(`${IMAGE_URI}/${response.data.filePath}`);
                        }

                        if (field === "brandBackground") {
                            setFileBackground(`${IMAGE_URI}/${response.data.filePath}`);
                        }
                        form.setValue(field, response.data.filePath);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    if (field === "brandLogo") {
                        setLoadingFile(false);
                    }

                    if (field === "brandBackground") {
                        setLoadingFileBackground(false);
                    }
                })
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            form.reset();
            setFileBackground("")
            setFileLogo("")
            onClose && onClose();
        }}>


            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-6 relative z-10">
                    {fileBackground !== "" && (
                        <div className="absolute top-0 left-0 w-full h-32 bg-black/60 rounded-md z-10 opacity-40">
                            <picture>
                                <img src={fileBackground} alt="" className="w-full h-full object-cover rounded-md" />
                            </picture>
                        </div>
                    )}

                    <DialogHeader className="relative z-10">
                        <DialogTitle>Thêm thương hiệu</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background pt-8 rounded-md">
                            {/* {fileBackground} */}
                            <FormField
                                control={form.control}
                                name="brandLogo"
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
                                                <Input id="fileLogo" accept="image/*" type="file" className="hidden" onChange={(e) => onChangeFile(e, "brandLogo")} disabled={(loadingFile || loadingFileBackground) ? true : false} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brandName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên thương hiệu</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tên thương hiệu" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brandDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Mô tả" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brandBackground"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hình nền thương hiệu</FormLabel>
                                        <FormControl>
                                            <Input accept="image/*" type="file" placeholder="Chọn tệp..." onChange={(e: any) => onChangeFile(e, "brandBackground")} disabled={(loadingFile || loadingFileBackground) ? true : false} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brandColor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Màu thương hiệu</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Màu thương hiệu" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="space-y-4">
                                <Button type="submit" disabled={(loading || loadingFile || loadingFileBackground) ? true : false}>
                                    {(loading || loadingFile || loadingFileBackground) && (
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