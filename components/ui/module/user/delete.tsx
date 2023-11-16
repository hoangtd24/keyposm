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
import { NEXT_PUBLIC_API_ADMIN_DELETE_USER } from "@/config/api";

export default function DeleteUser({ username, open, onClose, onRefresh }: { username: string, open: boolean, onClose: () => void, onRefresh?: () => void }) {
    const { toast } = useToast();

    async function handleDelete() {
        console.log(username);
        axiosWithHeaders("post", NEXT_PUBLIC_API_ADMIN_DELETE_USER, { username })
        .then((response)=> {
            if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                const {
                    status,
                    message,
                } = response.data;
                if (status === enums.STATUS_RESPONSE_OK) {
                    toast({
                        title: "Thông báo",
                        description: "Xóa nhân viên thành công !",
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
                    <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có muốn xóa tài khoản <b>{username}</b> khỏi hệ thống không ?
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