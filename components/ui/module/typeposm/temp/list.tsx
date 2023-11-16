"use client";
import { useAppSelector } from "@/lib/store";
import {
    CreateTempTypePosm,
    UpdateTempTypePosm
} from "@/components/ui/module/typeposm";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EmptyAnimation from "@/components/ui/module/animate/empty";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { TypeDefaultItem, setTempPosmData } from "@/lib/store/slices/typeDefaultSlice";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/lib/store";
import _ from "lodash";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TypeDefaultMultipleSelect } from "@/components/ui/module/multiple-select";

type ListTempTypePosmDefaultProps = {
    listTypePosmDefault: TypeDefaultItem[] | [];
}

export default function ListTempTypePosmDefault({ listTypePosmDefault }: ListTempTypePosmDefaultProps) {
    const dispatch = useAppDispatch();
    const { listTempPosm } = useAppSelector(state => state.typeDefault);
    const [open, setOpen] = useState<boolean>(false);
    const [openCreate, setOpenCreate] = useState<boolean>(false);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [detail, setDetail] = useState<TypeDefaultItem | null>(null);

    const [listRender, setListRender] = useState<TypeDefaultItem[]>([]);
    const [allowAdd, setAllowAdd] = useState<boolean>(false);

    // useEffect(() => {
    //     let listRender = _.cloneDeep(listTempPosm);
    //     const existAdd = listRender.findIndex((item: TypeDefaultItem) => item.tempId === 0);
    //     if (existAdd > -1) {
    //         setAllowAdd(true);
    //     }

    //     listRender = listRender.filter((item: TypeDefaultItem) => item.tempId !== 0);
    //     // console.log(listRender, listTempPosm);
    //     setListRender(listRender);
    // }, [listTempPosm])

    if (listTempPosm.length === 0) {
        return (
            <div className="w-full min-h-[300px] space-y-1.5 flex flex-col items-center justify-center">
                <div>
                    <EmptyAnimation />
                </div>
                <div>
                    <Label>Bạn chưa chọn loại posm mặc định nào</Label>
                </div>
                <div className="space-x-2">
                    <Button type="button" variant={`outline`} onClick={() => {
                        setOpenCreate(true)
                    }}>Thêm</Button>
                    <Button type="button" variant={`outline`} onClick={() => {
                        setOpen(true)
                    }}>Chọn...</Button>

                </div>
                <TypeDefaultMultipleSelect
                    data={listTypePosmDefault}
                    value={listTempPosm}
                    open={open}
                    onClose={() => setOpen(false)}
                    onChange={(value) => {
                        let list: TypeDefaultItem[] = _.cloneDeep(value);
                        list.map((item: TypeDefaultItem) => {
                            item.tempId = item.tempId;
                        })
                        dispatch(setTempPosmData(list));
                    }}
                />
                <CreateTempTypePosm
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                />

            </div>
        )
    }

    const handleEdit = (item: TypeDefaultItem) => {
        setDetail(item);
        // console.log(item);
        setOpenUpdate(true);
    }

    const handleDelete = (tempId: number | undefined) => {
        let listTypePosm: TypeDefaultItem[] = _.cloneDeep(listTempPosm);
        let index = listTypePosm.findIndex(item => item.tempId === tempId);
        // console.log(listTempPosm, index);
        listTypePosm.splice(index, 1);
        dispatch(setTempPosmData(listTypePosm));
    }

    return (
        <>
            <div className="w-full space-y-2 mb-2">
                <div className={cn(
                    "flex justify-between items-center",
                )}>
                    <Label>Tổng cộng: {listRender.length}</Label>
                    <div className="space-x-2">
                        <Button type="button" onClick={() => {
                            setOpenCreate(true)
                        }}>Thêm</Button>
                        <Button type="button" variant={`outline`} onClick={() => {
                            setOpen(true)
                        }}>Chọn thêm...</Button>
                    </div>
                </div>
                <div className="mb-4">
                    <ScrollArea className="h-[500px] w-full rounded-none overflow-y-auto overflow-x-hidden ">
                        {listTempPosm.map((item: TypeDefaultItem, index: number) => (
                            <Card key={index} className={index !== listTempPosm.length - 1 ? "mb-2" : ""}>
                                <CardContent className="w-full flex flex-col space-y-1.5 py-3 truncate relative overflow-x-hidden overflow-y-auto">
                                    <Label className="text-lg truncate">{item.posmTypeName}</Label>
                                    <p className="text-sm text-muted-foreground font-normal truncate">{item.posmTypeDescription}</p>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex justify-start items-center space-x-0 text-sm">
                                        {item.manualAdd && (
                                            <>
                                                <Button onClick={() => handleEdit(item)} variant={`link`} className="px-3 pl-0 py-0 h-auto">
                                                    Sửa
                                                </Button>
                                                <Separator orientation="vertical" className="bg-foreground h-4 w-[1px]" />
                                            </>

                                        )}
                                        <Button onClick={() => handleDelete(item.tempId)} variant={`link`} className={
                                            cn(
                                                "px-3 py-0 h-auto",
                                                {
                                                    "pl-0": !item.manualAdd
                                                }
                                            )
                                        }>
                                            Xóa
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </ScrollArea>
                </div>
            </div>
            <TypeDefaultMultipleSelect
                data={listTypePosmDefault}
                value={listTempPosm}
                open={open}
                onClose={() => setOpen(false)}
                onChange={(value) => {
                    let list: TypeDefaultItem[] = _.cloneDeep(value);
                    list.map((item: TypeDefaultItem) => {
                        item.tempId = item.tempId;
                    })
                    dispatch(setTempPosmData(list));
                }}
            />
            <CreateTempTypePosm
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />

            <UpdateTempTypePosm
                open={openUpdate}
                detail={detail}
                onClose={() => setOpenUpdate(false)}
            />
        </>
    )
}