import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import { Check, Search, ChevronDown } from "lucide-react"
import { useAppSelector } from "@/lib/store";
import {
    Command,
    CommandDialog,
} from "@/components/ui/command";
import { useAppDispatch } from "@/lib/store";
import { setSelectedProvince } from "@/lib/store/slices/provinceSlice";
import Fuse from 'fuse.js';
import { ProvinceItem } from "@/lib/store/slices/provinceSlice";
import _ from "lodash";
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";

const options = {
    includeMatches: true,
    findAllMatches: true,
    threshold: 0.4,
    useExtendedSearch: true,
    ignoreLocation: false,
    name: "province",
    keys: [
        'provinceName',
        'provinceNameLatin',
    ]
};

var fuse: any = null;

type ProvinceComboboxProps = {
    value?: string;
    onChange?: (value: string, provinceCode: string) => void;
    type?: "filter" | "combobox";
}

export default function ProvinceCombobox({ value, onChange, type = "filter" }: ProvinceComboboxProps) {
    const { dataProvince } = useAppSelector((state) => state.province);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [listProvinceFilter, setListProvinceFilter] = useState<ProvinceItem[]>([]);
    // console.log(dataProvince)
    useEffect(() => {
        fuse = new Fuse(dataProvince, options);
        setListProvinceFilter(dataProvince);
    }, [dataProvince])

    const filterProvince = _.debounce((query) => {
        let list: ProvinceItem[] = [];
        let provinces = _.cloneDeep(dataProvince);
        if (query.trim().length === 0) {
            setListProvinceFilter(provinces.slice(0, provinces.length - 1));
        } else {
            let ids = fuse.search(query);
            ids.forEach(function (id: any) {
                list.push(id.item);
            });

            setListProvinceFilter(list);
        }
    }, 500);

    return (
        <>
            <Button onClick={() => setOpen(true)} variant={"outline"} type="button" role="combobox" className="flex justify-between w-full truncate pr-2">
                <span className="pointer-events-none">{value ? value : "Chọn tỉnh thành"}</span>
                <ChevronDown className="w-4 h-4" />
            </Button>
            <CommandDialog open={open} onOpenChange={() => {
                setOpen(false);
                setSearch("");
                filterProvince("");
            }}>
                <div className="flex items-center border-b px-3">
                    <Search />
                    <input placeholder="Tìm kiếm tỉnh thành..." value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        filterProvince(e.target.value);
                    }}
                        className="flex px-3 h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <ScrollArea className="h-96 w-full rounded-none border">
                    {listProvinceFilter.length === 0 ? (
                        <div className="flex items-center justify-center h-11 w-full">
                            <span className="text-muted-foreground">Không tìm thấy tỉnh thành</span>
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
                                    filterProvince("");
                                    onChange && onChange("", "")
                                }}

                            >
                                {value?.toLocaleLowerCase() === ("").toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                    <Check />
                                </div> : <div className="w-12 h-4"></div>}
                                {"Chọn tỉnh thành"}
                            </li>
                            {listProvinceFilter && listProvinceFilter.length > 0 && listProvinceFilter.map((item: any, index: number) => {
                                return (
                                    <li key={index} className="h-11 flex items-center cursor-pointer" onClick={() => {
                                        // dispatch(setSelectedProvince(item.code))
                                        setOpen(false);
                                        setSearch("");
                                        filterProvince("");
                                        onChange && onChange(item.provinceName, item.code)
                                    }}>
                                        {value?.toLocaleLowerCase() === item.provinceName.toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                            <Check />
                                        </div> : <div className="w-12 h-4"></div>}
                                        {item.provinceName}
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