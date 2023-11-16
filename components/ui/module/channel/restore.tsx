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
import { useToast } from "@/components/ui/use-toast";
import _ from "lodash";

import {
    RESTORE_CHANNEL_API
} from "@/config/api";

export default function RestoreChannelCampaign({ id, open, onClose, onRefresh }: { id: number, open: boolean, onClose: () => void, onRefresh: () => void }) {
    const { toast } = useToast();

    async function handleRestore() {
        console.log(id);
        axiosWithHeaders("post", RESTORE_CHANNEL_API, { id: id })
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Khôi phục kênh thành công !",
                        })
                        
                        onRefresh && onRefresh();
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
                    <AlertDialogTitle>Xác nhận khôi phục kênh?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn khôi vục kênh này không ?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestore}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}