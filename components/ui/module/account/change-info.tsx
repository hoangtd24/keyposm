import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

import {
    NEXT_PUBLIC_UPLOAD_API,
    NEXT_PUBLIC_UPDATE_USER_API
} from "@/config/api";

import {
    IMAGE_URI
} from "@/config";

import { axiosWithHeaders, axiosWithHeadersUploadFile } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type AccountChangeInfoProps = {
    open: boolean;
    info: any;
    onClose: () => void;
    onLogout: () => void;
}

export default function AccountChangeInfo({ open, onClose, onLogout, info }: AccountChangeInfoProps) {
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [fileLogo, setFileLogo] = useState("");

    const formSchema = z.object({
        name: z.string(),
        username: z.string(),
        avatar: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            username: "",
            avatar: ""
        },
    })


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
                    if (field === "brandLogo") {
                        setLoadingFile(false);
                    }
                })
        }
    }

    useEffect(() => {
        if (info) {
            form.setValue("name", info.name);
            form.setValue("username", info.username);
            if (info.avatar) {
                form.setValue("avatar", info.avatar);
                setFileLogo(`${IMAGE_URI}/${info.avatar}`);

            }
        }
        //eslint-disable-next-line
    }, [info])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setLoading(true);
        axiosWithHeaders("post", NEXT_PUBLIC_UPDATE_USER_API, values)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Bạn đã cập nhật thông tin ! Vui lòng đăng nhập lại",
                            action: <ToastAction altText="Try again" onClick={onLogout}>Xác nhận</ToastAction>
                        })
                        onClose && onClose();
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



    return (
        <>
            <Dialog open={open} onOpenChange={() => {
                // form.reset({
                //     name: "",
                //     username: "",
                //     avatar: ""
                // });
                return onClose();
            }}>
                <DialogContent className="sm:max-w-[500px] p-0">
                    <div className="p-6 relative z-10 overflow-x-hidden">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background rounded-md">
                                <DialogHeader className="relative z-10 mb-10">
                                    <DialogTitle>Cập nhật thông tin</DialogTitle>
                                </DialogHeader>
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
                                                <Input disabled placeholder="Tài khoản" {...field} />
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
                                            <FormLabel>Tên</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Họ và tên" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter className="space-y-4">
                                    <div className="grid grid-cols-2 gap-x-4 w-full">
                                        <div>
                                            <Button disabled={loading} type="submit">Xác nhận</Button>
                                        </div>
                                    </div>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Thông báo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn đã cập nhật thông tin thành công. Vui lòng đăng nhập lại.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {/* <AlertDialogCancel></AlertDialogCancel> */}
                        <AlertDialogAction onClick={onLogout}>Xác nhận</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}