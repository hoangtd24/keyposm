"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sliders } from "lucide-react";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormLabel,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";

import _ from "lodash";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useToast } from "@/components/ui/use-toast";
import {
    LIST_TICKET_INCAMPAIGN_API,
} from "@/config/api";
import TableTicketCampaign from "@/components/ui/module/table/ticket/campaign";
import { PagingOptions } from 'ka-table/models';
import { defaultPaging } from '@/config';
import {
    TicketStatusCombobox,
    ChannelCombobox,
    DistrictCombobox,
    ProvinceCombobox,
    AreaCombobox
} from "@/components/ui/module/combobox";
import moment from "moment";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { ChannelItem } from "@/lib/store/slices/channelSlice";
import { AreaItem } from "@/lib/store/slices/areaSlice";
import { useAppSelector } from "@/lib/store";
import { cn } from "@/lib/utils";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FilterTicketCampaign({ campaignId }: { campaignId: string }) {
    const { collapsed } = useAppSelector((state: any) => state.menu);
    const { toast } = useToast();
    const { dataTicketStatus } = useAppSelector((state) => state.ticketStatus);

    const [loading, setLoading] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [provinceCode, setProvinceCode] = useState<string>("");

    //update table
    const [data, setData] = useState<any>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [paging, setPaging] = useState<PagingOptions>(defaultPaging);
    // const [roleId, setRoleId] = useState<number>(0);
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [changeFilter, setChangeFilter] = useState<boolean>(false);

    //update filter
    const [loadingArea, setLoadingArea] = useState<boolean>(false);
    const [loadingChannel, setLoadingChannel] = useState<boolean>(false);
    const [dataChannel, setDataChannel] = useState<ChannelItem[]>([]);
    const [dataArea, setDataArea] = useState<AreaItem[]>([]);

    const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);

    useEffect(() => {
        setMenuCollapsed(collapsed)
    }, [collapsed])

    const formSchema = z.object({
        search: z.string(),
        offset: z.number(),
        limit: z.number(),
        province: z.string(),
        district: z.string(),
        campaignId: z.string().default("0").optional(),
        areaId: z.string().default("0"),
        channelId: z.string().default("0"),
        status: z.string().default("0"),
    })

    useEffect(() => {
        onSubmit({
            search: "",
            offset: 0,
            limit: 50,
            province: "",
            district: "",
            areaId: "0",
            channelId: "0",
            status: "0",
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (currentTime && currentTime > 0) {
            console.count()
            onSubmit({
                offset: 0,
                limit: 50,
                search: form.getValues("search"),
                province: form.getValues("province"),
                district: form.getValues("district"),
                areaId: form.getValues("areaId"),
                channelId: form.getValues("channelId"),
                status: form.getValues("status"),
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
            offset: 0,
            limit: 50,
            province: "",
            district: "",
            areaId: "0",
            channelId: "0",
            status: "0",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        let objSearch: any = _.cloneDeep(values);
        objSearch.campaignId = campaignId;

        console.log(objSearch)
        setLoading(true);
        axiosWithHeaders("post", LIST_TICKET_INCAMPAIGN_API, objSearch)
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        result,
                        total,
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        let dataTable = _.cloneDeep(result);
                        dataTable.map((item: any, index: number) => {
                            item.no = index + 1;
                        });
                        setData(dataTable);
                        setPaging({
                            ...paging,
                            pageIndex: (objSearch.offset / objSearch.limit),
                            pageSize: objSearch.limit,
                            pagesCount: Math.ceil(total / objSearch.limit),
                        })
                        setTotalRows(total);
                    } else {
                        toast({
                            title: "Lỗi",
                            description: message,
                        })
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
                setLoading(false);
            })
    }

    const onChangeTablePage = (pageIndex: number, pageSize: number) => {
        let offset = pageIndex ? pageSize * (pageIndex) : 0;

        onSubmit({
            search: form.getValues("search"),
            offset: offset,
            limit: pageSize ? pageSize : 50,
            province: form.getValues("province"),
            district: form.getValues("district"),
            areaId: form.getValues("areaId"),
            channelId: form.getValues("channelId"),
            status: form.getValues("status"),
        })
    }

    const onRefreshData = () => {
        setCurrentTime(moment().valueOf());
    }

    return (
        <>
            <Card className="border-none shadow-none bg-muted md:bg-background">
                <CardContent className="p-2 pt-1">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex space-x-3 md:space-x-2 md:mt-2 w-full"
                        >
                            <div className="flex flex-1 md:hidden">
                                <FormField
                                    control={form.control}
                                    name="search"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Từ khóa</FormLabel>
                                            <FormControl>
                                                <div className="px-0 relative group">
                                                    <Input
                                                        {...field}
                                                        className="w-full px-9"
                                                        placeholder="Tìm kiếm sự cố..."
                                                    />
                                                    <Button
                                                        size={`icon`}
                                                        className="absolute top-0 left-0 bg-transparent hover:bg-transparent border-none pointer-events-none group-hover:border-accent"
                                                    >
                                                        <Search className="text-foreground w-4 h-4 md:w-5 md:h-5" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => setOpenFilter(true)}
                                                        size={`icon`}
                                                        variant={`ghost`}
                                                        type="button"
                                                        className={
                                                            cn(
                                                                "md:hidden absolute top-0 right-0",
                                                                changeFilter && "text-destructive"
                                                            )
                                                        }
                                                    >
                                                        <Sliders />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="hidden md:flex space-x-2">
                                <FormField
                                    control={form.control}
                                    name="search"
                                    render={({ field }) => (
                                        <FormItem className="w-[300px]">
                                            <FormLabel>Từ khóa</FormLabel>
                                            <FormControl>
                                                <div className="px-0 relative group">
                                                    <Input
                                                        {...field}
                                                        className="w-full px-9"
                                                        placeholder="Tìm kiếm sự cố..."
                                                    />
                                                    <Button
                                                        size={`icon`}
                                                        className="absolute top-0 left-0 bg-transparent hover:bg-transparent border-none pointer-events-none group-hover:border-accent"
                                                    >
                                                        <Search className="text-foreground w-4 h-4 md:w-5 md:h-5" />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="channelId"
                                    render={({ field }) => (
                                        <FormItem className={
                                            cn(
                                                "w-[230px] hidden",
                                                menuCollapsed ? "2xl:block" : "xl:hidden 3xl:block",
                                            )
                                        }>
                                            <FormLabel>Kênh</FormLabel>
                                            <ChannelCombobox
                                                data={dataChannel}
                                                value={field.value}
                                                onChange={(value: string) => {
                                                    field.onChange(value);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="areaId"
                                    render={({ field }) => (
                                        <FormItem className={
                                            cn(
                                                "w-[230px] hidden",
                                                menuCollapsed ? "2xl:block" : "xl:hidden 3xl:block",
                                            )
                                        }>
                                            <FormLabel>Vùng</FormLabel>
                                            <AreaCombobox
                                                data={dataArea}
                                                value={field.value}
                                                onChange={(value: string) => {
                                                    // console.log(value, provinceCode)
                                                    field.onChange(value);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem className={
                                            cn(
                                                "w-[230px] hidden ",
                                                menuCollapsed ? "4xl:block" : "5xl:block",
                                            )
                                        }>
                                            <FormLabel>Tỉnh/Thành</FormLabel>
                                            <ProvinceCombobox
                                                value={field.value}
                                                onChange={(value: string, provinceCode: string) => {
                                                    // console.log(value, provinceCode)
                                                    setProvinceCode(provinceCode);
                                                    field.onChange(value);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem className={
                                            cn(
                                                "w-[230px] hidden ",
                                                menuCollapsed ? "4xl:block" : "5xl:block",
                                            )
                                        }>
                                            <FormLabel>Quận/Huyện</FormLabel>
                                            <DistrictCombobox
                                                value={field.value}
                                                provinceCode={provinceCode}
                                                onChange={(value: string) => {
                                                    field.onChange(value);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className={
                                            cn(
                                                "w-[230px] hidden ",
                                                menuCollapsed ? "4xl:block" : "5xl:block",
                                            )
                                        }>
                                            <FormLabel>Trạng thái</FormLabel>
                                            <TicketStatusCombobox
                                                value={field.value}
                                                data={dataTicketStatus}
                                                onChange={(value: string) => {
                                                    field.onChange(value);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className={
                                    cn(
                                        "h-auto flex items-end 4xl:hidden",
                                    )
                                }>
                                    <span></span>
                                    <Button
                                        onClick={() => setOpenFilter(true)}
                                        size={`icon`}
                                        variant={`outline`}
                                        type="button"
                                    >
                                        <Sliders />
                                    </Button>
                                </div>
                            </div>
                            <div className="h-auto flex items-end">
                                <span></span>
                                <Button type="submit" disabled={loading}>
                                    Tìm kiếm
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <TableTicketCampaign
                data={data}
                loading={loading}
                campaignId={campaignId}
                totalRows={totalRows}
                paging={paging}
                onChangeTablePage={(pageIndex: number, pageSize: number) => onChangeTablePage(pageIndex, pageSize)}
                onRefresh={onRefreshData}
            />

            <Sheet open={openFilter} onOpenChange={() => setOpenFilter(false)}>
                <SheetContent className="w-full sm:max-w-[400px] px-4 sm:px-2 space-x-0 p-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
                            <SheetHeader className="flex justify-start px-3 mb-2 mt-2">
                                <SheetTitle className="flex justify-start">Tìm kiếm nâng cao</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="w-full h-[calc(100vh-50px)] pl-0 px-3">
                                <div className="w-full px-1">
                                    <FormField
                                        control={form.control}
                                        name="search"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Từ khóa</FormLabel>
                                                <FormControl>
                                                    <div className="px-0 relative group">
                                                        <Input
                                                            {...field}
                                                            className="w-full px-9"
                                                            placeholder="Tìm kiếm sự cố..."
                                                        />
                                                        <Button
                                                            size={`icon`}
                                                            className="absolute top-0 left-0 bg-transparent hover:bg-transparent border-none pointer-events-none group-hover:border-accent"
                                                        >
                                                            <Search className="text-foreground w-4 h-4 md:w-5 md:h-5" />
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="channelId"
                                        render={({ field }) => (
                                            <FormItem className="pt-1.5">
                                                <FormLabel>Kênh</FormLabel>
                                                <ChannelCombobox
                                                    data={dataChannel}
                                                    value={field.value}
                                                    onChange={(value: string) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="areaId"
                                        render={({ field }) => (
                                            <FormItem className="pt-1.5">
                                                <FormLabel>Vùng</FormLabel>
                                                <AreaCombobox
                                                    data={dataArea}
                                                    value={field.value}
                                                    onChange={(value: string) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="province"
                                        render={({ field }) => (
                                            <FormItem className="pt-1.5">
                                                <FormLabel>Tỉnh/Thành phố</FormLabel>
                                                <ProvinceCombobox
                                                    value={field.value}
                                                    onChange={(value: string, provinceCode: string) => {
                                                        // console.log(value, provinceCode)
                                                        setProvinceCode(provinceCode);
                                                        if (provinceCode !== "") {
                                                            setChangeFilter(true);
                                                        }
                                                        field.onChange(value);
                                                    }}
                                                />

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem className="pt-1.5">
                                                <FormLabel>Quận/Huyện</FormLabel>
                                                <DistrictCombobox
                                                    value={field.value}
                                                    provinceCode={provinceCode}
                                                    onChange={(value: string) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="pt-1.5">
                                                <FormLabel>Trạng thái</FormLabel>
                                                <TicketStatusCombobox
                                                    value={field.value}
                                                    data={dataTicketStatus}
                                                    onChange={(value: string) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <SheetFooter className="flex items-end mt-2">
                                        <div>&nbsp;</div>
                                        <div>
                                            <SheetClose asChild >
                                                <Button type="submit" disabled={loading || loadingArea || loadingChannel}>
                                                    Tìm kiếm
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    </SheetFooter>
                                </div>
                            </ScrollArea>

                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </>
    )
}