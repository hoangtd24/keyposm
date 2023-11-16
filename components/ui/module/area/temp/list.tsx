"use client";
import { useAppSelector } from "@/lib/store";
import { UpdateTempCampaignArea } from "@/components/ui/module/area";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EmptyAnimation from "@/components/ui/module/animate/empty";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { AreaItem } from "@/lib/store/slices/areaSlice";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/lib/store";
import { setTempAreaData } from "@/lib/store/slices/areaSlice";
import _ from "lodash";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AreaMultipleSelect } from "@/components/ui/module/multiple-select";

type ListTempAreaProps = {
    brandId: string;
    listArea: AreaItem[] | [];
}

export default function ListTempArea({ brandId, listArea }: ListTempAreaProps) {
    const dispatch = useAppDispatch();
    const { listTempArea } = useAppSelector(state => state.area);
    const [open, setOpen] = useState<boolean>(false);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [detail, setDetail] = useState<AreaItem | null>(null);

    if (listTempArea.length === 0) {
        return (
            <div className="w-full min-h-[300px] space-y-1.5 flex flex-col items-center justify-center">
                <div>
                    <EmptyAnimation />
                </div>
                <div>
                    <Label>Bạn chưa chọn vùng nào</Label>
                </div>
                <div>
                    <Button type="button" variant={`outline`} onClick={() => {
                        setOpen(true)
                    }}>Chọn vùng</Button>
                </div>
                <AreaMultipleSelect
                    data={listArea}
                    value={listTempArea}
                    open={open}
                    onClose={() => setOpen(false)}
                    onChange={(value) => {
                        let list: AreaItem[] = _.cloneDeep(value);
                        list.map((item: AreaItem) => {
                            item.id = item.id;
                            item.brandId = parseInt(brandId);
                            item.total = 0;
                            item.totalTransaction = 0;
                        })
                        dispatch(setTempAreaData(list));
                    }}
                />
            </div>
        )
    }

    const handleEdit = (item: AreaItem) => {
        setDetail(item);
        // console.log(item);
        setOpenUpdate(true);
    }

    const handleDelete = (index: number) => {
        let listArea: AreaItem[] = _.cloneDeep(listTempArea);
        listArea.splice(index, 1);
        dispatch(setTempAreaData(listArea));
    }

    return (
        <>
            <div className="w-full space-y-2 mb-2">
                <div className={cn(
                    "flex justify-between items-center",
                )}>
                    <Label>Tổng cộng: {listTempArea.length}</Label>
                    <Button type="button" variant={`outline`} onClick={() => {
                        setOpen(true)
                    }}>Chọn vùng</Button>
                </div>
                <div className="mb-4">
                    <ScrollArea className="h-[500px] w-full rounded-none overflow-y-auto overflow-x-hidden ">
                        {listTempArea.map((item, index) => (
                            <Card key={index} className={index !== listTempArea.length - 1 ? "mb-2" : ""}>
                                <CardContent className="w-full flex flex-col space-y-1.5 py-3 truncate relative overflow-x-hidden overflow-y-auto">
                                    <Label className="text-lg truncate">{item.areaName}</Label>
                                    <p className="text-sm text-muted-foreground font-normal truncate">{item.areaDescription}</p>
                                    {item?.channelName && <p className="text-sm text-muted-foreground font-normal truncate">{`Kênh: ` + item.channelName}</p>}
                                    {/* <div className="grid grid-cols-2">
                                        <div>
                                            <Label className="text-sm truncate">Số lượng: {item.total}</Label>
                                        </div>
                                        <div>
                                            <Label className="text-sm truncate">Đã giao: {item.totalTransaction}</Label>
                                        </div>
                                    </div> */}
                                </CardContent>
                                <CardFooter>
                                    <div className="flex justify-start items-center space-x-0 text-sm">
                                        <Button onClick={() => handleEdit(item)} variant={`link`} className="px-3 pl-0 py-0 h-auto">
                                            Xem
                                        </Button>
                                        <Separator orientation="vertical" className="bg-foreground h-4 w-[1px]" />
                                        <Button onClick={() => handleDelete(index)} variant={`link`} className="px-3 py-0 h-auto">
                                            Xóa
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </ScrollArea>
                </div>
            </div>
            <AreaMultipleSelect
                data={listArea}
                value={listTempArea}
                open={open}
                onClose={() => setOpen(false)}
                onChange={(value) => {
                    let list: AreaItem[] = _.cloneDeep(value);
                    list.map((item: AreaItem) => {
                        item.brandId = parseInt(brandId);
                        item.total = 0;
                        item.totalTransaction = 0;
                    })
                    dispatch(setTempAreaData(list));
                }}
            />
            <UpdateTempCampaignArea
                detail={detail}
                open={openUpdate}
                onClose={() => setOpenUpdate(false)}
            />
        </>
    )
}