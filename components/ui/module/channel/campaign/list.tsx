"use client";
import { useAppSelector } from "@/lib/store";
import { UpdateTempCampaignChannel } from "@/components/ui/module/channel";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EmptyAnimation from "@/components/ui/module/animate/empty";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { setTempChannelData, ChannelItem } from "@/lib/store/slices/channelSlice";
import { AreaItem, setTempAreaData } from "@/lib/store/slices/areaSlice";
import { useAppDispatch } from "@/lib/store";
import _ from "lodash"
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChannelMultipleSelect } from "@/components/ui/module/multiple-select";

type ListTempChannelProps = {
    brandId: string;
    listChannel: ChannelItem[] | [];
    listArea: any;
}

export default function ListTempChannel({ listChannel, brandId, listArea }: ListTempChannelProps) {
    const dispatch = useAppDispatch();
    const { listTempChannel } = useAppSelector(state => state.channel);
    const [open, setOpen] = useState<boolean>(false);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [detail, setDetail] = useState<ChannelItem | null>(null);

    // console.log(listChannel, listTempChannel)

    const handleEdit = (item: ChannelItem) => {
        setDetail(item);
        // console.log(item);
        setOpenUpdate(true);
    }

    const handleDelete = (index: number) => {
        let listChannel: ChannelItem[] = _.cloneDeep(listTempChannel);
        listChannel.splice(index, 1);

        let listAreaFilter: AreaItem[] = [];
        let channelIds: any = []
        listChannel.map(item => {
            channelIds.push(item?.id)
        })
        listAreaFilter = _.filter(listArea, (item: AreaItem) => {
            return  (channelIds.includes(item?.channelId?.toString()) || channelIds.includes(item?.channelId))
        })
        dispatch(setTempAreaData(listAreaFilter));
        dispatch(setTempChannelData(listChannel));
    }

    if (listTempChannel.length === 0) {
        return (
            <div className="w-full min-h-[300px] space-y-1.5 flex flex-col items-center justify-center">
                <div>
                    <EmptyAnimation />
                </div>
                <div>
                    <Label>Bạn chưa chọn kênh nào</Label>
                </div>
                <div>
                    <Button type="button" variant={`outline`} onClick={() => {
                        setOpen(true)
                    }}>Chọn kênh</Button>
                </div>
                <ChannelMultipleSelect
                    data={listChannel}
                    value={listTempChannel}
                    open={open}
                    onClose={() => setOpen(false)}
                    onChange={(value) => {
                        let list: ChannelItem[] = _.cloneDeep(value);

                        let listAreaFilter: AreaItem[] = [];
                        let channelIds: any = []

                        list.map((item: ChannelItem) => {
                            item.id = item.id;
                            item.brandId = parseInt(brandId);
                            channelIds.push(item.id)
                        })

                        listAreaFilter = _.filter(listArea, (item: AreaItem) => {
                            return (channelIds.includes(item?.channelId?.toString()) || channelIds.includes(item?.channelId))
                        })

                        console.log(listAreaFilter)
                        dispatch(setTempAreaData(listAreaFilter));
                        dispatch(setTempChannelData(list));
                    }}
                />
            </div>
        )
    }

    return (
        <>
            <div className="w-full space-y-2 mb-2">
                <div className={cn(
                    "flex justify-between items-end mt-2",
                )}>
                    <Label>Tổng cộng: {listTempChannel.length}</Label>
                    <Button type="button" variant={`outline`} onClick={() => {
                        setOpen(true)
                    }}>Chọn kênh</Button>
                </div>
                <div className="mb-4">
                    <ScrollArea className="h-[500px] w-full rounded-none overflow-y-auto overflow-x-hidden ">
                        {listTempChannel.map((item: ChannelItem, index: number) => (
                            <Card key={index} className={index !== listTempChannel.length - 1 ? "mb-2" : ""}>
                                <CardContent className="w-full flex flex-col space-y-1.5 py-3 truncate relative overflow-x-hidden overflow-y-auto">
                                    <Label className="text-lg truncate">{item.channelName}</Label>
                                    <p className="text-sm text-muted-foreground font-normal truncate">{item.channelDescription}</p>
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
            <ChannelMultipleSelect
                data={listChannel}
                value={listTempChannel}
                open={open}
                onClose={() => setOpen(false)}
                onChange={(value) => {
                    let list: ChannelItem[] = _.cloneDeep(value);
                    let listAreaFilter: AreaItem[] = [];
                    let channelIds: any = []

                    list.map((item: ChannelItem) => {
                        item.id = item.id;
                        item.brandId = parseInt(brandId);
                        channelIds.push(item.id)
                    })

                    console.log(channelIds, )

                    listAreaFilter = _.filter(listArea, (item: AreaItem) => {
                        return (
                            channelIds.includes(item?.channelId?.toString()) || channelIds.includes(item?.channelId)
                        )
                    })

                    console.log(listAreaFilter)

                    dispatch(setTempAreaData(listAreaFilter));
                    dispatch(setTempChannelData(list));
                }}
            />
            <UpdateTempCampaignChannel
                detail={detail}
                open={openUpdate}
                onClose={() => setOpenUpdate(false)}
            />
        </>
    )
}