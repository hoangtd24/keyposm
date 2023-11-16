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
    DOWNLOAD_QRCODE_API
} from "@/config/api";

import {
    IMAGE_URI
} from "@/config";


export default function DownloadQrCode({ campaignId, open, onClose }: { campaignId: number, open: boolean, onClose: () => void }) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();

    const formSchema = z.object({
        size: z.number(),
        campaignId: z.number(),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            size: 100,
            campaignId: campaignId
        },
    })

    // const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);
    const [loadingFileBackground, setLoadingFileBackground] = useState(false);

    const [size, setSize] = useState(100);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objCreate = _.cloneDeep(values);
        console.log(objCreate);
        setLoading(true);
        axiosWithHeaders("post", `${DOWNLOAD_QRCODE_API}`, objCreate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                        result
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        const link = document.createElement('a')

                        link.setAttribute('href', result)
                        link.setAttribute('download', 'qrcode.zip')
                        link.style.display = 'none'

                        document.body.appendChild(link)

                        link.click()

                        document.body.removeChild(link)
                        toast({
                            title: "Thông báo",
                            description: "Tải về  thành công !",
                        })
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
                form.reset();
            })
    }

    return (
        <>
            {/* <div className="hidden md:flex absolute bottom-5 right-5">
                <Button className="py-5 px-5" onClick={() => {
                    setOpen(true)
                    form.reset();
                }}>
                    <Plus className="pointer-events-none mr-2" />
                    <Label className="pointer-events-none">TẢI QR CODE</Label>
                </Button>
            </div> */}



            {/* <div className="md:hidden absolute bottom-5 right-5">
                <Button size={`icon`} onClick={() => setOpen(true)}>
                    <Plus className="pointer-events-none" />
                </Button>
            </div> */}

            <Dialog open={open} onOpenChange={() => {
                // setOpen(!open)
                form.reset();
                setSize(100)

                return onClose();
            }}>


                <DialogContent className="sm:max-w-[500px] p-0">
                    <div className="p-6 relative z-10">
                        <DialogHeader className="relative z-10">
                            <DialogTitle>Tải QR Code</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background pt-8 rounded-md">
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kích thước của hình QR code (đơn vị px)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0"
                                                    inputMode="decimal"
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        form.setValue("size", parseInt(e.target.value));
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
        </>
    )
}