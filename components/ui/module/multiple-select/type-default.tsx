import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react"

import { useAppSelector } from "@/lib/store";
import {
    CommandDialog,
} from "@/components/ui/command"
import _ from "lodash";
import { TypeDefaultItem } from "@/lib/store/slices/typeDefaultSlice";
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
        'posmTypeName',
        'posmTypeDescription',
    ]
};

var fuse: any = null;

type TypeDefaultMultipleSelectProps = {
    open: boolean;
    value: TypeDefaultItem[];
    type?: "filter" | "combobox";
    data: TypeDefaultItem[] | []
    onChange: (value: TypeDefaultItem[]) => void;
    onClose: () => void;
}

export default function TypeDefaultMultipleSelect({ value, open, type = "filter", data, onChange, onClose }: TypeDefaultMultipleSelectProps) {
    const [search, setSearch] = useState("");
    const [listAreaFilter, setListAreaFilter] = useState<TypeDefaultItem[]>([]);
    const [listTemp, setListTemp] = useState<TypeDefaultItem[]>([]);

    useEffect(() => {
        setListTemp(value);
    }, [value])


    useEffect(() => {
        fuse = new Fuse(data, options);
        setListAreaFilter(data);
    }, [data])

    const onChangeTemp = (item: TypeDefaultItem) => {
        console.log(item);
        let list: TypeDefaultItem[] = _.cloneDeep(listTemp);
        let index = list.findIndex((x: TypeDefaultItem) => x.tempId === item.tempId);
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(item);
        }
        setListTemp(list);
    }

    const filterTypePosmDefault = _.debounce((query) => {
        let list: TypeDefaultItem[] = [];
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
                filterTypePosmDefault("");
                onClose();
            }}>
                <div className="flex items-center border-b px-3">
                    <Search />
                    <input placeholder="Tìm kiếm loại posm mặc định..." value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        filterTypePosmDefault(e.target.value);
                    }}
                        className="flex px-3 h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <ScrollArea className="h-96 w-full rounded-none border">
                    {listAreaFilter.length === 0 ? (
                        <div className="flex items-center justify-center h-11 w-full">
                            <span className="text-muted-foreground">Không tìm thấy loại posm mặc định</span>
                        </div>
                    ) : (
                        <ul className="w-full">
                            {listAreaFilter && listAreaFilter.length > 0 && listAreaFilter.map((item: TypeDefaultItem, index: number) => {
                                // console.log(listTemp, item)
                                return (
                                    <li key={index} className="h-11 flex items-center cursor-pointer" onClick={() => onChangeTemp(item)}>
                                        {listTemp.findIndex((x: TypeDefaultItem) => x.posmTypeName.toLocaleLowerCase() === item.posmTypeName.toLocaleLowerCase()) > -1 ? <div className="w-12 h-4 flex justify-center items-center">
                                            <Check />
                                        </div> : <div className="w-12 h-4"></div>}
                                        {item.posmTypeName}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </ScrollArea>
                <div className="w-full px-4 py-2 flex justify-end">
                    <Button onClick={() => {
                        setSearch("");
                        filterTypePosmDefault("");
                        onChange(listTemp);
                        return onClose();
                    }}>Xác nhận</Button>
                </div>
            </CommandDialog>
        </>
    )
}