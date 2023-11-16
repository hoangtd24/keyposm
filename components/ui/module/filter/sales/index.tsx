"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
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
// import { useAppDispatch, useAppSelector } from "@/lib/store";
// import { setTableData, setTableLoading, setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import moment from "moment";
import TableCampaignUserSales from "@/components/ui/module/table/sales";
import { PagingOptions } from 'ka-table/models';
import { defaultPaging } from '@/config';

import {
    NEXT_PUBLIC_USER_LOCATION_API
} from "@/config/api";

export default function Filter({ campaignId }: { campaignId: string }) {
    const { toast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);

    //update table
    const [data, setData] = useState<any>([]);
    const [totalRows, setTotalRows] = useState<number | null>(null);
    const [paging, setPaging] = useState<PagingOptions>(defaultPaging)
    const [selectedRows, setSelectedRows] = useState<number[] | undefined>([]);

    const formSchema = z.object({
        search: z.string(),
        offset: z.number(),
        limit: z.number(),
        campaignId: z.string().optional(),
    })

    useEffect(() => {
        onSubmit({
            search: "",
            offset: 0,
            limit: 50,
            // campaignId: ""
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (currentTime && currentTime > 0) {
            console.count()
            onSubmit({
                search: "",
                offset: 0,
                limit: 500,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
            offset: 0,
            limit: 500,
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // console.log(values);
        let objSearch: any = _.cloneDeep(values);
        objSearch.campaignId = campaignId;



        axiosWithHeaders("post", NEXT_PUBLIC_USER_LOCATION_API, objSearch)
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

    const onChangeTablePage = (pageIndex: number, pageSize: number) => {

        let offset = pageIndex ? pageSize * (pageIndex) : 0;

        onSubmit({
            search: form.getValues("search"),
            offset: offset,
            limit: pageSize ? pageSize : 50,
        })
    }

    const onRefreshData = () => {
        setCurrentTime(moment().valueOf());
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2 lg:mt-3">
                    <div className="flex-1 lg:max-w-[300px]">
                        <FormField
                            control={form.control}
                            name="search"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="px-0 relative group">
                                            <Input {...field} className="w-full px-9" placeholder="Tìm kiếm địa điểm..." />
                                            <Button size={`icon`} className="absolute top-0 left-0 bg-transparent hover:bg-transparent border-none pointer-events-none group-hover:border-accent">
                                                <Search className="text-foreground w-4 h-4 md:w-5 md:h-5" />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="">
                        <Button type="submit" className="w-full" disabled={loading}>Tìm kiếm</Button>
                    </div>
                </form>
            </Form>
            <TableCampaignUserSales
                data={data}
                loading={loading}
                totalRows={totalRows}
                selectedRows={selectedRows}
                onChangeSelectedRows={(selectedRows: number[] | undefined) => setSelectedRows(selectedRows)}
                paging={paging}
                onChangeTablePage={(pageIndex: number, pageSize: number) => onChangeTablePage(pageIndex, pageSize)}
                onRefresh={onRefreshData}
                campaignId={campaignId}
            />
        </>
    )
}