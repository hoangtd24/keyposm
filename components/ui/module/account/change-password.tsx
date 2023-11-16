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

import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";

import {
    NEXT_PUBLIC_CHANGE_PASSWORD_USER_API
} from "@/config/api";

import { useState } from "react";
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

type AccountChangePasswordProps = {
    open: boolean;
    onLogout: () => void;
    onClose: () => void;
}

export default function AccountChangePassword({ open, onClose, onLogout }: AccountChangePasswordProps) {
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    const formSchema = z.object({
        password: z.string(),
        oldpassword: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            oldpassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setLoading(true);
        axiosWithHeaders("post", NEXT_PUBLIC_CHANGE_PASSWORD_USER_API, values)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        setOpenAlert(true);
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
                form.reset();
                return onClose();
            }}>
                <DialogContent className="sm:max-w-[500px] p-0">
                    <div className="p-6 relative z-10 overflow-x-hidden">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background rounded-md">
                                <DialogHeader className="relative z-10 mb-10">
                                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                                </DialogHeader>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu mới</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="oldpassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu cũ</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Nhập mật khẩu cũ" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter className="space-y-4">
                                    <div className="grid grid-cols-2 gap-x-4 w-full">
                                        <div>
                                            <Button type="submit">Xác nhận</Button>
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
                            Bạn đã đổi mật khẩu thành công. Vui lòng đăng nhập lại.
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