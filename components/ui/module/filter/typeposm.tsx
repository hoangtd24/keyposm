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
import moment from "moment";
import { NEXT_PUBLIC_LIST_TYPEPOSM_API_PAGE } from "@/config/api";
import Table from "@/components/ui/module/table/typeposm";
import { PagingOptions } from 'ka-table/models';
import { defaultPaging } from '@/config';
import { ActiveDropdown } from "@/components/ui/module/dropdown";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils";
import {
    BrandCombobox,
} from "@/components/ui/module/combobox";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { useAppSelector } from "@/lib/store";

export default function FilterArea() {
    const { toast } = useToast();
    const { collapsed } = useAppSelector((state: any) => state.menu);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);

    //update table
    const [data, setData] = useState<any>([]);
    const [totalRows, setTotalRows] = useState<number | null>(null);
    const [paging, setPaging] = useState<PagingOptions>(defaultPaging)

    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [changeFilter, setChangeFilter] = useState<boolean>(false);

    const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);

    useEffect(() => {
        setMenuCollapsed(collapsed)
    }, [collapsed])

    const formSchema = z.object({
        search: z.string(),
        offset: z.number(),
        limit: z.number()
    })


    useEffect(() => {
        onSubmit({
            search: "",
            offset: 0,
            limit: 50
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (currentTime && currentTime > 0) {
            onSubmit({
                search: form.getValues("search"),
                offset: 0,
                limit: 50
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
            offset: 0,
            limit: 50
         
    
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        let objSearch: any = _.cloneDeep(values);
        setLoading(true);

        axiosWithHeaders("post", NEXT_PUBLIC_LIST_TYPEPOSM_API_PAGE, objSearch)
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
            limit: pageSize ? pageSize : 50
        })
    }

    const onRefreshData = () => {
        setCurrentTime(moment().valueOf());
    }

    return (
        <>
            <Card className="border-none shadow-none bg-muted md:bg-background">
                <CardContent className="p-4 pt-1">
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
                                                        placeholder="Tìm kiếm vùng..."
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
                                                    // disabled={loading || loadingArea || loadingBrand || loadingCampaign || loadingChannel || loadingDistrict || loadingProvince}
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
                                                        placeholder="Tìm kiếm vùng..."
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
                                {/* <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="w-[230px]">
                                            <FormLabel>Trạng thái</FormLabel>
                                            <ActiveDropdown
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    setChangeFilter(true);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem className={
                                            cn(
                                                "w-[230px] hidden",
                                                menuCollapsed ? "lg:block" : "xl:block 2xl:block",
                                            )
                                        }>
                                            <FormLabel>Thương hiệu</FormLabel>
                                            <BrandCombobox
                                                value={field.value}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    setChangeFilter(true);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                                <div className={
                                    cn(
                                        "h-auto flex items-end",
                                        menuCollapsed ? "lg:hidden" : "lg:flex xl:hidden",
                                    )
                                }>
                                    <span></span>
                                    <Button
                                        onClick={() => setOpenFilter(true)}
                                        size={`icon`}
                                        variant={`outline`}
                                        type="button"
                                        className={
                                            cn(
                                                changeFilter && "text-destructive"
                                            )
                                        }
                                    >
                                        <Sliders />
                                    </Button>
                                </div>
                            </div>
                            <div className="h-auto flex items-end">
                                <span></span>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    Tìm kiếm
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Table
                data={data}
                loading={loading}
                totalRows={totalRows}
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
                                                    placeholder="Tìm kiếm vùng..."
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
                            {/* <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="pr-1">
                                        <FormLabel>Trạng thái hoạt động</FormLabel>
                                        <ActiveDropdown
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setChangeFilter(true);
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            {/* <FormField
                                control={form.control}
                                name="brandId"
                                render={({ field }) => (
                                    <FormItem className="pr-1">
                                        <FormLabel>Thương hiệu</FormLabel>
                                        <BrandCombobox
                                            value={field.value}
                                            onChange={(value) => {
                                                field.onChange(value);
                                                setChangeFilter(true);
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <SheetFooter className="grid grid-cols-4">
                                <div className="col-span-3">&nbsp;</div>
                                <SheetClose asChild >
                                    <Button type="submit" className="px-2" disabled={loading}>Tìm kiếm</Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </>
    )
}