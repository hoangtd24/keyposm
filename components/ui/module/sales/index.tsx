"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react";
import { useState } from "react";

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
// import { useAppDispatch } from "@/lib/store";
// import moment from "moment";
// import {  } from 'react-color';

import {
    NEXT_PUBLIC_UPLOAD_API,
    NEXT_PUBLIC_CREATE_BRAND_API
} from "@/config/api";

import {
    IMAGE_URI
} from "@/config";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

export type PageProps = {
    open: boolean;
    campaignId: string;
    onClose: () => void;
    onRefresh: () => void;
}


export default function AssignSales({ open, onClose, onRefresh, campaignId }: PageProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<number>(0);
    // const dispatch = useAppDispatch();

    const formSchema = z.object({
        campaignId: z.string().optional().default("0"),
        channelId: z.string().default("0"),
        areaId: z.string().default("0"),
        locationId: z.string().default("0"),
        listUsers: z.any().default([]).optional(),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            campaignId: "0",
            channelId: "0",
            areaId: "0",
            locationId: "0",
            listUsers: [],
        },
    })

    // const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);



    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objCreate = _.cloneDeep(values);
        console.log(objCreate);
        setLoading(true);
        // axiosWithHeaders("post", `${NEXT_PUBLIC_CREATE_BRAND_API}`, objCreate)
        //     .then((response) => {
        //         if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
        //             const {
        //                 status,
        //                 message,
        //             } = response.data;
        //             if (status === enums.STATUS_RESPONSE_OK) {
        //                 toast({
        //                     title: "Thông báo",
        //                     description: "Tạo thương hiệu thành công !",
        //                 })
        //                 onClose && onClose();
        //                 onRefresh && onRefresh();
        //             } else {
        //                 toast({
        //                     title: "Thông báo",
        //                     description: message,
        //                 })
        //             }
        //         }
        //     })
        //     .catch((err) => {
        //         toast({
        //             title: "Thông báo",
        //             description: err.toString(),
        //         })
        //     })
        //     .finally(() => {
        //         setLoading(false);
        //         form.reset();
        //     })
    }


    return (
        <>
            <Dialog open={open} onOpenChange={() => {
                form.reset();
                onClose && onClose();
            }}>


                <DialogContent className="sm:max-w-[500px] p-0">
                    <div className="p-6 relative z-10">
                        <DialogHeader className="relative z-10">
                            <DialogTitle>Chỉ định nhân viên</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background pt-8 rounded-md">
                                <FormField
                                    control={form.control}
                                    name="locationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Địa điểm</FormLabel>
                                            <FormControl>
                                                <Button type="button" className="flex justify-between w-full pr-1" variant={`outline`}>
                                                    <Label>Chọn địa điểm</Label>
                                                    <ChevronDown />
                                                </Button>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="channelId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kênh</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tên thương hiệu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="areaId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vùng</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tên thương hiệu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="listUsers"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nhân viên</FormLabel>
                                            <FormControl>
                                                <Button type="button" className="flex justify-between w-full pr-1" variant={`outline`}>
                                                    <Label>{
                                                        field.value.length === 0 ? "Chọn nhân viên" : `Đã chọn ${field.value.length} nhân viên`
                                                    }</Label>
                                                    <ChevronDown />
                                                </Button>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
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
        </>
    )
}