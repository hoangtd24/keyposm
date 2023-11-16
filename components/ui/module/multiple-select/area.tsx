import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react"
import {
    CommandDialog,
} from "@/components/ui/command"
import _ from "lodash";
import { AreaItem } from "@/lib/store/slices/areaSlice";
import Fuse from 'fuse.js';
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";

const options = {
    includeMatches: true,
    findAllMatches: true,
    threshold: 0.4,
    useExtendedSearch: true,
    ignoreLocation: false,
    name: "area",
    keys: [
        'areaName',
        'areaDescription',
        'areaCode'
    ]
};

var fuse: any = null;

type AreaComboboxProps = {
    open: boolean;
    value: AreaItem[];
    type?: "filter" | "combobox";
    data: AreaItem[] | []
    onChange: (value: AreaItem[]) => void;
    onClose: () => void;
}

export default function AreaCombobox({ value, open, type = "filter", data, onChange, onClose }: AreaComboboxProps) {
    const [search, setSearch] = useState("");
    const [listAreaFilter, setListAreaFilter] = useState<AreaItem[]>([]);
    const [listTemp, setListTemp] = useState<AreaItem[]>([]);

    console.log(value);

    useEffect(() => {
        setListTemp(value);
    }, [value])


    useEffect(() => {
        fuse = new Fuse(data, options);
        setListAreaFilter(data);
    }, [data])

    const onChangeTemp = (item: AreaItem) => {
        let list: AreaItem[] = _.cloneDeep(listTemp);
        let index = list.findIndex((x: AreaItem) => x.id === item.id);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(item);
        }
        setListTemp(list);
    }

    console.log(listTemp)

    const filterArea = _.debounce((query) => {
        let list: AreaItem[] = [];
        let areas = _.cloneDeep(data);
        if (query.trim().length === 0) {
            // setListAreaFilter(areas.slice(0, areas.length - 1));
            setListAreaFilter(areas);
        } else {
            let ids = fuse.search(query);
            ids.forEach(function (id: any) {
                list.push(id.item);
            });

            setListAreaFilter(list);
        }
    }, 500);

    return (
        <>
            <CommandDialog open={open} onOpenChange={() => {
                setSearch("");
                filterArea("");
                return onClose();
            }}>
                <div className="flex items-center border-b px-3">
                    <Search />
                    <input placeholder="Tìm kiếm vùng..." value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        filterArea(e.target.value);
                    }}
                        className="flex px-3 h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <ScrollArea className="h-96 w-full rounded-none border">
                    {listAreaFilter.length === 0 ? (
                        <div className="flex items-center justify-center h-11 w-full">
                            <span className="text-muted-foreground">Không tìm thấy vùng</span>
                        </div>
                    ) : (
                        <ul className="w-full">
                            {listAreaFilter && listAreaFilter.length > 0 && listAreaFilter.map((item: any, index: number) => {
                                // console.log(item);
                                return (
                                    <li key={index} className="h-11 flex items-center cursor-pointer" onClick={() => onChangeTemp(item)}>
                                        {listTemp.findIndex((x: AreaItem) => (x.id?.toString() === item.id.toString())) > -1 ? <div className="w-12 h-4 flex justify-center items-center">
                                            <Check />
                                        </div> : <div className="w-12 h-4"></div>}
                                        {item.areaName}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </ScrollArea>
                <div className="w-full px-4 py-2 flex justify-end">
                    <Button onClick={() => {
                        setSearch("");
                        filterArea("");
                        onChange(listTemp);
                        return onClose();
                    }}>Xác nhận</Button>
                </div>
            </CommandDialog>
        </>
    )
}