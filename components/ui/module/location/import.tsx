import { useState } from "react";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Terminal, AlertCircle } from "lucide-react"
import {
    Input
} from "@/components/ui/input";
import {
    axiosWithHeaders,
    axiosWithHeadersUploadFile
} from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import {
    NEXT_PUBLIC_UPLOAD_API,
    NEXT_PUBLIC_IMPORT_LOCATION
} from "@/config/api";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import {Label} from "@/components/ui/label"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Table from "@/components/ui/module/table";

type ImportLocationProps = {
    open: boolean,
    onClose: () => void,
    onRefresh: () => void
}

const columns = [
    {
        key: "0",
        field: "",
        title: "",
        width: 30
    },
    {
        key: "2",
        field: "code",
        title: "Mã địa điểm",
        width: 150
    },
    {
        key: "3",
        field: "locationName",
        title: "Địa điểm",
        width: 350
    },
    {
        key: "4",
        field: "province",
        title: "Tỉnh/Thành phố",
        width: 200
    },
    {
        key: "5",
        field: "district",
        title: "Quận/Huyện",
        width: 200
    },
    {
        key: "6",
        field: "ward",
        title: "Phường/ Xã",
        width: 200
    },
    {
        key: "7",
        field: "address",
        title: "Địa chỉ",
        width: 450
    },
    {
        key: "9",
        field: "contact",
        title: "Liên hệ",
        width: 300
    },
    {
        key: "8",
        field: "note",
        title: "Ghi chú",
        width: 300
    }
]

export default function ImportLocation({ open, onClose, onRefresh }: ImportLocationProps) {
    const [loadingFile, setLoadingFile] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const [resultError, setResultError] = useState<any>([]);

    const formSchema = z.object({
        fieldname: z.string().default(""),
        originalname: z.string().default(""),
        encoding: z.string().default(""),
        mimetype: z.string().default(""),
        destination: z.string().default(""),
        filename: z.string().default(""),
        path: z.string().default(""),
        size: z.number().default(0),
        filePath: z.string().default(""),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fieldname: "",
            originalname: "",
            encoding: "",
            mimetype: "",
            destination: "",
            filename: "",
            path: "",
            size: 0,
            filePath: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        let objImport = _.cloneDeep(values);
        setShowSuccess(false);
        setShowError(false);
        setResultError([]);
        setMessage("");
        axiosWithHeaders("post", NEXT_PUBLIC_IMPORT_LOCATION, objImport)
            .then((response) => {
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    const {
                        status,
                        message,
                        result
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        onRefresh && onRefresh();
                        setShowSuccess(true);
                        // onClose && onClose();
                    } else {
                        setShowError(true);
                        setMessage(message);
                        setResultError(result);
                    }
                }
            })
            .catch((err) => {
                setShowError(true);
                setMessage(err.toString());
                setResultError([]);
            })
            .finally(() => {
                setLoading(false);
                form.reset();
            })
    }

    async function onChangeFile(e: any) {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            var f = new FormData();
            f.append("file", file);
            setLoadingFile(true);
            await axiosWithHeadersUploadFile("post", NEXT_PUBLIC_UPLOAD_API, f)
                .then((response) => {
                    if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                        let {
                            fieldname,
                            originalname,
                            encoding,
                            mimetype,
                            destination,
                            filename,
                            path,
                            size,
                            filePath
                        } = response.data;
                        form.reset({
                            fieldname,
                            originalname,
                            encoding,
                            mimetype,
                            destination,
                            filename,
                            path,
                            size,
                            filePath
                        });
                        // if (field === "brandLogo") {
                        //     setFileLogo(`${IMAGE_URI}/${response.data.filePath}`);
                        // }

                        // if (field === "brandBackground") {
                        //     setFileBackground(`${IMAGE_URI}/${response.data.filePath}`);
                        // }
                        // form.setValue(field, response.data.filePath);
                        console.log(response.data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoadingFile(false);
                })
        }
    }

    return (
        <>
        <style jsx global>
                {`
                    .table-import .ka-table colgroup{
                        display: none;
                    }

                `}
            </style>
            <Dialog open={open} onOpenChange={() => {
                setShowSuccess(false);
                setShowError(false);
                setResultError([]);
                setMessage("");
                onClose();
            }}>
                <DialogContent className="sm:max-w-[700px] p-0">
                    <div className="p-0 relative z-10">
                        <DialogHeader className="relative z-10 p-6">
                            <DialogTitle>Import địa điểm</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3 bg-background rounded-md p-4 relative">
                                {showSuccess && (
                                    <Alert>
                                        <Terminal className="h-4 w-4" />
                                        <AlertTitle>Thông báo!</AlertTitle>
                                        <AlertDescription>
                                            Import thành công !
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {showError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Lỗi</AlertTitle>
                                        <AlertDescription>
                                            {message}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <div className="flex space-x-3">
                                    <div className="flex-1">
                                        <Input
                                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                            type="file"
                                            placeholder="Chọn tệp..."
                                            onChange={(e: any) => onChangeFile(e)}
                                        />
                                    </div>
                                    <div>
                                        <Button type="submit" disabled={loading || loadingFile}>Import</Button>
                                    </div>
                                </div>

                                {resultError.length > 0 && (
                                    <div className="table-import">
                                        <Table
                                            columns={columns}
                                            data={resultError}
                                            rowKeyField="code"
                                            headRow={{
                                                content: (props: any) => {
                                                    return (
                                                        <>
                                                            <th colSpan={props.columns.length} className="lg:hidden ka-thead-cell ka-thead-cell-height ka-thead-fixed bg-background z-40" style={{ padding: `0px`, height: 0 }}>

                                                            </th>
                                                        </>
                                                    )
                                                }
                                            }}

                                            dataRow={{
                                                elementAttributes: ({ isSelectedRow }: any) => {
                                                    return {
                                                        className: cn(
                                                            ` cursor-pointer lg:min-h-[40px] group`,
                                                            isSelectedRow ? `bg-accent` : `odd:bg-white even:bg-black/5`,
                                                        ),
                                                    }
                                                },
                                                content: (props: any) => {
                                                    return (
                                                        <>
                                                            <td colSpan={props.columns.length} className="w-full flex-1 relative">
                                                                <div className="w-full flex-col flex relative py-1">
                                                                    <div className="w-full h-full flex relative px-3">
                                                                        <div className="grid grid-cols-12 h-full w-full gap-x-2 space-y-1">
                                                                            <div className="col-span-12 justify-between h-full flex items-center">
                                                                                <Label className="text-sm truncate">Địa điểm: {props.rowData.locationName}</Label>
                                                                            </div>
                                                                            <div className="col-span-12 justify-between h-full flex items-center">
                                                                                <p className="text-sm text-muted-foreground font-normal truncate">Tỉnh thành: <Label className="text-foreground">{props.rowData.province}</Label></p>
                                                                            </div>
                                                                            <div className="col-span-12 justify-between h-full flex items-center">
                                                                                <p className="text-sm text-muted-foreground font-normal truncate">Quận/huyện: <Label className="text-foreground">{props.rowData.district}</Label></p>
                                                                            </div>
                                                                            <div className="col-span-12 justify-between h-full flex items-center">
                                                                                <p className="text-sm text-muted-foreground font-normal truncate">Địa chỉ: {props.rowData.address}</p>
                                                                            </div>
                                                                            {/* <div className="col-span-12 justify-between h-full flex items-center">
                                                                                <p className="text-sm text-muted-foreground font-normal truncate">Ghi chú: {props.rowData.note}</p>
                                                                            </div> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                        </>
                                                    )
                                                }
                                            }}
                                        />
                                    </div>

                                )}
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}