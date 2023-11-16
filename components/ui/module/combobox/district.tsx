import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react"

import { useAppSelector } from "@/lib/store";
import {
    CommandDialog,
} from "@/components/ui/command"
import _ from "lodash";
import { DistrictItem } from "@/lib/store/slices/districtSlice";
import Fuse from 'fuse.js';

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";

const options = {
    includeMatches: true,
    findAllMatches: true,
    threshold: 0.4,
    useExtendedSearch: true,
    ignoreLocation: false,
    name: "district",
    keys: [
        'districtName',
        'districtNameLatin',
        'provinceName'
    ]
};

var fuse: any = null;

type DistrictComboboxProps = {
    value?: string;
    onChange?: (value: string) => void;
    provinceCode: string;
    type?: "filter" | "combobox";
}

export default function DistrictCombobox({ value, provinceCode, onChange, type = "filter" }: DistrictComboboxProps) {
    const { dataDistrict } = useAppSelector((state) => state.district);
    // const { selectedProvince } = useAppSelector((state) => state.province);

    const [open, setOpen] = useState(false);
    const [listDistrictDropdown, setListDistrictDropdown] = useState<DistrictItem[]>([]);

    const [search, setSearch] = useState("");
    const [listDistrictFilter, setListDistrictFilter] = useState<DistrictItem[]>([]);


    useEffect(() => {
        let list = _.cloneDeep(dataDistrict);
        list = list.filter((item: any) => item.provinceCode === provinceCode);
        setListDistrictDropdown(list);
        return onChange && onChange("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceCode, dataDistrict])

    useEffect(() => {
        fuse = new Fuse(listDistrictDropdown, options);
        setListDistrictFilter(listDistrictDropdown);
    }, [listDistrictDropdown])

    const filterDistrict = _.debounce((query) => {
        let list: DistrictItem[] = [];
        let districtFilter = _.cloneDeep(listDistrictDropdown);
        if (query.trim().length === 0) {
            setListDistrictFilter(districtFilter.slice(0, districtFilter.length - 1));
        } else {
            let ids = fuse.search(query);
            ids.forEach(function (id: any) {
                list.push(id.item);
            });

            setListDistrictFilter(list);
        }
    }, 500);

    return (
        <>
            <Button disabled={listDistrictDropdown.length === 0 ? true : false} onClick={() => setOpen(true)} variant={"outline"} type="button" role="combobox" className="flex justify-between w-full truncate pr-2">
                <span className="pointer-events-none">{value ? value : "Chọn Quận/Huyện"}</span>
                <ChevronDown className="w-4 h-4" />
            </Button>
            <CommandDialog open={open} onOpenChange={() => {
                setOpen(false);
                setSearch("");
                filterDistrict("");
            }}>
                <div className="flex items-center border-b px-3">
                    <Search />
                    <input placeholder="Tìm kiếm Quận/Huyện..." value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        filterDistrict(e.target.value);
                    }}
                        className="flex px-3 h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <ScrollArea className="h-96 w-full rounded-none border">
                    {listDistrictFilter.length === 0 ? (
                        <div className="flex items-center justify-center h-11 w-full">
                            <span className="text-muted-foreground">Không tìm thấy Quận/huyện</span>
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
                                    filterDistrict("");
                                    onChange && onChange("")
                                }}

                            >
                                {value?.toLocaleLowerCase() === ("").toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                    <Check />
                                </div> : <div className="w-12 h-4"></div>}
                                {"Chọn Quận/Huyện"}
                            </li>
                            {listDistrictFilter && listDistrictFilter.length > 0 && listDistrictFilter.map((item: any, index: number) => {
                                return (
                                    <li key={index} className="h-11 flex items-center cursor-pointer" onClick={() => {
                                        setOpen(false);
                                        setSearch("");
                                        filterDistrict("");
                                        return onChange && onChange(item.districtName)
                                    }}>
                                        {value?.toLocaleLowerCase() === item.districtName.toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                            <Check />
                                        </div> : <div className="w-12 h-4"></div>}
                                        {item.districtName}
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