import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  ChannelCombobox,
  AreaCombobox
} from "@/components/ui/module/combobox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"

import { NEXT_PUBLIC_CREATE_LIST_LOCATION_CAMPAIGN } from "@/config/api";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/store";
import { DataType, Table } from 'ka-table';
import { EditingMode } from 'ka-table/enums';
import { cn } from "@/lib/utils";
import { closeEditor, updateCellValue } from 'ka-table/actionCreators';
import { ICellEditorProps } from 'ka-table/props';
import { useToast } from "@/components/ui/use-toast";
import { AreaItem } from "@/lib/store/slices/areaSlice";
import { Card, CardContent } from "@/components/ui/card";

type ImportLocationProps = {
  open: boolean
  onClose: () => void,
  onParentRefresh?: () => void,
  data: any,
  campaignId: string
}

export default function DialogImportSelected({ open, onClose, onParentRefresh, data, campaignId }: ImportLocationProps) {
  const { toast } = useToast();
  // const [loadingArea, setLoadingArea] = useState<boolean>(false);
  // const [dataArea, setDataArea] = useState<any>([]);

  // const [loadingChannel, setLoadingChannel] = useState<boolean>(false);
  // const [dataChannel, setDataChannel] = useState<any>([]);
  const { listDropdownArea } = useAppSelector(state => state.area);
  const { listDropdownChannel } = useAppSelector(state => state.channel);

  const [listAreaFilter, setListAreaFilter] = useState<AreaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // console.log("data", listDropdownArea);

  const formSchema = z.object({
    campaignId: z.string(),
    areaId: z.string().refine((value) => value !== "0", {
      message: "Vùng không được để trống !"
    }),
    channelId: z.string().refine((value) => value !== "0", {
      message: "Kênh không được để trống !"
    }),
    listLocation: z.array(
      z.object({
        locationId: z.number(),
        total: z.number(),
      })
    ).optional().default([]),
  })

  const [tempEdit, setTempEdit] = useState<any>([]);

  useEffect(() => {
    setTempEdit(data);
  }, [data])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignId: "0",
      areaId: "0",
      channelId: "0",
      listLocation: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let objImport = _.cloneDeep(values);
    objImport.campaignId = campaignId;

    // console.log("data", tempEdit);
    let listLocation: any = [];
    tempEdit.forEach((item: any) => {
      listLocation.push({
        locationId: item.id,
        total: item.total,
      })
    })
    objImport.listLocation = listLocation;

    console.log("objImport", objImport);
    setLoading(true);
    axiosWithHeaders("post", NEXT_PUBLIC_CREATE_LIST_LOCATION_CAMPAIGN, objImport)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const {
            status,
            message,
          } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            // console.log(response.data);
            // onClose();
            form.reset();
            onParentRefresh && onParentRefresh();
            onClose();
          } else {
            console.log(message)
            toast({
              title: "Cảnh báo",
              description: message,
            })
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  const CustomTotalEditor = ({
    column, rowKeyValue, dispatch, value,
  }: ICellEditorProps) => {
    const close = () => {
      dispatch(closeEditor(rowKeyValue, column.key));
    };
    const [editorValue, setValue] = useState(value);
    return (
      <input
        type='text'
        className="w-full"
        value={editorValue}
        onChange={(event) => {
          event.preventDefault();
          setValue(event.currentTarget.value);
        }}
        onFocus={(e: any) => e.target.select()}
        onInput={(e: any) => {
          let value = e.target.value;
          e.target.value = value.replace(/[^0-9]/g, '');
        }}
        onBlur={() => {
          let dataTemp = _.cloneDeep(tempEdit);
          let index = _.findIndex(dataTemp, { id: rowKeyValue });
          dataTemp[index].total = editorValue;
          setTempEdit(dataTemp);
          close();
        }}
      />
    );
  }


  return (
    <Dialog open={open} onOpenChange={() => {
      form.reset();
      return onClose();
    }}>
      <DialogContent className="sm:max-w-[1000px] px-4">
        <DialogHeader>
          <DialogTitle>Chỉ định địa điểm</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-2 space-y-6 bg-background rounded-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="channelId"
                render={({ field }) => (
                  <FormItem style={{ marginTop: 10 }}>
                    <FormLabel>Kênh</FormLabel>
                    <FormControl>
                      <ChannelCombobox
                        value={field.value}
                        data={listDropdownChannel}
                        onChange={(value: string) => {
                          field.onChange(value);
                          // console.log("value", value);
                          let listArea = _.cloneDeep(listDropdownArea);
                          let listAreaFilter = _.filter(listArea, { channelId: parseInt(value) });
                          // console.log("listAreaFilter", listAreaFilter);
                          setListAreaFilter(listAreaFilter);
                        }}
                        type="combobox"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="areaId"
                render={({ field }) => (
                  <FormItem style={{ marginTop: 10 }}>
                    <FormLabel>Vùng</FormLabel>
                    <FormControl>
                      <AreaCombobox
                        value={field.value}
                        data={listAreaFilter}
                        onChange={(value: string) => {
                          field.onChange(value);
                        }}
                        type="combobox"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <Table
              columns={[
                { key: 'code', title: 'Mã địa điểm', dataType: DataType.String, width: '15%', isEditable: false, },
                { key: 'locationName', title: 'Tên địa điểm', dataType: DataType.String, width: 'calc(85%-100px)', isEditable: false, },
                { key: 'total', title: 'Số lượng', dataType: DataType.Number, width: 100 },
              ]}
              data={tempEdit}
              childComponents={{
                headRow: {
                  elementAttributes: () => ({
                    className: "hidden lg:table-row bg-background"
                  }),
                  content: (props) => {
                    return (
                      <>
                        {props.columns.map((column) => (
                          <th key={column.key} className="ka-thead-cell ka-thead-cell-height ka-thead-fixed bg-foreground z-50" style={{ padding: `0px`, height: 40 }}>
                            <div className="ka-thead-cell-wrapper">
                              <div className="ka-thead-cell-content-wrapper">
                                <div className={
                                  cn(
                                    //default
                                    "ka-thead-cell-content flex items-center text-background",
                                    "px-2"
                                  )
                                }>
                                  {column.title}
                                </div>
                              </div>
                            </div>
                          </th>
                        ))}
                      </>
                    )
                  },
                },
                dataRow: {
                  elementAttributes: ({ isSelectedRow }: any) => {
                    return {
                      className: cn(
                        `cursor-pointer lg:h-[40px] group`,
                        isSelectedRow ? `bg-transparent lg:bg-accent` : `lg:odd:bg-white lg:even:bg-black/5`,
                      ),
                    }
                  },
                  content: (props: any) => {
                    // console.log(props.rowData)
                    return (
                      <>
                        <td colSpan={props.columns.length} className="lg:hidden w-full flex-1 relative">
                          <Card className="shadow-none">
                            <CardContent className="px-4 py-3 w-full flex flex-col space-y-4">
                              <p className="text-black/60 text-xs  line-clamp-2 sm:text-sm">Mã địa điểm:&nbsp;&nbsp;&nbsp; <Label className="font-bold">{` ` + props.rowData.code}</Label></p>
                              <p className="text-xs sm:text-sm text-black/70 line-clamp-2 font-medium">
                                {``}<span className="font-bold line-clamp-2 sm:text-lg">{` ` + props.rowData.locationName}  </span>
                              </p>
                              <div className="flex items-center">
                                <div className="text-black/60 text-xs  line-clamp-2 sm:text-sm">Số lượng:&nbsp;&nbsp;&nbsp;</div>
                                <div className="flex-1">
                                  <input
                                    type='text'
                                    className="w-full h-9 bg-transparent px-2 border"
                                    value={props.rowData.total}
                                    onChange={(event) => {
                                      event.preventDefault();
                                      let dataTemp = _.cloneDeep(tempEdit);
                                      let index = _.findIndex(dataTemp, { id: props.rowData.id });
                                      dataTemp[index].total = event.target.value;
                                      setTempEdit(dataTemp);
                                    }}
                                    onFocus={(e: any) => e.target.select()}
                                    onInput={(e: any) => {
                                      let value = e.target.value;
                                      e.target.value = value.replace(/[^0-9]/g, '');
                                    }}
                                  />
                                </div>
                                {/* <p className="text-black/60 text-xs  line-clamp-2 sm:text-sm">Mã địa điểm: <Label className="font-bold">{` ` + props.rowData.code}</Label></p> */}

                              </div>
                              {/* <div className="p-2 h-auto flex justify-center items-start py-2.5">
                                                <CellCheck {...props} />
                                            </div>
                                            <div className="w-[calc(100%-32px)] relative z-0 py-0.5 pb-2 pr-1 space-y-0.5 flex flex-col overflow-x-hidden">
                                                <div>
                                                    <p className="font-bold line-clamp-2 sm:text-lg">{` ` + props.rowData.locationName}</p>
                                                </div>
                                                <p className="text-xs sm:text-sm text-black/70 line-clamp-2 font-medium">
                                                    <span className="text-black/60 text-xs sm:text-sm font-normal">Địa chỉ:</span>{` ` + props.rowData.address}
                                                </p>
                                                <div>
                                                    <span className="text-black/60 text-xs sm:text-sm">Liên hệ:</span><Label className="text-xs sm:text-sm">{` ` + props.rowData.contact}</Label>
                                                </div>
                                                {props.rowData.note && (
                                                    <div>
                                                        <span className="text-black/60 text-xs sm:text-sm">Ghi chú:</span><Label className="text-xs sm:text-sm">{` ` + props.rowData.note}</Label>
                                                    </div>
                                                )}
                                            </div> */}
                            </CardContent>
                          </Card>
                        </td>

                        {props.columns.map((column: any) => {
                          return (
                            <td className="ka-cell hidden lg:table-cell" key={column.key} style={{ height: 40, padding: 0 }}>
                              <div className={
                                cn(
                                  "ka-cell-text truncate relative h-full",
                                )
                              }>
                                {column.key === "total" ? (
                                  <input
                                    type='text'
                                    className="w-full h-full bg-transparent px-2"
                                    value={props.rowData[column.key]}
                                    onChange={(event) => {
                                      event.preventDefault();
                                      let dataTemp = _.cloneDeep(tempEdit);
                                      let index = _.findIndex(dataTemp, { id: props.rowData.id });
                                      dataTemp[index].total = event.target.value;
                                      setTempEdit(dataTemp);
                                    }}
                                    onFocus={(e: any) => e.target.select()}
                                    onInput={(e: any) => {
                                      let value = e.target.value;
                                      e.target.value = value.replace(/[^0-9]/g, '');
                                    }}
                                  />
                                ) : (
                                  <span className="w-full h-auto inline-block align-middle truncate px-2">
                                    {props.rowData[column.key]}
                                  </span>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </>
                    )
                  }
                },
                // dataRow= {
                //   elementAttributes: ({ isSelectedRow }: any) => {

                // },
                // },

                cell: {
                  elementAttributes: (props) => ({
                    style: {
                      height: 40,
                      padding: 0,
                    }
                  }),
                },
                tableWrapper: {
                  elementAttributes: (props) => ({
                    className: "max-h-[calc(100vh-500px)]"
                  }),
                },
                cellEditor: {
                  content: (props) => {
                    switch (props.column.key) {
                      case 'total':
                        return <CustomTotalEditor {...props} />;
                      default:
                        return null;
                    }
                  }
                }

              }}
              editableCells={[{
                columnKey: 'id',
                rowKeyValue: 2,
              }]}
              editingMode={EditingMode.Cell}
              rowKeyField={'id'}
            />

            <DialogFooter>
              <Button type="submit">Xác nhận</Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
