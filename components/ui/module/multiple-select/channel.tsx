import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react"
import {
    CommandDialog,
} from "@/components/ui/command"
import _ from "lodash";
import { ChannelItem } from "@/lib/store/slices/channelSlice";
import Fuse from 'fuse.js';

import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils";

const options = {
    includeMatches: true,
    findAllMatches: true,
    threshold: 0.4,
    useExtendedSearch: true,
    ignoreLocation: false,
    name: "channel",
    keys: [
        'channelName',
        'channelDescription',
        'channelCode'
    ]
};

var fuse: any = null;

type ChannelMultipleSelectProps = {
    open: boolean;
    value: ChannelItem[];
    type?: "filter" | "combobox";
    data: ChannelItem[] | []
    onChange: (value: ChannelItem[]) => void;
    onClose: () => void;
}

export default function ChannelMultipleSelect({ value, open, type = "filter", data, onChange, onClose }: ChannelMultipleSelectProps) {
    const [search, setSearch] = useState("");
    const [listChannelFilter, setListChannelFilter] = useState<ChannelItem[]>([]);
    const [listTemp, setListTemp] = useState<ChannelItem[]>([]);

    useEffect(() => {
        setListTemp(value);
    }, [value])

    const onChangeTemp = (item: ChannelItem) => {
        let list: ChannelItem[] = _.cloneDeep(listTemp);
        let index = list.findIndex((x: ChannelItem) => x.id === item.id);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(item);
        }
        setListTemp(list);
    }

    useEffect(() => {
        fuse = new Fuse(data, options);
        setListChannelFilter(data);
    }, [data])

    const filterChannel = _.debounce((query) => {
        let list: ChannelItem[] = [];
        let channels = _.cloneDeep(data);
        if (query.trim().length === 0) {
            // console.log(channels)

            setListChannelFilter(channels);
        } else {
            let ids = fuse.search(query);
            ids.forEach(function (id: any) {
                list.push(id.item);
            });

            setListChannelFilter(list);
        }
    }, 500);

    return (
        <>
            <CommandDialog open={open} onOpenChange={() => {
                // setOpen(false);
                setSearch("");
                filterChannel("");
                return onClose();
            }}>
                <div className="flex items-center border-b px-3">
                    <Search />
                    <input placeholder="Tìm kiếm kênh..." value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        filterChannel(e.target.value);
                    }}
                        className="flex px-3 h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <ScrollArea className="h-96 w-full rounded-none border">
                    {listChannelFilter.length === 0 ? (
                        <div className="flex items-center justify-center h-11 w-full">
                            <span className="text-muted-foreground">Không tìm thấy kênh</span>
                        </div>
                    ) : (
                        <ul className="w-full">
                            {listChannelFilter && listChannelFilter.length > 0 && listChannelFilter.map((item: any, index: number) => {
                                console.log(item, listTemp)
                                return (
                                    <li key={index} className="h-11 flex items-center cursor-pointer" onClick={() => onChangeTemp(item)}>
                                        {listTemp.findIndex((x: ChannelItem) => {
                                            return (x.id === item.id || x.id?.toString() === item.id.toString())
                                        
                                        }) > -1 ? <div className="w-12 h-4 flex justify-center items-center">
                                            <Check />
                                        </div> : <div className="w-12 h-4"></div>}
                                        {item.channelName}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </ScrollArea>
                <div className="w-full px-4 py-2 flex justify-end">
                    <Button onClick={() => {
                        setSearch("");
                        filterChannel("");
                        onChange(listTemp);
                        return onClose();
                    }}>Xác nhận</Button>
                </div>
            </CommandDialog>
        </>
    )
}