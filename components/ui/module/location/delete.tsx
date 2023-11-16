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
import { setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import { useAppDispatch } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";
import _ from "lodash"

import {
    NEXT_PUBLIC_DELETE_LOCATION_API,
    NEXT_PUBLIC_DELETE_MULTIPLE_LOCATION_API
} from "@/config/api";

type DeleteLocationProps = {
    id: number | number[] | null,
    open: boolean,
    onClose: () => void;
    onRefresh: () => void;
}

function DeleteLocation({ id, open, onClose, onRefresh }: DeleteLocationProps) {
    const { toast } = useToast();

    async function handleDelete() {
        console.log(id);
        axiosWithHeaders("post", NEXT_PUBLIC_DELETE_LOCATION_API, { id: id })
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Xóa địa điểm thành công !",
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
                    <AlertDialogTitle>Xác nhận xóa địa điểm</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có muốn xóa địa điểm khỏi hệ thống không ?
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

function DeleteMultipleLocation({ id, open, onClose, onRefresh }: DeleteLocationProps) {
    const { toast } = useToast();

    async function handleDelete() {
        console.log(id);
        axiosWithHeaders("post", NEXT_PUBLIC_DELETE_MULTIPLE_LOCATION_API, { ids: id })
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        toast({
                            title: "Thông báo",
                            description: "Xóa nhiều địa điểm thành công !",
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
                    <AlertDialogTitle>Xác nhận xóa địa điểm</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có muốn xóa {_.isArray(id) && id.length} địa điểm khỏi hệ thống không ?
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

export {
    DeleteLocation,
    DeleteMultipleLocation
}