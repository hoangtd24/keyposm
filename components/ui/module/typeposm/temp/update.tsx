"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

// import { axiosWithHeaders } from "@/lib/axiosWrapper";
// import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setTempPosmData, TypeDefaultItem } from "@/lib/store/slices/typeDefaultSlice";
import moment from "moment";

type UpdateTempAreaProps = {
    open: boolean;
    detail?: TypeDefaultItem | null
    onClose: () => void;
}

export default function UpdateTempTypePosm({ open, onClose, detail }: UpdateTempAreaProps) {
    const { toast } = useToast();
    const { listTempPosm } = useAppSelector(state => state.typeDefault);
    const dispatch = useAppDispatch();

    const formSchema = z.object({
        tempId: z.number().optional(),
        posmTypeName: z.string(),
        posmTypeDescription: z.string(),
        manualAdd: z.boolean().optional(),
    })

    // console.log(open, brandId)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tempId: 0,
            posmTypeName: "",
            posmTypeDescription: "",
            manualAdd: false
        },
    })

    useEffect(() => {
        if (detail) {
            form.reset({
                posmTypeName: detail.posmTypeName,
                posmTypeDescription: detail.posmTypeDescription,
                manualAdd: detail.manualAdd
            })

            if(detail.tempId){
                form.setValue("tempId", parseInt(detail.tempId.toString()));
            }
            // console.log(detail);
        }
        //eslint-disable-next-line
    }, [detail])

    // const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        let objCreate = _.cloneDeep(values);
        console.log(objCreate);
        setLoading(true);
        let listTempPosmData: TypeDefaultItem[] = _.cloneDeep(listTempPosm);
        let id = detail?.tempId;
        let index = listTempPosmData.findIndex(item => item.tempId === id);
        listTempPosmData[index] = objCreate;
        dispatch(setTempPosmData(listTempPosmData));
        setLoading(false);
        form.reset();
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            // setOpen(!open)
            form.reset();
            return onClose();
        }}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <div className="p-0 relative z-10">
                    <DialogHeader className="relative z-10 p-6">
                        <DialogTitle>Cập nhật loại Posm</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-6 space-y-6 bg-background pt-8 rounded-md">
                            <FormField
                                control={form.control}
                                name="posmTypeName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại Posm</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập loại Posm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="posmTypeDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả loại Posm</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Nhập mô tả loại Posm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="space-y-4">
                                <Button type="submit" disabled={(loading) ? true : false}>
                                    {(loading) && (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Xác nhận
                                </Button>
                            </DialogFooter>
                        </form>

                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}