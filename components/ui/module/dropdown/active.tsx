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

export type ActiveItem = {
    value: string,
    label: string
    disabled?: boolean,
}

type ActiveDropdownProps = {
    value: string | undefined,
    disabled?: boolean,
    onValueChange: (value: string) => void,
}

const listRowStatus: ActiveItem[] = [
    {
        value: "true",
        label: "Đang hoạt động",
    },
    {
        value: "false",
        label: "Dừng hoạt động",
    }
]

export default function ActiveDropdown({ value, disabled, onValueChange }: ActiveDropdownProps) {
    return (
        <Select onValueChange={onValueChange} value={value}>
            <FormControl>
                <SelectTrigger disabled={disabled}>
                    <SelectValue>
                        {listRowStatus.map((item: any) => {
                            if (item.value === value) {
                                return item.label;
                            }
                        })}
                    </SelectValue>
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {listRowStatus.map((item: any, index: number) => {
                    return (
                        <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
}

//sẽ xử lý sau