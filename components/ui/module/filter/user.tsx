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
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";

import _ from "lodash";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useToast } from "@/components/ui/use-toast";
import TableUser from "@/components/ui/module/table/user";
import { PagingOptions } from 'ka-table/models';
import { defaultPaging } from '@/config';
import { NEXT_PUBLIC_LIST_USER_API } from "@/config/api";
import moment from "moment";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

export default function FilterUser() {
    const { toast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);

    //update table
    const [data, setData] = useState<any>([]);
    const [totalRows, setTotalRows] = useState<number | null>(null);
    const [paging, setPaging] = useState<PagingOptions>(defaultPaging);

    //update mobile
    const [selectedRows, setSelectedRows] = useState<number[] | undefined>([]);

    const formSchema = z.object({
        search: z.string(),
        offset: z.number(),
        limit: z.number(),
    })

    useEffect(() => {
        onSubmit({
            search: "",
            offset: 0,
            limit: 50,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (currentTime && currentTime > 0) {
            console.count()
            onSubmit({
                search: "",
                offset: 0,
                limit: 50,
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
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        let objSearch: any = _.cloneDeep(values);
        setLoading(true);
        axiosWithHeaders("post", NEXT_PUBLIC_LIST_USER_API, objSearch)
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2 md:mt-2 w-full">
                            <div className="flex-1 lg:max-w-[300px]">
                                <FormField
                                    control={form.control}
                                    name="search"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Từ khóa</FormLabel>
                                            <FormControl>
                                                <div className="px-0 relative group">
                                                    <Input {...field} className="w-full px-9" placeholder="Tìm kiếm nhân viên..." />
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
            <TableUser
                data={data}
                loading={loading}
                totalRows={totalRows}
                paging={paging}
                selectedRows={selectedRows}
                onChangeSelectedRows={(selectedRows: number[] | undefined) => setSelectedRows(selectedRows)}
                onChangeTablePage={(pageIndex: number, pageSize: number) => onChangeTablePage(pageIndex, pageSize)}
                onRefresh={onRefreshData}
            />
        </>
    )
}