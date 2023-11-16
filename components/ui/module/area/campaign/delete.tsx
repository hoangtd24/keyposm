import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
// import { setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { AreaItem, setListAreaCampaign } from "@/lib/store/slices/areaSlice";
import _ from "lodash";

import {
    NEXT_PUBLIC_DELETE_AREA_API
} from "@/config/api";

export default function DeleteAreaCampaign({ id, open, onClose }: { id: number, open: boolean, onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { listAreaCampaign } = useAppSelector(state => state.area);
    const { toast } = useToast();

    async function handleDelete() {
        // console.log(id);
        axiosWithHeaders("post", NEXT_PUBLIC_DELETE_AREA_API, { id: id })
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Xóa vùng thành công !",
                        })
                        let list: AreaItem[] = _.cloneDeep(listAreaCampaign ? listAreaCampaign : []);
                        let index = list.findIndex((item: AreaItem) => item.id === id);
                        list.splice(index, 1);
                        dispatch(setListAreaCampaign(list));
                        // dispatch(setTableTimeStamp(moment().valueOf()));
                    } else {
                        toast({
                            title: "Thông báo",
                            description: message,
                        })
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                onClose();
            })
    }


    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa vùng?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa vùng này khỏi chiến dịch không ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}