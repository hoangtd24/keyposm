"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sliders, Store, Bug, Cog ,Book ,BookUp  } from "lucide-react";
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
import { useAppDispatch, useAppSelector } from "@/lib/store";
// import { setTableData, setTableLoading, setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import moment from "moment";
import {
    NEXT_PUBLIC_LIST_CAMPAIGN_LOCATION_API,
    NEXT_PUBLIC_SUMMARY_CAMPAIGN_LOCATION_API
} from "@/config/api";
import TableCampaignLocation from "@/components/ui/module/table/campaign/location";
import { PagingOptions } from 'ka-table/models';
import { defaultPaging } from '@/config';
import {
    ProvinceCombobox,
    DistrictCombobox,
    ChannelCombobox,
    AreaCombobox,
} from "@/components/ui/module/combobox";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { numberWithCommas } from "@/lib/function"


export default function FilterCampaignLocation({ campaignId }: { campaignId: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const { collapsed } = useAppSelector((state: any) => state.menu);

    const { loadingArea, listDropdownArea } = useAppSelector((state) => state.area);
    const { loadingChannel, listDropdownChannel } = useAppSelector((state) => state.channel);

    const [loading, setLoading] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState<number>(0);
    //update table
    const [data, setData] = useState<any>([]);
    const [totalRows, setTotalRows] = useState<number | null>(null);
    const [paging, setPaging] = useState<PagingOptions>(defaultPaging);
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [changeFilter, setChangeFilter] = useState<boolean>(false);
    const [provinceCode, setProvinceCode] = useState<string>("");

    const [selectedRows, setSelectedRows] = useState<number[] | undefined>([]);
    const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);

    const [totalLocation, setTotalLocation] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const [totalNow, setTotalNow] = useState<number>(0)
    const [totalDeploy, setTotalDeploy] = useState<number>(0)
    const [totalTicket, setTotalTicket] = useState<number>(0);


    const formSchema = z.object({
        search: z.string(),
        offset: z.number(),
        limit: z.number(),
        campaignId: z.number().optional(),
        province: z.string(),
        district: z.string(),
        areaId: z.string().default("0"),
        channelId: z.string().default("0"),
    });

    useEffect(() => {
        setMenuCollapsed(collapsed)
    }, [collapsed])

    useEffect(() => {
        const params: any = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop: any) => searchParams.get(prop),
        });

        if (params?.areaId) {
            form.setValue("areaId", params?.areaId);

            onSubmit({
                search: "",
                offset: 0,
                limit: 50,
                province: "",
                district: "",
                // campaignId: parseInt(campaignId),
                areaId: params?.areaId,
                channelId: "0"
            })

            return;
        }
        onSubmit({
            search: "",
            offset: 0,
            limit: 50,
            province: "",
            district: "",
            // campaignId: parseInt(campaignId),
            areaId: "0",
            channelId: "0"
        })
        // console.log(params?.areaId)


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (currentTime && currentTime > 0) {
            // console.count()
            onSubmit({
                search: form.getValues("search"),
                offset: 0,
                limit: 50,
                province: form.getValues("province"),
                district: form.getValues("district"),
                // campaignId: parseInt(campaignId),
                areaId: form.getValues("areaId"),
                channelId: form.getValues("channelId")
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime])

    const onChangeTablePage = (pageIndex: number, pageSize: number) => {

        let offset = pageIndex ? pageSize * (pageIndex) : 0;

        onSubmit({
            search: form.getValues("search"),
            offset: offset,
            limit: pageSize ? pageSize : 50,
            province: form.getValues("province"),
            district: form.getValues("district"),
            // campaignId: parseInt(campaignId),
            areaId: form.getValues("areaId"),
            channelId: form.getValues("channelId")
        })
    }

    const onRefreshData = () => {
        setCurrentTime(moment().valueOf());
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
            offset: 0,
            limit: 50,
            campaignId: 0,
            province: "",
            district: "",
            areaId: "0",
            channelId: "0"
        },
    })

    const getDataTable = async (objSearch: any) => {
        setSelectedRows([]);
        setLoading(true);
        await axiosWithHeaders("post", NEXT_PUBLIC_LIST_CAMPAIGN_LOCATION_API, objSearch)
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        result,
                        total,
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        // console.log(result);
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

    const getSummaryLocation = async (objSearch: any) => {
        setLoading(true)
        await axiosWithHeaders("post", NEXT_PUBLIC_SUMMARY_CAMPAIGN_LOCATION_API, objSearch)
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        result,
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        console.log(result);
                        setTotalLocation(result.totallocation);
                        setTotal(result.total)
                        setTotalDeploy(result.totalDeploy)
                        setTotalTicket(result.totalTicket)
                        setTotalNow(result.totalNow)
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.count("getDataLocation");

        let objSearch: any = _.cloneDeep(values);
        objSearch.campaignId = parseInt(campaignId);
        objSearch.areaId = parseInt(values.areaId);
        objSearch.channelId = parseInt(values.channelId);

        // console.log(JSON.stringify(objSearch));

        await getDataTable(objSearch);
        await getSummaryLocation(objSearch);
    }

    return (
        <>
            <Card className="border-none shadow-none bg-muted md:bg-background">
                <CardContent className="p-4 md:px-1 pt-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-3 md:space-x-2 md:mt-2 w-full">
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
                                                        placeholder="Tìm kiếm địa điểm..."
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
                                                        placeholder="Tìm kiếm địa điểm..."
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
                                                "w-[230px]",
                                                menuCollapsed ? "md:hidden lg:block" : "md:hidden xl:block"
                                            )
                                        }>
                                            <FormLabel>Kênh</FormLabel>
                                            <ChannelCombobox
                                                data={listDropdownChannel}
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
                                                "w-[230px]",
                                                menuCollapsed ? "md:hidden lg:block" : "md:hidden lg:hidden xl:block"
                                            )
                                        }>
                                            <FormLabel>Vùng</FormLabel>
                                            <AreaCombobox
                                                data={listDropdownArea}
                                                value={field.value}
                                                onChange={(value: string) => {
                                                    console.log(value)
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
                                                "w-[230px] hidden",
                                                menuCollapsed ? "2xl:block" : "3xl:block",
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
                                                "w-[230px] hidden",
                                                menuCollapsed ? "2xl:block" : "3xl:block",
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
                                <div className={
                                    cn(
                                        "h-auto items-end hidden",
                                        menuCollapsed ? "md:flex lg:flex 2xl:hidden" : "md:flex lg:flex xl:flex 3xl:hidden"
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-2">
                <div>
                    <Card>
                        <CardContent className="lg:min-h-[100px] p-0 w-full relative flex items-center">
                            <div className="flex items-center w-full">
                                <div className="w-16 lg:w-20 aspect-square flex justify-center items-center">
                                    <Store className="w-10 h-10 lg:w-12 lg:h-12" />
                                </div>
                                <div className="flex-1 space-y-2 flex flex-col">
                                    <Label className="text-xs lg:text-lg">Số lượng địa điểm</Label>
                                    <Label className="text-lg lg:text-xl font-bold">{totalLocation ? numberWithCommas(totalLocation) : 0}</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="lg:min-h-[100px] p-0 w-full relative flex items-center">
                            <div className="flex items-center w-full">
                                <div className="w-16 lg:w-20 aspect-square flex justify-center items-center">
                                    <Book className="w-10 h-10 lg:w-12 lg:h-12" />
                                </div>
                                <div className="flex-1 space-y-2 flex flex-col">
                                    <Label className="text-xs lg:text-lg">Số lượng POSM</Label>
                                    <Label className="text-lg lg:text-xl font-bold">{total ? numberWithCommas(total) : 0}</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="lg:min-h-[100px] p-0 w-full relative flex items-center">
                            <div className="flex items-center w-full">
                                <div className="w-16 lg:w-20 aspect-square flex justify-center items-center">
                                    <BookUp className="w-10 h-10 lg:w-12 lg:h-12" />
                                </div>
                                <div className="flex-1 space-y-2 flex flex-col">
                                    <Label className="text-xs lg:text-lg">Số lượng thực tế</Label>
                                    <Label className="text-lg lg:text-xl font-bold">{totalNow ? numberWithCommas(totalNow) : 0}</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="lg:min-h-[100px] p-0 w-full relative flex items-center">
                            <div className="flex items-center w-full">
                                <div className="w-16 lg:w-20 aspect-square flex justify-center items-center">
                                    <Cog className="w-10 h-10 lg:w-12 lg:h-12" />
                                </div>
                                <div className="flex-1 space-y-2 flex flex-col">
                                    <Label className="text-xs lg:text-lg">Số lượng lắp đặt</Label>
                                    <Label className="text-lg lg:text-xl font-bold">{totalDeploy ? numberWithCommas(totalDeploy) : 0}</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="lg:min-h-[100px] p-0 w-full relative flex items-center">
                            <div className="flex items-center w-full">
                                <div className="w-16 lg:w-20 aspect-square flex justify-center items-center">
                                    <Bug className="w-10 h-10 lg:w-12 lg:h-12" />
                                </div>
                                <div className="flex-1 space-y-2 flex flex-col">
                                    <Label className="text-xs lg:text-lg">Số lượng sự cố</Label>
                                    <Label className="text-lg lg:text-xl font-bold">{totalTicket ? numberWithCommas(totalTicket) : 0}</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* <div>
                    <Card>
                        <CardContent className="min-h-[100px] p-0 w-full relative flex items-center">
                            <div className="flex items-center w-full">
                                <div className="w-20 aspect-square flex justify-center items-center">
                                    <Store className="w-12 h-12" />
                                </div>
                                <div className="flex-1 space-y-2 flex flex-col">
                                    <Label>Số lượng triển khai</Label>
                                    <Label className="text-xl font-bold">{totalRows}</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}
            </div>
            <TableCampaignLocation
                campaignId={campaignId}
                data={data}
                loading={loading}
                totalRows={totalRows}
                selectedRows={selectedRows}
                onChangeSelectedRows={(selectedRows: number[] | undefined) => {
                    setSelectedRows(selectedRows);
                }}
                paging={paging}
                onChangeTablePage={(pageIndex: number, pageSize: number) => onChangeTablePage(pageIndex, pageSize)}
                onRefresh={onRefreshData}
            />
            <Sheet open={openFilter} onOpenChange={setOpenFilter}>
                <SheetContent className="w-full sm:max-w-[400px] px-4 sm:px-2 space-x-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-x-2 space-y-3">
                            <SheetHeader className="flex justify-start px-2">
                                <SheetTitle className="flex justify-start">Tìm kiếm nâng cao</SheetTitle>
                            </SheetHeader>
                            <FormField
                                control={form.control}
                                name="search"
                                render={({ field }) => (
                                    <FormItem className="pr-1">
                                        <FormLabel>Từ khóa</FormLabel>
                                        <FormControl>
                                            <div className="px-0 relative group">
                                                <Input
                                                    {...field}
                                                    className="w-full px-9"
                                                    placeholder="Tìm kiếm địa điểm..."
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
                                    <FormItem className="pr-1">
                                        <FormLabel>Kênh</FormLabel>
                                        <ChannelCombobox
                                            data={listDropdownChannel}
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
                                    <FormItem className="pr-1">
                                        <FormLabel>Vùng</FormLabel>
                                        <AreaCombobox
                                            data={listDropdownArea}
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
                                    <FormItem className="pr-1">
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
                                    <FormItem className="pr-1">
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
                            <SheetFooter className="grid grid-cols-4">
                                <div className="col-span-3">&nbsp;</div>
                                <SheetClose asChild >
                                    <Button type="submit" className="px-2">Tìm kiếm</Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </>
    )
}