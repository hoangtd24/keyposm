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

import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import {
    BrandCombobox
} from "@/components/ui/module/combobox";

import {
    NEXT_PUBLIC_CREATE_CHANNEL_API
} from "@/config/api";

export type CreateAreaProps = {
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}

export default function CreateChannel({ open, onClose, onRefresh }: CreateAreaProps) {
    const { toast } = useToast();

    const formSchema = z.object({
        channelName: z.string(),
        // .min(1, {
        //     message: "Tài khoản không được để trống !",
        // }),
        channelDescription: z.string(),
        // .min(1, {
        //     message: "Mật khẩu không được để trống !",
        // }),
        brandId: z.string(),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channelName: "",
            channelDescription: "",
            brandId: "0",
        },
    })

    // const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objCreate = _.cloneDeep(values);
        // console.log(objCreate);
        setLoading(true);
        axiosWithHeaders("post", `${NEXT_PUBLIC_CREATE_CHANNEL_API}`, objCreate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Tạo kênh thành công !",
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

    return (
        <Dialog open={open} onOpenChange={() => {
            form.reset();
            onClose && onClose();
        }}>


            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-6 relative z-10">
                    <DialogHeader className="relative z-10">
                        <DialogTitle>Thêm kênh</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background pt-8 rounded-md">
                            {/* {fileBackground} */}

                            <FormField
                                control={form.control}
                                name="channelName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên Kênh</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tên kênh" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="channelDescription"
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
                                name="brandId"
                                render={({ field }) => {
                                    // console.log(field);
                                    return (
                                        <FormItem>
                                            <FormLabel>Thương hiệu</FormLabel>
                                            <BrandCombobox
                                                value={field.value}
                                                type="combobox"
                                                onChange={(value: string) => {
                                                    field.onChange(value.toString());
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <DialogFooter className="space-y-4">
                                <Button type="submit" disabled={(loading) ? true : false}>
                                    {(loading) && (
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