import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    FormControl
} from "@/components/ui/form";

import { CampaignTypeItem } from "@/lib/store/slices/campaignSlice";

type CampaignTypeDropdownProps = {
    value: string | undefined,
    listCampaignType: CampaignTypeItem[] | [] | any,
    loading?: boolean,
    disabled?: boolean,
    onValueChange: (value: string) => void,
    type?: "filter" | "dropdown",
}

export default function CampaignTypeDropdown({ value, listCampaignType, loading, disabled, onValueChange, type = "filter" }: CampaignTypeDropdownProps) {
    return (
        <Select onValueChange={onValueChange} value={value}>
            <FormControl>
                <SelectTrigger disabled={loading || disabled}>
                    <SelectValue>
                        {(value === "0" || value?.trim() === '') ? "Chọn loại chiến dịch" : listCampaignType.map((item: CampaignTypeItem) => {
                            if (item.id.toString() === value) {
                                return item.typeName;
                            }
                        })}
                    </SelectValue>
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {listCampaignType.map((item: CampaignTypeItem, index: number) => {
                    if (type === "filter") {
                        return (
                            <SelectItem key={index} value={item.id.toString()}>{item.typeName}</SelectItem>
                        )
                    } else {
                        return (
                            <SelectItem key={index} value={item.id.toString()} disabled={item?.disabled}>{item.typeName}</SelectItem>
                        )
                    }
                })}
            </SelectContent>
        </Select>
    );
    // return null;
}
