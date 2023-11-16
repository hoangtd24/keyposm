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
    name: "campaign",
    keys: [
        'campaignName',
    ]
};

var fuse: any = null;

export type CampaignItem = {
    id: number,
    campaignName: string,
    brandId: number,
}

type CampaignComboboxProps = {
    value: string;
    onChange: (value: string) => void;
    data: CampaignItem[] | [];
    type?: "filter" | "combobox";
}

export default function CampaignCombobox({ value, data, onChange, type = "filter" }: CampaignComboboxProps) {
    // const { dataCampaign } = useAppSelector((state) => state.campaign);


    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [listCampaignFilter, setListCampaignFilter] = useState<CampaignItem[]>([]);

    useEffect(() => {
        fuse = new Fuse(data, options);
        setListCampaignFilter(data);
    }, [data])

    const filterCampaign = _.debounce((query) => {
        let list: CampaignItem[] = [];
        let areas = _.cloneDeep(data);
        if (query.trim().length === 0) {
            // setListAreaFilter(areas.slice(0, areas.length - 1));
            setListCampaignFilter(areas);
        } else {
            let ids = fuse.search(query);
            ids.forEach(function (id: any) {
                list.push(id.item);
            });

            setListCampaignFilter(list);
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
                <span className="pointer-events-none">{value === "0" ? "Chọn chiến dịch" : (
                    data.find((item: any) => item.id.toString() === value)?.campaignName
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
                    <input placeholder="Tìm kiếm chiến dịch..." value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        filterCampaign(e.target.value);
                    }}
                        className="flex px-3 h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <ScrollArea className="h-96 w-full rounded-none border">
                    {listCampaignFilter.length === 0 ? (
                        <div className="flex items-center justify-center h-11 w-full">
                            <span className="text-muted-foreground">Không tìm thấy chiến dịch</span>
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
                                    filterCampaign("");
                                    onChange && onChange("0")
                                }}

                            >
                                {value?.toLocaleLowerCase() === ("0").toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                    <Check />
                                </div> : <div className="w-12 h-4"></div>}
                                {"Chọn chiến dịch"}
                            </li>
                            {listCampaignFilter && listCampaignFilter.length > 0 && listCampaignFilter.map((item: any, index: number) => {
                                return (
                                    <li key={index} className="h-11 flex items-center cursor-pointer" onClick={() => {
                                        setOpen(false);
                                        setSearch("");
                                        filterCampaign("");
                                        onChange && onChange(item.id)
                                    }}>
                                        {value?.toLocaleLowerCase() === item.id.toString().toLocaleLowerCase() ? <div className="w-12 h-4 flex justify-center items-center">
                                            <Check />
                                        </div> : <div className="w-12 h-4"></div>}
                                        {item.campaignName}
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