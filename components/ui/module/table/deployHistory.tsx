"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Table from "@/components/ui/module/table";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NEXT_PUBLIC_DETAIL_HISTORY_DEPLOY_API } from "@/config/api";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useAppSelector } from "@/lib/store";
import { cn } from "@/lib/utils";
import jwtDecode from "jwt-decode";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Aceept from "../deploy/accept";
import moment from "moment";
import UpdateDeploy from "../deploy/update";
import { useRouter } from "next/router";
import { numberWithCommas } from "@/lib/function";

const columns = [
  {
    key: "1",
    field: "no",
    title: "STT",
    width: 60,
  },
  {
    key: "7",
    field: "nameCreate",
    title: "Người tạo",
    width: 150,
  },
  {
    key: "8",
    field: "statusName",
    title: "Trạng thái",
    width: 150,
  },
  {
    key: "9",
    field: "datecreate",
    title: "Ngày",
    width: 100,
  },
  {
    key: "10",
    field: "timecreate",
    title: "Thời gian",
    width: 100,
  },
  {
    key: "11",
    field: "note",
    title: "Ghi chú",
    width: 200,
  },
  {
    key: "12",
    field: "total",
    title: "Số lượng Posm",
    width: 200,
  },
];

const token_storage: any = process.env
  .NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type DeployHistoryProps = {
  onRefreshData: () => void;
};
export default function DeployHistory({ onRefreshData }: DeployHistoryProps) {
  const { data, loading } = useAppSelector((state: any) => state.table);
  const { access_token } = useAppSelector((state: any) => state.auth);
  // const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [id, setId] = useState<number>(0);
  // const [detail, setDetail] = useState<DetailUserProps>();
  const [roleId, setRoleId] = useState<number>(0);
  const [historyDetail, setHistoryDeatil] = useState<any>(null);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(token_storage)
      ? localStorage.getItem(token_storage)
      : access_token;
    console.log(token);
    if (token) {
      const decoded: any = jwtDecode(token);
      const info: any = decoded.data;

      const roleId = info.roleId;

      setRoleId(roleId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  const getDetailHistoryDeploy = (id: number) => {
    axiosWithHeaders("post", NEXT_PUBLIC_DETAIL_HISTORY_DEPLOY_API, { id })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            setHistoryDeatil(result);
            setOpen(true);
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleDelete = (id: number) => {
    setId(id);
    setOpenDel(true);
  };

  return (
    <>
      <style jsx global>{`
        .hidden-header-ka-table .ka-thead-cell-height {
          height: 0px;
        }

        .hidden-header-ka-table .ka-thead-cell {
          padding: unset;
        }

        .hidden-header-ka-table .ka-paging-page-index,
        .hidden-header-ka-table .ka-paging-size,
        .print-content .ka-paging-page-index,
        .print-content .ka-paging-size {
          border-radius: 50%;
          color: #747d86;
          cursor: pointer;
          margin: 10px 5px;
          min-width: 28px;
          min-height: 28px;
          padding: 5px;
          text-align: center;
          -webkit-user-select: none;
          user-select: none;
        }

        .hidden-header-ka-table .ka-row {
          border-top: unset;
          border-bottom: unset;
        }

        .hidden-header-ka-table .ka-row {
          border-top: unset;
          border-bottom: unset;
        }

        .ka-table-mobile colgroup {
          display: none;
        }
      `}</style>
      <Label className="text-lg lg:text-2xl">Lịch sử lắp đặt</Label>
      <br />
      <div className="block lg:hidden relative mt-3 ka-table-mobile">
        <Table
          columns={columns}
          rowKeyField={"id"}
          data={data}
          loading={loading}
          headRow={{
            elementAttributes: () => ({
              className: `hidden`,
            }),
            content: (props: any) => {
              return null;
            },
          }}
          dataRow={{
            elementAttributes: () => ({
              className: `odd:bg-white even:bg-black/5 cursor-pointer min-h-[40px] group`,
            }),
            content: (props: any) => {
              return (
                <td
                  colSpan={props.columns.length}
                  className="w-full flex-1"
                  onClick={() => getDetailHistoryDeploy(props.rowData.id)}
                >
                  <div className="w-full flex-col h-max flex relative group-hover:shadow-md">
                    <div className="w-full h-max flex relative">
                      {/* <div
                        className={cn(
                          "w-10 h-auto flex justify-center items-center"
                        )}
                      >
                        <Checkbox id={`brand-${props.rowData.id}`} className="group-focus:bg-black/50" />
                      </div> */}
                      <div
                        className={cn(
                          "flex justify-between relative p-1 lg:p-2 items-center"
                        )}
                      >
                        {/* <div>
                          <Label className="text-lg">
                            {" "}
                            {props.rowData.locationName} ({props.rowData.code})
                          </Label>
                          <br />
                          <Label className="font-base text-xs text-black/60">
                            {props.rowData.address}
                          </Label>
                        </div>
                        <div className="group-hover:hidden">
                          <Label className="font-base text-xs text-black/60">
                            {props.rowData.endDate}
                          </Label>
                        </div> */}
                        <div className="grid w-full gap-x-2">
                          <div className="flex space-x-1 col-span-3">
                            <span>Người tạo</span>
                            <Label className="text-sm truncate">
                              {props.rowData.nameCreate}
                            </Label>
                          </div>
                          <div className="col-span-2">
                            Thời gian: &nbsp;
                            <Label className="text-sm truncate">
                              {props.rowData.timecreate} -{" "}
                              {props.rowData.datecreate}
                            </Label>
                          </div>
                          <div className="col-span-3">
                            Số lượng: &nbsp;
                            <Label className="font-medium truncate text-xs sm:text-sm">{props.rowData.hasOwnProperty("total") && props.rowData.total ? ` ` + numberWithCommas(props.rowData.total) : ` ` + 0}</Label>
                          </div>
                          {/* <div className="col-span-2">
                            Vùng: &nbsp;
                            <Label className="text-sm truncate">
                              {props.rowData.areaName}
                            </Label>
                          </div> */}

                          {/* <div className="col-span-3 w-full relative flex">
                            Địa điểm: &nbsp;
                            <Label className="text-sm truncate">
                              {props.rowData.locationName}
                            </Label>
                          </div> */}
                          {/* <div className="col-span-5 w-full relative flex">
                            Địa chỉ: &nbsp;
                            <Label className="text-sm truncate">
                              {props.rowData.address}
                            </Label>
                          </div> */}
                          <div className="col-span-2 w-full relative flex">
                            Trạng thái: &nbsp;
                            {/* {props.rowData.status === 1 ? (
                              <span className="ka-cell-text px-2 py-0.5 text-center bg-[#EF5350] rounded text-white text-xs">
                                {props.rowData.statusName}
                              </span>
                            ) : props.rowData.status === 3 ? (
                              <span className="ka-cell-text px-2 py-0.5 text-center bg-[#FF9800] rounded text-white text-xs">
                                {props.rowData.statusName}
                              </span>
                            ) : props.rowData.status === 4 ? (
                              <span className="ka-cell-text px-2 py-0.5 text-center bg-[#4CAF50] rounded text-white text-xs">
                                {props.rowData.statusName}
                              </span>
                            ) : props.rowData.status === 2 ? (
                              <span className="ka-cell-text px-2 py-0.5 text-center bg-[#4782DA] rounded text-white text-xs">
                                {props.rowData.statusName}
                              </span>
                            ) : (
                              ""
                            )} */}
                            <Label className="text-sm truncate">
                              {props.rowData.statusName}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {roleId === 1 && (
                      <div className="flex lg:hidden justify-start items-center pl-2 space-x-0 text-sm">
                        <Button
                          // onClick={() => getDetailBrand(props.rowData.id)}
                          variant={`link`}
                          className="px-3 pl-0 py-0"
                        >
                          Sửa
                        </Button>
                        <Separator
                          orientation="vertical"
                          className="bg-foreground h-4 w-[1px]"
                        />
                        {/* <Button variant={`link`} className="px-3  py-0">
                                                Xóa
                                            </Button>| */}
                        {/* <Button variant={`link`} className="px-3  py-0">
                                                Chỉ định
                                            </Button>| */}
                        <Button
                          onClick={() => handleDelete(props.rowData.id)}
                          variant={`link`}
                          className="px-3  py-0"
                        >
                          Xóa
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              );
            },
          }}
        />
      </div>
      <div className="hidden lg:block relative mt-3 hidden-header-ka-table">
        <Table
          columns={columns}
          rowKeyField={"id"}
          loading={loading}
          data={data}
          paging={{ enabled: false }}
          headRow={{
            content: (props: any) => {
              return (
                <>
                  {props.columns.map((column: any, index: number) => {
                    return (
                      // <td key={index} style={{width: column.width}} className="hidden lg:block">
                      //     <div className="ka-thead-cell-content px-1 py-0.5 bg-foreground text-background">
                      //         <span>{column.title}</span>
                      //     </div>
                      // </td>
                      <th
                        key={index}
                        className="ka-thead-cell ka-thead-cell-height ka-thead-fixed ka-thead-background"
                        scope="col"
                        id={column.key}
                      >
                        <div className="ka-thead-cell-wrapper">
                          <div className="ka-thead-cell-content-wrapper">
                            <div className="ka-thead-cell-content px-1 py-1 bg-foreground text-background leading-[29px]">
                              <span>{column.title}</span>
                            </div>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </>
              );
              // return (
              //     <div className="hidden lg:block ka-thead-cell-content px-1 py-0.5 bg-foreground text-background">
              //         <span>{props.column.title}</span>
              //     </div>
              // )
            },
          }}
          dataRow={{
            elementAttributes: () => ({
              className: `odd:bg-white even:bg-black/5 cursor-pointer min-h-[40px] group`,
            }),
            content: (props: any) => {
              return (
                <>
                  {props.columns.map((column: any, index: number) => {
                    if (column.field === "no") {
                      return (
                        <td
                          className="p-0 text-[#353C44] leading-[29px]"
                          key={index}
                        >
                          <div className="ka-cell-text px-1 py-0.5 text-center">
                            {props.rowData[column.field]}
                          </div>
                        </td>
                      );
                    }

                    if (column.field === "statusName") {
                      return (
                        <td
                          className="p-0 text-[#353C44] leading-[29px]"
                          key={index}
                          onClick={() =>
                            getDetailHistoryDeploy(props.rowData.id)
                          }
                        >
                          {props.rowData.status === 1 ? (
                            <span className="ka-cell-text px-3 py-0.5 text-center bg-[#EF5350] rounded text-white text-xs">
                              {props.rowData[column.field]}
                            </span>
                          ) : props.rowData.status === 3 ? (
                            <span className="ka-cell-text px-3 py-0.5 text-center bg-[#FF9800] rounded text-white text-xs">
                              {props.rowData[column.field]}
                            </span>
                          ) : props.rowData.status === 4 ? (
                            <span className="ka-cell-text px-3 py-0.5 text-center bg-[#4CAF50] rounded text-white text-xs">
                              {props.rowData[column.field]}
                            </span>
                          ) : props.rowData.status === 2 ? (
                            <span className="ka-cell-text px-3 py-0.5 text-center bg-[#4782DA] rounded text-white text-xs">
                              {props.rowData[column.field]}
                            </span>
                          ) : (
                            <div className="ka-cell-text px-1 py-0.5">
                              {props.rowData[column.field]}
                            </div>
                          )}
                        </td>
                      );
                    }

                    if (index === columns.length - 1) {
                      return (
                        <td
                          className="p-0 text-[#353C44] leading-[29px]"
                          key={index}
                        >
                          <div className="ka-cell-text px-1 py-0.5 relative">
                            {props.rowData[column.field]}
                            {roleId === 1 && (
                              <div className="hidden bg-transparent lg:group-hover:flex justify-end items-center absolute top-0 right-0 h-full px-3">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        // onClick={() => getDetailBrand(props.rowData.id)}
                                        size={`icon`}
                                        variant={`outline`}
                                        className="mr-1 w-8 h-8 bg-transparent"
                                      >
                                        <Edit className="w-6 h-6" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Sửa</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        onClick={() =>
                                          handleDelete(props.rowData.id)
                                        }
                                        size={`icon`}
                                        variant={`outline`}
                                        className="w-8 h-8 bg-transparent"
                                      >
                                        <Trash2 className="w-6 h-6" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Xóa</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td
                        className="p-0 text-[#353C44] leading-[29px]"
                        key={index}
                        onClick={() => getDetailHistoryDeploy(props.rowData.id)}
                      >
                        <div className="ka-cell-text px-1 py-0.5">
                          {props.rowData[column.field]}
                        </div>
                      </td>
                    );
                  })}
                </>
              );
            },
          }}
        />
      </div>
      <Aceept
        open={open}
        setOpen={setOpen}
        historyDetail={historyDetail}
        onRefreshData={onRefreshData}
      />
    </>
  );
}
