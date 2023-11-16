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
import { setTempChannelData } from "@/lib/store/slices/channelSlice";

type UpdateTempChannelProps = {
    open: boolean;
    detail?: ChannelItem | null
    onClose: () => void;
}

export default function UpdateTempChannel({ open, onClose, detail }: UpdateTempChannelProps) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const { listTempChannel } = useAppSelector(state => state.channel);

    const formSchema = z.object({
        id: z.number(),
        channelName: z.string(),
        channelDescription: z.string(),
        // total: z.number(),
        // totalTransaction: z.number(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: 0,
            channelName: "",
            channelDescription: "",
            // total: 0,
            // totalTransaction: 0,
        },
    })

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (detail) {
            form.reset({
                channelName: detail.channelName,
                channelDescription: detail.channelDescription,
                // total: detail.total,
                // totalTransaction: detail.totalTransaction,
            })

            if(detail.id){
                form.setValue("id", parseInt(detail.id.toString()));
            }
            // console.log(detail);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objCreate = _.cloneDeep(values);
        // console.log(objCreate);
        setLoading(true);
        let listChannel: ChannelItem[] = _.cloneDeep(listTempChannel);
        let id = detail?.id;
        let index = listChannel.findIndex(item => item.id === id);
        listChannel[index] = objCreate;
        dispatch(setTempChannelData(listChannel));
        setLoading(false);
        form.reset();
        onClose();
        // dispatch()
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            form.reset();
            return onClose();
        }}>


            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-0 relative z-10">
                    <DialogHeader className="relative z-10 p-6">
                        <DialogTitle>Cập nhật kênh</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-6 space-y-6 bg-background pt-8 rounded-md">
                            <FormField
                                control={form.control}
                                name="channelName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kênh</FormLabel>
                                        <FormControl>
                                            <Input disabled placeholder="Nhập tên kênh" {...field} />
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
                                            <Textarea disabled placeholder="Mô tả kênh" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="total"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số lượng</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="0"
                                                inputMode="decimal"
                                                value={field.value}
                                                onChange={(e) => {
                                                    form.setValue("total", parseInt(e.target.value));
                                                }}
                                                onInput={(e: any) => {
                                                    let value = e.target.value;
                                                    e.target.value = value.replace(/[^0-9]/g, '');
                                                }}
                                                onFocus={(e: any) => e.target.select()} />
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
                                        <FormLabel>Số lượng đã giao</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="0"
                                                inputMode="decimal"
                                                value={field.value}
                                                onChange={(e) => {
                                                    form.setValue("totalTransaction", parseInt(e.target.value));
                                                }}
                                                onInput={(e: any) => {
                                                    let value = e.target.value;
                                                    e.target.value = value.replace(/[^0-9]/g, '');
                                                }}
                                                onFocus={(e: any) => e.target.select()} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
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