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
    RESTORE_AREA_API
} from "@/config/api";

type RestoreAreaProps = {
    id: number,
    open: boolean,
    onClose: () => void,
    onRefresh: () => void
}

export default function RestoreArea({ id, open, onClose, onRefresh }: RestoreAreaProps) {
    const { toast } = useToast();

    async function handleRestore() {
        // console.log(id);
        axiosWithHeaders("post", RESTORE_AREA_API, { id: id })
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Khôi phục vùng thành công !",
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
                    <AlertDialogTitle>Xác nhận khôi phục vùng?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn khôi vục vùng này không ?
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