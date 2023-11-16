"use client";
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
import { NEXT_PUBLIC_API_ADMIN_RESET_PASSWORD } from "@/config/api";

export type AccountProps = {
    username: string;
    password: string;
}

type ConfirmChangePasswordProps = {
    account: AccountProps;
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}

export default function ConfirmChangePassword({ account, open, onClose, onRefresh }: ConfirmChangePasswordProps) {
    const { toast } = useToast();

    async function handleDelete() {
        console.log(account);
        axiosWithHeaders("post", NEXT_PUBLIC_API_ADMIN_RESET_PASSWORD, account)
        .then((response)=> {
            if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                const {
                    status,
                    message,
                } = response.data;
                if (status === enums.STATUS_RESPONSE_OK) {
                    toast({
                        title: "Thông báo",
                        description: "Làm mới mật khẩu thành công !",
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
        .catch((error)=> {
            console.log(error);
        })
        .finally(()=> {
            onClose();
        })
    }


    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận đổi mật khẩu</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có muốn làm mới mật khẩu của tài khoản <b>{account && account.username}</b> không ?
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