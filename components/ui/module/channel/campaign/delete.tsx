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
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { ChannelItem, setListChannelCampaign } from "@/lib/store/slices/channelSlice";
import _ from "lodash";

import {
    NEXT_PUBLIC_DELETE_CHANNEL_API
} from "@/config/api";

export default function DeleteChannelCampaign({ id, open, onClose }: { id: number, open: boolean, onClose: () => void, }) {
    const dispatch = useAppDispatch();
    const { listChannelCampaign } = useAppSelector(state => state.channel);
    const { toast } = useToast();

    async function handleDelete() {
        // console.log(id);
        axiosWithHeaders("post", NEXT_PUBLIC_DELETE_CHANNEL_API, { id: id })
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Xóa kênh thành công !",
                        })
                        let list: ChannelItem[] = _.cloneDeep(listChannelCampaign ? listChannelCampaign : []);
                        let index = list.findIndex((item: ChannelItem) => item.id === id);
                        list.splice(index, 1);
                        dispatch(setListChannelCampaign(list));
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
                    <AlertDialogTitle>Xác nhận xóa kênh?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa kênh này khỏi chiến dịch không ?
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