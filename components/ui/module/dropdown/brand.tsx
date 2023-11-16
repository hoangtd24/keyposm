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

export type BrandItem = {
    id: string,
    brandName: string,
    brandLogo: string,
    disabled?: boolean,
}

type BrandDropdownProps = {
    value: string | undefined,
    listBrand: BrandItem[] | [] | any,
    loading?: boolean,
    disabled?: boolean,
    onValueChange: (value: string) => void,
    type?: "filter" | "dropdown",
}

export default function BrandDropdown({ value, listBrand, loading, disabled, onValueChange, type = "filter" }: BrandDropdownProps) {
    return (
        <Select onValueChange={onValueChange} value={value}>
            <FormControl>
                <SelectTrigger disabled={loading || disabled}>
                    <SelectValue>
                        {listBrand.map((item: any) => {
                            if (item.id === value) {
                                return item.brandName;
                            }
                        })}
                    </SelectValue>
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {listBrand.map((item: any, index: number) => {
                    if (type === "filter") {
                        return (
                            <SelectItem key={index} value={item.id}>{item.brandName}</SelectItem>
                        )
                    } else {
                        return (
                            <SelectItem key={index} value={item.id} disabled={item?.disabled}>{item.brandName}</SelectItem>
                        )
                    }
                })}
            </SelectContent>
        </Select>
    );
}

//sẽ xử lý sau