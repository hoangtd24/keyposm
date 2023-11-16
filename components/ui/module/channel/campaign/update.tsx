"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react";

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

import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { ChannelItem } from "@/lib/store/slices/channelSlice";
import { setListChannelCampaign } from "@/lib/store/slices/channelSlice";
import { NEXT_PUBLIC_UPDATE_CHANNEL_API } from "@/config/api";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";

export default function UpdateCampaignChannel({ open, onClose, detail }: { open: boolean, onClose: any, detail?: ChannelItem | null }) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const { listChannelCampaign } = useAppSelector(state => state.channel);

    const formSchema = z.object({
        id: z.number().optional(),
        channelName: z.string(),
        channelDescription: z.string(),
        campaignId: z.number().optional(),
        total: z.number().optional(),
        totalTransaction: z.number().optional(),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: 0,
            channelName: "",
            channelDescription: "",
            total: 0,
            totalTransaction: 0,
        },
    })

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (detail) {
            // form.setValue("id", detail.id);
            form.setValue("channelName", detail.channelName);
            form.setValue("channelDescription", detail.channelDescription);
            form.setValue("total", detail.total);
            form.setValue("totalTransaction", detail.totalTransaction);
        }
        //eslint-disable-next-line
    }, [detail])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objUpdate = _.cloneDeep(values);
        console.log(objUpdate);
        setLoading(true);
        axiosWithHeaders("post", `${NEXT_PUBLIC_UPDATE_CHANNEL_API}`, objUpdate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Cập nhật kênh thành công !",
                        })

                        let listChannel: ChannelItem[] = _.cloneDeep(listChannelCampaign ? listChannelCampaign : []);
                        if (detail) {
                            let index = listChannel.findIndex(item => item.id === detail.id);
                            console.log(index);
                            listChannel[index] = objUpdate;

                            dispatch(setListChannelCampaign(listChannel));
                        }
                        form.reset();
                        onClose();
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
            })
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            form.reset();
            return onClose();
        }}>


            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-0 relative z-10">
                    <DialogHeader className="relative z-10 p-6">
                        <DialogTitle>{"Cập nhật kênh"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-6 space-y-6 bg-background pt-8 rounded-md">
                            {/* {fileBackground} */}
                            <FormField
                                control={form.control}
                                name="channelName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kênh</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tên kênh" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="total"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tổng số</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="0"
                                                inputMode="decimal"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    form.setValue("total", parseInt(e.target.value));
                                                }}
                                                onInput={(e: any) => {
                                                    let value = e.target.value;
                                                    e.target.value = value.replace(/[^0-9]/g, '');
                                                }}
                                                onFocus={(e: any) => e.target.select()}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="totalTransaction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số đã giao</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="0"
                                                inputMode="decimal"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    form.setValue("totalTransaction", parseInt(e.target.value));
                                                }}
                                                onInput={(e: any) => {
                                                    let value = e.target.value;
                                                    e.target.value = value.replace(/[^0-9]/g, '');
                                                }}
                                                onFocus={(e: any) => e.target.select()}
                                            />
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
                                        <FormLabel>Mô tả kênh</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Mô tả kênh" {...field} />
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
    )
}