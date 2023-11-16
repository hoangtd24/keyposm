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

export type RoleItem = {
    id: string,
    roleName: string,
    disabled?: boolean,
}

type RoleDropdownProps = {
    value: string | undefined,
    listRole: RoleItem[] | [] | any,
    loading?: boolean,
    disabled?: boolean,
    onValueChange: (value: string) => void,
    type?: "filter" | "dropdown",
}

export default function RoleDropdown({ value, listRole, loading, disabled, onValueChange, type = "filter" }: RoleDropdownProps) {
    return (
        <Select onValueChange={onValueChange} value={value}>
            <FormControl>
                <SelectTrigger disabled={loading || disabled}>
                    <SelectValue>
                        {listRole.map((item: any) => {
                            if (item.id === value) {
                                return item.roleName;
                            }
                        })}
                    </SelectValue>
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {listRole.map((item: any, index: number) => {
                    if (type === "filter") {
                        return (
                            <SelectItem key={index} value={item.id}>{item.roleName}</SelectItem>
                        )
                    }else{
                        return (
                            <SelectItem key={index} value={item.id} disabled={item?.disabled}>{item.roleName}</SelectItem>
                        )
                    }                    
                })}
            </SelectContent>
        </Select>
    );
}

//sẽ xử lý sau