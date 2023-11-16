import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react"

import { useAppSelector } from "@/lib/store";
import {
    CommandDialog,
} from "@/components/ui/command"
import _ from "lodash";
import { ChannelItem } from "@/lib/store/slices/channelSlice";
import Fuse from 'fuse.js';

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";

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

type ChannelComboboxProps = {
    value?: string;
    onChange?: (value: string) => void;
    type?: "filter" | "combobox";
    data: ChannelItem[] | []
}

export default function ChannelCombobox({ value, onChange, type = "filter", data }: ChannelComboboxProps) {
    // const { listDropdown } = useAppSelector((state) => state.channel);
    // console.log(listDropdown)
    // console.log(data, value)

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [listChannelFilter, setListChannelFilter] = useState<ChannelItem[]>([]);

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
            <Button
                onClick={() => setOpen(true)}
                variant={"outline"}
                type="button"
                role="combobox"
                className="flex justify-between w-full truncate pr-2"
                disabled={data.length === 0 ? true : false}
            >
                <span className="pointer-events-none">{value  === "0" ? "Chọn kênh" : (
                    data.find((item: any) => item.id.toString() === value)?.channelName
                )}</span>
                <ChevronDown className="w-4 h-4" />
            </Button>
            <CommandDialog open={open} onOpenChange={() => {
                setOpen(false);
                setSearch("");
                filterChannel("");
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
                            <li
                                className={
                                    cn(
                                        "h-11 flex items-center cursor-pointer",
                                        type === "combobox" && "disabled:cursor-not-allowed disabled:opacity-50"
                                    )
                                }
                                onClick={() => {
                                    // dispatch(setSelectedProvince(item.code))
                                    setOpen(false);
                                    setSearch("");
                                    filterChannel("");
                                    onChange && onChange("0")
                                }}

                            >
                                {value?.toLocaleLowerCase() === ("0").toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                    <Check />
                                </div> : <div className="w-12 h-4"></div>}
                                {"Chọn kênh"}
                            </li>
                            {listChannelFilter && listChannelFilter.length > 0 && listChannelFilter.map((item: any, index: number) => {
                                return (
                                    <li key={index} className="h-11 flex items-center cursor-pointer" onClick={() => {
                                        setOpen(false);
                                        setSearch("");
                                        filterChannel("");
                                        onChange && onChange(item.id)
                                    }}>
                                        {value?.toLocaleLowerCase() === item.id.toString().toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                            <Check />
                                        </div> : <div className="w-12 h-4"></div>}
                                        {item.channelName}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </ScrollArea>
            </CommandDialog>
        </>
    )
}