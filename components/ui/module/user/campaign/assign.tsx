"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import _ from "lodash"
import FilterAssignUser from "@/components/ui/module/filter/campaign/user/assign";

type AssignUserProps = {
    campaignId: string,
    open: boolean,
    onClose: () => void,
    onRefresh: () => void
}


export default function AssignUser({ campaignId, open, onClose, onRefresh }: AssignUserProps) {
    return (
        <>
            <Dialog open={open} onOpenChange={() => {
                return onClose();
            }}>
                <DialogContent className="sm:max-w-[700px] px-4">
                    <DialogHeader className="relative z-10">
                        <DialogTitle>Chỉ định nhân viên vào chiến dịch</DialogTitle>
                    </DialogHeader>
                    <FilterAssignUser campaignId={campaignId} onClose={onClose} onRefresh={onRefresh}/>
                </DialogContent>
            </Dialog>
        </>
    )
}