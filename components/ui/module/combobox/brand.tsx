import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react"
import {
    CommandDialog,
} from "@/components/ui/command"
import _ from "lodash";
import Fuse from 'fuse.js';
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store";

const options = {
    includeMatches: true,
    findAllMatches: true,
    threshold: 0.4,
    useExtendedSearch: true,
    ignoreLocation: false,
    name: "brand",
    keys: [
        'brandName',
    ]
};

var fuse: any = null;

type BrandItem = {
    id: number,
    brandName: string,
    brandLogo?: string 
}

type BrandComboboxProps = {
    value?: string;
    onChange?: (value: string) => void;
    type?: "filter" | "combobox";
    disabled?: boolean;
}

export default function BrandCombobox({ value, onChange, type = "filter", disabled }: BrandComboboxProps) {
    const { dataBrand } = useAppSelector((state) => state.brand);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [listBrandFilter, setListBrandFilter] = useState<BrandItem[]>([]);

    useEffect(() => {
        fuse = new Fuse(dataBrand, options);
        setListBrandFilter(dataBrand);
    }, [dataBrand])

    const filterCampaign = _.debounce((query) => {
        let list: BrandItem[] = [];
        let areas = _.cloneDeep(dataBrand);
        if (query.trim().length === 0) {
            // setListAreaFilter(areas.slice(0, areas.length - 1));
            setListBrandFilter(areas);
        } else {
            let ids = fuse.search(query);
            ids.forEach(function (id: any) {
                list.push(id.item);
            });

            setListBrandFilter(list);
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
                disabled={(dataBrand.length === 0 || disabled) ? true : false}
            >
                <span className="pointer-events-none">{value === "0" ? "Chọn thương hiệu" : (
                    dataBrand.find((item: any) => item.id.toString() === value)?.brandName
                )}</span>
                <ChevronDown className="w-4 h-4" />
            </Button>
            <CommandDialog open={open} onOpenChange={() => {
                setOpen(false);
                setSearch("");
                filterCampaign("");
            }}>
                <div className="flex items-center border-b px-3">
                    <Search />
                    <input placeholder="Tìm kiếm thương hiệu..." value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        filterCampaign(e.target.value);
                    }}
                        className="flex px-3 h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <ScrollArea className="h-96 w-full rounded-none border">
                    {listBrandFilter.length === 0 ? (
                        <div className="flex items-center justify-center h-11 w-full">
                            <span className="text-muted-foreground">Không tìm thấy thương hiệu</span>
                        </div>
                    ) : (
                        <ul className="w-full">
                            <li
                                className={
                                    cn(
                                        "h-11 flex items-center cursor-pointer",
                                        type === "combobox" && "cursor-not-allowed opacity-50 pointer-events-none"
                                    )
                                }
                                onClick={() => {
                                    // dispatch(setSelectedProvince(item.code))
                                    setOpen(false);
                                    setSearch("");
                                    filterCampaign("");
                                    onChange && onChange("0")
                                }}

                            >
                                {value?.toLocaleLowerCase() === ("0").toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                    <Check />
                                </div> : <div className="w-12 h-4"></div>}
                                {"Chọn thương hiệu"}
                            </li>
                            {listBrandFilter && listBrandFilter.length > 0 && listBrandFilter.map((item: BrandItem, index: number) => {
                                return (
                                    <li key={index} className="h-11 flex items-center cursor-pointer" onClick={() => {
                                        setOpen(false);
                                        setSearch("");
                                        filterCampaign("");
                                        onChange && onChange(item.id.toString())
                                    }}>
                                        {value?.toLocaleLowerCase() === item.id.toString().toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                            <Check />
                                        </div> : <div className="w-12 h-4"></div>}
                                        {item.brandName}
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