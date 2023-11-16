"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { axiosWithHeaders, axiosWithHeadersUploadFile } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea"

import {
    UPDATE_QRCODE_API,
    NEXT_PUBLIC_UPLOAD_MULTIPLE_API
} from "@/config/api";
import { IMAGE_URI } from "@/config";

type UpdateQrProps = {
    posmId: string;
    open: boolean;
    // detail: any | null;
    onClose: () => void;
    onRefresh?: () => void;
}



export default function UpdateNoteQr({ posmId, open, onClose, onRefresh }: UpdateQrProps) {
    const { toast } = useToast();

    const formSchema = z.object({
        posmId: z.string().optional(),
        note: z.string(),
        images: z.any().optional().default([]),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            posmId: "0",
            note: "",
            images: [],
        },
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingFile, setLoadingFile] = useState<boolean>(false);

    const [listImage, setListImage] = useState<any>([]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let objCreate = _.cloneDeep(values);
        setLoading(true);
        objCreate.posmId = posmId;
        objCreate.images = listImage;

        // console.log(objCreate)

        axiosWithHeaders("post", `${UPDATE_QRCODE_API}`, objCreate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Cập nhật ghi chú thành công !",
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
            })
    }

    async function onChangeFile(e: any) {
        const files = e.target.files;
        if (files) {
            var f = new FormData();
            Array.from(files).forEach((file: any) => {
                f.append("files", file)
            });

            setLoadingFile(true);


            await axiosWithHeadersUploadFile("post", NEXT_PUBLIC_UPLOAD_MULTIPLE_API, f)
                .then((response) => {
                    if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                        console.log(response?.data)
                        setListImage(response?.data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoadingFile(false);
                })
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            form.reset();
            setListImage([])
            return onClose();
        }}>


            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-6 relative z-10">
                    <DialogHeader className="relative z-10">
                        <DialogTitle>Cập nhật ghi chú</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background pt-8 rounded-md">
                            {/* {fileBackground} */}

                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chọn hình</FormLabel>
                                        <FormControl>
                                            <Input
                                                accept="image/*"
                                                disabled={(loadingFile) ? true : false}
                                                multiple
                                                type="file"
                                                placeholder="Chọn tệp..."
                                                onChange={(e: any) => onChangeFile(e)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                {listImage.map((item: any, index: number) => {
                                    return (
                                        <div key={index} className="border rounded-md">
                                            <picture>
                                                <img
                                                    // onClick={() => showImage(props.rowData.thumnail)}
                                                    src={`${IMAGE_URI}/${item.filePath}`}
                                                    className="w-full object-contain h-20"
                                                    // data-te-img={`${IMAGE_URI}/${props.rowData.thumnail}`}
                                                    alt="Hình qr"
                                                />
                                            </picture>
                                        </div>
                                    )
                                })}
                            </div>

                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ghi chú</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Nhập ghi chú" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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