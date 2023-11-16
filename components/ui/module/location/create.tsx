"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
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

import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/lib/store";
import { ProvinceCombobox, DistrictCombobox } from "@/components/ui/module/combobox";

import { ScrollArea } from "@/components/ui/scroll-area";

import { NEXT_PUBLIC_CREATE_LOCATION_API } from "@/config/api";

type CreateLocationProps = {
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}

export default function CreateLocation({ open, onClose, onRefresh }: CreateLocationProps) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();

    const formSchema = z.object({
        code: z.string()
            .min(1, {
                message: "Mã địa điểm không được để trống !",
            }),
        locationName: z.string()
            .min(1, {
                message: "Tên địa điểm không được để trống !",
            }),
        province: z.string().optional().default(""),
        district: z.string().optional().default(""),
        ward: z.string().optional().default(""),
        contact: z.string().optional().default(""),
        address: z.string().optional().default(""),
        note: z.string().optional().default(""),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            locationName: "",
            province: "",
            district: "",
            ward: "",
            address: "",
            contact: "",
            note: "",
            // roleId: "0",
            // brandId: "0",
        },
    })

    // const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [provinceCode, setProvinceCode] = useState<string>("");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objCreate = _.cloneDeep(values);
        // console.log(objCreate);
        setLoading(true);
        axiosWithHeaders("post", `${NEXT_PUBLIC_CREATE_LOCATION_API}`, objCreate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Tạo địa điểm thành công !",
                        })
                        onRefresh && onRefresh();
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
                setProvinceCode("");
                // setDistrict("");
                // dispatch(setSelectedProvince(""));
                // setRoleId(0);
                // setBrandId(0);
            })
    }

    return (
        <>

            <Dialog open={open} onOpenChange={() => {
                form.reset();
                onClose && onClose();
            }}>


                <DialogContent className="sm:max-w-[500px] p-0">
                    <div className="p-0 relative z-10">
                        <DialogHeader className="relative z-10 p-6">
                            <DialogTitle>Thêm địa điểm</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <ScrollArea className="w-full h-[calc(100vh-80px)] lg:h-auto">
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-6 space-y-6 bg-background pb-4 rounded-md">
                                    {/* {fileBackground} */}

                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: 10 }}>
                                                <FormLabel>Mã địa điểm</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Mã địa điểm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="locationName"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: 10 }}>
                                                <FormLabel>Địa điểm</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Địa điểm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="province"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: 10 }}>
                                                <FormLabel>Tỉnh/Thành phố</FormLabel>
                                                <FormControl>
                                                    <ProvinceCombobox value={field.value} onChange={(value: string, provinceCode: string) => {
                                                        field.onChange(value);
                                                        form.setValue("district", "");
                                                        setProvinceCode(provinceCode);
                                                    }}
                                                        type="combobox"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: 10 }}>
                                                <FormLabel>Quận/Huyện</FormLabel>
                                                <FormControl>
                                                    <DistrictCombobox
                                                        value={field.value}
                                                        provinceCode={provinceCode}
                                                        onChange={(value: string) => {
                                                            field.onChange(value)
                                                        }}
                                                        type="combobox"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ward"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: 10 }}>
                                                <FormLabel>Phường/Xã</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Phường/Xã" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="contact"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: 10 }}>
                                                <FormLabel>Liên hệ</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Liên hệ" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: 10 }}>
                                                <FormLabel>Địa chỉ</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Địa chỉ" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem style={{ marginTop: 10 }}>
                                                <FormLabel>Ghi chú</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Ghi chú" {...field} />
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
                            </ScrollArea>


                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}