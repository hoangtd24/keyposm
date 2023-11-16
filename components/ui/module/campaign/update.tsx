"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
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
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { ListCampaignChannel } from "@/components/ui/module/channel";
import { ListCampaignArea } from "@/components/ui/module/area";
import { ListCampaignTypePosm } from "@/components/ui/module/typeposm";
import { TypeDefaultItem, setTempPosmData } from "@/lib/store/slices/typeDefaultSlice";
import { AreaItem, setTempAreaData } from "@/lib/store/slices/areaSlice";
import { ChannelItem, setTempChannelData } from "@/lib/store/slices/channelSlice";
import {
    NEXT_PUBLIC_UPDATE_CAMPAIGN_API,
    NEXT_PUBLIC_API_DROPDOWN_CHANNEL_BRAND,
    NEXT_PUBLIC_API_DROPDOWN_AREA_BRAND
} from "@/config/api";

import {
    BrandCombobox
} from "@/components/ui/module/combobox";

import { CampaignTypeDropdown } from "@/components/ui/module/dropdown";

export type DetailCampaignProps = {
    id?: number;
    campaignName: string;
    campaignDescription: string;
    campaignType: string;
    brandId: string;
    isChannel?: boolean;
    isArea?: boolean;
    // qrcode: {
    //     size: string;
    // },
    channels?: ChannelItem[] | [],
    areas?: AreaItem[] | [],
    typeposm?: TypeDefaultItem[] | []
}

export type UpdateCampaignProps = {
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
    detail: any;
}

export default function UpdateCampaign({ open, onClose, detail, onRefresh }: UpdateCampaignProps) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const { dataCampaignType } = useAppSelector((state) => state.campaign);
    const { listTempChannel } = useAppSelector((state) => state.channel);
    const { listTempArea } = useAppSelector((state) => state.area);
    const {
        listDropdownPosm,
        listTempPosm
    } = useAppSelector((state) => state.typeDefault);


    //update create campaign
    const [loadingChannel, setLoadingChannel] = useState<boolean>(false);
    const [loadingArea, setLoadingArea] = useState<boolean>(false);

    const [dataChannel, setDataChannel] = useState<ChannelItem[]>([]);
    const [dataArea, setDataArea] = useState<AreaItem[]>([]);

    const formSchema = z.object({
        id: z.number(),
        campaignName: z.string(),
        campaignDescription: z.string(),
        brandId: z.string(),
        campaignType: z.string().default("0"),
        qrcode: z.object({
            size: z.string().default("100"),
            total: z.number().default(0).optional(),
        }),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: 0,
            campaignName: "",
            campaignDescription: "",
            brandId: "0",
            campaignType: "0",
        },
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0);
    const [size, setSize] = useState<string>("100");
    const [total, setTotal] = useState<number>(0);
    const [campaignType, setCampaignType] = useState<string>("0");

    useEffect(() => {
        if (detail) {
            form.setValue("id", detail.id);
            form.setValue("campaignName", detail.campaignName);
            form.setValue("campaignDescription", detail.campaignDescription);
            form.setValue("brandId", detail.brandId.toString());
            form.setValue("campaignType", detail.campaignType.toString());
            if (detail.qrcode) {
                if (detail.qrcode.size) {
                    form.setValue("qrcode.size", detail.qrcode.size.toString());
                    setSize(detail.qrcode.size.toString());
                }
                if (detail.qrcode.total) {
                    setTotal(detail.qrcode.total);
                    form.setValue("qrcode.total", detail.qrcode.total);
                }
            }
            setCampaignType(detail.campaignType.toString());
            getListAreaDropdown(detail.brandId);
            getListChannelDropdown(detail.brandId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail])

    const getListChannelDropdown = async (brandId: string) => {
        if (brandId === "0") {
            setDataChannel([]);
            return;
        }

        setLoadingChannel(true)
        axiosWithHeaders("post", NEXT_PUBLIC_API_DROPDOWN_CHANNEL_BRAND, { brandId })
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    if (response && response.status === enums.STATUS_RESPONSE_OK) {
                        const {
                            result,
                            status,
                            message,
                        } = response.data;
                        if (status === enums.STATUS_RESPONSE_OK) {
                            let listChannel = _.cloneDeep(result);
                            listChannel.map((item: any) => {
                                item.id = item.id.toString();
                            })
                            setDataChannel(listChannel)
                        } else {
                            toast({
                                title: "Lỗi",
                                description: message,
                            })
                        }
                    }
                }
            })
            .catch((error: any) => {
                toast({
                    title: "Lỗi",
                    description: error.toString(),
                })
            })
            .finally(() => {
                setLoadingChannel(false);
            })
    }

    const getListAreaDropdown = async (brandId: string) => {

        if (brandId === "0") {
            setDataArea([]);
            return;
        }

        setLoadingArea(true)
        axiosWithHeaders("post", NEXT_PUBLIC_API_DROPDOWN_AREA_BRAND, { brandId })
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    if (response && response.status === enums.STATUS_RESPONSE_OK) {
                        if (response && response.status === enums.STATUS_RESPONSE_OK) {
                            const {
                                result,
                                status,
                                message,
                            } = response.data;
                            if (status === enums.STATUS_RESPONSE_OK) {
                                let listArea = _.cloneDeep(result);
                                listArea.map((item: any) => {
                                    item.id = item.id.toString();
                                })
                                setDataArea(listArea)
                            } else {
                                toast({
                                    title: "Lỗi",
                                    description: message,
                                })
                            }
                        }
                    }
                }
            })
            .catch((error: any) => {
                toast({
                    title: "Lỗi",
                    description: error.toString(),
                })
            })
            .finally(() => {
                setLoadingArea(false);
            })
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let objUpdate: any = _.cloneDeep(values);
        let listChannel: ChannelItem[] = _.cloneDeep(listTempChannel);

        listChannel.map((item) => {
            item.id = item.id ? parseInt(item.id.toString()) : 0;
        })

        objUpdate.channels = listChannel;
        let listArea: AreaItem[] = _.cloneDeep(listTempArea);

        if (listArea.length === 0) {
            toast({
                title: "Thông báo",
                description: "Vui lòng chọn ít nhất 1 vùng",
            })
            return;
        }

        listArea.map((item) => {
            item.id = item.id ? parseInt(item.id.toString()) : 0;
        })

        objUpdate.areas = listArea;

        let listTypePosm: TypeDefaultItem[] = _.cloneDeep(listTempPosm);
        listTypePosm = _.filter(listTypePosm, (item) => item.tempId !== 0);

        listTypePosm.forEach((item) => {
            delete item.manualAdd;
            delete item.tempId;
        })

        objUpdate.typeposm = listTypePosm;

        delete objUpdate.qrcode.total;
        if (objUpdate.campaignType === "3") {
            objUpdate.qrcode.total = total;
        }

        console.log(JSON.stringify(objUpdate))
        setLoading(true);
        axiosWithHeaders("post", `${NEXT_PUBLIC_UPDATE_CAMPAIGN_API}`, objUpdate)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Cập nhật chiến dịch thành công !",
                        })
                        onRefresh && onRefresh();
                        form.reset();
                        setStep(0);
                        // setIsChannel(false);
                        // setIsArea(false);
                        setLoading(false);
                        // setBrandId(0);
                        dispatch(setTempChannelData([]));
                        dispatch(setTempAreaData([]));
                        dispatch(setTempPosmData([]));
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
            })
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            form.reset();
            setStep(0);
            setLoading(false)
            dispatch(setTempChannelData([]));
            dispatch(setTempAreaData([]));
            dispatch(setTempPosmData([]));
            onClose && onClose();
        }}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-6 relative z-10 overflow-x-hidden">
                    {step === 0 && (
                        <>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background rounded-md">
                                    <DialogHeader className="relative z-10 mb-10">
                                        <DialogTitle>Cập nhật chiến dịch</DialogTitle>
                                    </DialogHeader>
                                    <FormField
                                        control={form.control}
                                        name="campaignName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên chiến dịch</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Tên chiến dịch" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="campaignDescription"
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
                                        name="campaignType"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Loại chiến dịch</FormLabel>
                                                    <CampaignTypeDropdown
                                                        value={field.value}
                                                        listCampaignType={dataCampaignType}
                                                        onValueChange={(value: string) => {
                                                            setCampaignType(value);
                                                            form.setValue("campaignType", value);
                                                        }}
                                                        type="dropdown"
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="qrcode.size"
                                        render={() => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Kích thước</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="0"
                                                            value={size}
                                                            inputMode="decimal"
                                                            onChange={(e) => {
                                                                setSize(e.target.value);
                                                                form.setValue("qrcode.size", e.target.value);
                                                            }}
                                                            onInput={(e: any) => {
                                                                let value = e.target.value;
                                                                e.target.value = value.replace(/[^0-9]/g, '');
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                    {/* {form.getValues("campaignType")} */}
                                    {campaignType === "3" && (
                                        <FormField
                                            control={form.control}
                                            name="qrcode.total"
                                            render={() => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Số lượng</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="0"
                                                                value={total}
                                                                inputMode="decimal"
                                                                onChange={(e) => {
                                                                    setTotal(parseInt(e.target.value));
                                                                    form.setValue("qrcode.total", parseInt(e.target.value));
                                                                }}
                                                                onInput={(e: any) => {
                                                                    let value = e.target.value;
                                                                    e.target.value = value.replace(/[^0-9]/g, '');
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="brandId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Thương hiệu</FormLabel>
                                                <BrandCombobox
                                                    value={field.value}
                                                    disabled={true}
                                                    onChange={(value: string) => {
                                                        if (value !== field.value) {
                                                            getListAreaDropdown(value);
                                                            getListChannelDropdown(value);
                                                        }
                                                        field.onChange(value.toString());
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter className="space-y-4">
                                        <Button type="button" onClick={() => setStep(1)}>Tiếp theo</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <DialogHeader className="relative z-10 mb-0 items-start">
                                <DialogTitle>Chọn kênh</DialogTitle>
                            </DialogHeader>
                            <ListCampaignChannel brandId={detail && detail.brandId} listChannel={dataChannel} listArea={dataArea} />
                            <DialogFooter className="space-y-4">
                                <div className="grid grid-cols-2 gap-x-4 w-full">
                                    <div>
                                        <Button className="w-full" variant={`outline`} type="button" onClick={() => setStep(0)}>Quay lại</Button>
                                    </div>
                                    <div>
                                        <Button className="w-full" type="button" onClick={() => {
                                            if (listTempChannel.length === 0) {
                                                toast({
                                                    title: "Thông báo",
                                                    description: "Vui lòng chọn ít nhất 1 kênh",
                                                })
                                                return;
                                            }
                                            setStep(2)
                                        }}>Tiếp theo</Button>
                                    </div>
                                </div>
                            </DialogFooter>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <DialogHeader className="relative z-10 mb-0 items-start">
                                <DialogTitle>Chọn vùng</DialogTitle>
                            </DialogHeader>
                            <ListCampaignArea brandId={detail && detail.brandId} listArea={dataArea} />
                            <Form {...form}>
                                {/* {JSON.stringify(form)} */}
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background rounded-md">
                                    <DialogFooter className="space-y-4">
                                        <div className="grid grid-cols-2 gap-x-4 w-full">
                                            <div>
                                                <Button variant={`outline`} className="w-full" type="button" onClick={() => setStep(1)}>Quay lại</Button>
                                            </div>
                                            <div>
                                                <Button className="w-full" onClick={() => {
                                                    if (listTempArea.length === 0) {
                                                        toast({
                                                            title: "Thông báo",
                                                            description: "Vui lòng chọn ít nhất 1 vùng",
                                                        })
                                                        return;
                                                    }
                                                    setStep(3);
                                                }}>Tiếp theo</Button>
                                            </div>
                                        </div>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </>
                    )}

                    {(step === 3 && (
                        <>
                            <DialogHeader className="relative z-10 mb-0 items-start">
                                <DialogTitle>Chọn loại POSM</DialogTitle>
                            </DialogHeader>
                            <ListCampaignTypePosm listTypePosmDefault={listDropdownPosm} />
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 bg-background rounded-md">
                                    <DialogFooter className="space-y-4">
                                        <div className="grid grid-cols-2 gap-x-4 w-full">
                                            <div>
                                                <Button type="button" className="w-full" variant={`outline`} onClick={() => { setStep(2) }}>Quay lại</Button>
                                            </div>
                                            <div>
                                                <Button type="submit" className="w-full" disabled={((loading || loadingArea || loadingChannel)) ? true : false}>
                                                    {((loading || loadingArea || loadingChannel)) && (
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    )}
                                                    Xác nhận
                                                </Button>
                                            </div>
                                        </div>

                                    </DialogFooter>
                                </form>
                            </Form>
                        </>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}