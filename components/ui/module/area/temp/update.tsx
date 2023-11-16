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

// import { axiosWithHeaders } from "@/lib/axiosWrapper";
// import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setTempAreaData, AreaItem } from "@/lib/store/slices/areaSlice";
import moment from "moment";

type UpdateTempAreaProps = {
    open: boolean;
    detail?: AreaItem | null
    onClose: () => void;
}

export default function UpdateTempArea({ open, onClose, detail }: UpdateTempAreaProps) {
    const { toast } = useToast();
    const { listTempArea } = useAppSelector(state => state.area);
    const dispatch = useAppDispatch();

    const formSchema = z.object({
        id: z.number(),
        areaName: z.string(),
        areaDescription: z.string(),
        // total: z.number(),
        // totalTransaction: z.number(),
    })

    // console.log(open, brandId)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: 0,
            areaName: "",
            areaDescription: "",
            // total: 0,
            // totalTransaction: 0,
        },
    })

    useEffect(() => {
        if (detail) {
            form.reset({
                areaName: detail.areaName,
                areaDescription: detail.areaDescription,
                // total: detail.total,
                // totalTransaction: detail.totalTransaction,
            })

            if(detail.id){
                form.setValue("id", parseInt(detail.id.toString()));
            }
            // console.log(detail);
        }
        //eslint-disable-next-line
    }, [detail])

    // const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objCreate = _.cloneDeep(values);
        // console.log(objCreate);
        setLoading(true);
        let listArea: AreaItem[] = _.cloneDeep(listTempArea);
        let id = detail?.id;
        let index = listArea.findIndex(item => item.id === id);
        listArea[index] = objCreate;
        dispatch(setTempAreaData(listArea));
        setLoading(false);
        form.reset();
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            // setOpen(!open)
            form.reset();
            return onClose();
        }}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-0 relative z-10">
                    <DialogHeader className="relative z-10 p-6">
                        <DialogTitle>Cập nhật vùng</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-6 space-y-6 bg-background pt-8 rounded-md">
                            <FormField
                                control={form.control}
                                name="areaName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vùng</FormLabel>
                                        <FormControl>
                                            <Input disabled placeholder="Nhập vùng" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="areaDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả vùng</FormLabel>
                                        <FormControl>
                                            <Textarea disabled placeholder="Nhập mô tả vùng" {...field} />
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