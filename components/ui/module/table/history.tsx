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
import { IMAGE_URI } from "@/config";
import { NEXT_PUBLIC_DETAIL_HISTORY_TICKET_API } from "@/config/api";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useAppSelector } from "@/lib/store";
import { cn } from "@/lib/utils";
import jwtDecode from "jwt-decode";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Autoplay, Controller, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Dialog, DialogContent } from "../../dialog";

const columns = [
  {
    key: "1",
    field: "no",
    title: "STT",
    width: 60,
  },
  {
    key: "2",
    field: "locationName",
    title: "Địa điểm",
    width: 250,
  },
  {
    key: "3",
    field: "nameCreate",
    title: "Người tạo",
    width: 100,
  },
  {
    key: "4",
    field: "statusName",
    title: "Trạng thái",
    width: 100,
  },
  {
    key: "5",
    field: "datecreate",
    title: "Ngày",
    width: 100,
  },
  {
    key: "6",
    field: "timecreate",
    title: "Thời gian",
    width: 100,
  },
  {
    key: "7",
    field: "note",
    title: "Ghi chú",
    width: 200,
  },
];

const token_storage: any = process.env
  .NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type Image = {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
};
export default function TableLocation() {
  const { data, loading } = useAppSelector((state: any) => state.table);
  const { access_token } = useAppSelector((state: any) => state.auth);
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [id, setId] = useState<number>(0);
  const [roleId, setRoleId] = useState<number>(0);
  const [historyDetail, setHistoryDeatil] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem(token_storage)
      ? localStorage.getItem(token_storage)
      : access_token;
    if (token) {
      const decoded: any = jwtDecode(token);
      const info: any = decoded.data;

      const roleId = info.roleId;

      setRoleId(roleId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  const getDetailHistoryTicket = (id: number) => {
    axiosWithHeaders("post", NEXT_PUBLIC_DETAIL_HISTORY_TICKET_API, { id })
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
                  onClick={() => getDetailHistoryTicket(props.rowData.id)}
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
                            <span>Người tạo:</span>
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
                            Ghi chú: &nbsp;
                            <Label className="text-sm truncate">
                              {props.rowData.note}
                            </Label>
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
                            {props.rowData.status === 1 ? (
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
                            ) : props.rowData.status === 5 ? (
                              <span className="ka-cell-text px-2 py-0.5 text-center bg-[#4CAF50] rounded text-white text-xs">
                                {props.rowData.statusName}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {roleId === 1 && (
                      <div className="flex lg:hidden justify-start items-center pl-1 space-x-0 text-sm">
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
          // cell={{
          //     content: (props: any) => {
          //         // console.log(props);
          //         return (
          //             <div className="hidden lg:block ka-thead-cell-content px-1 py-0.5">
          //                 <span>{props.rowData[props.field]}</span>
          //             </div>
          //         )
          //     }
          // }}
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
                          ) : props.rowData.status === 5 ? (
                            <span className="ka-cell-text px-2 py-0.5 text-center bg-[#4CAF50] rounded text-white text-xs">
                              {props.rowData.statusName}
                            </span>
                          ) : props.rowData.status === 6 ? (
                            <span className="ka-cell-text px-3 py-0.5 text-center bg-[#ff1d19] rounded text-white text-xs">
                              {props.rowData[column.field]}
                            </span>
                          ) : (
                            ""
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
                        onClick={() => getDetailHistoryTicket(props.rowData.id)}
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
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      >
        <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-y-scroll">
          <div className="px-6 py-8 rounded">
            <div className="flex gap-2">
              {
                <Swiper
                  // install Swiper modules
                  modules={[Autoplay, Navigation, Controller]}
                  centeredSlides={true}
                  slidesPerView={4}
                  style={{ maxHeight: "500px", width: "300px" }}
                  navigation={{
                    nextEl: ".next",
                    prevEl: ".prev",
                  }}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  className="w-full"
                >
                  {historyDetail?.images?.map((image: Image, index: number) => (
                    <SwiperSlide key={index}>
                      <div className="flex justify-center items-center w-full">
                        <picture className="">
                          <img
                            src={`${IMAGE_URI}/${image.filePath}`}
                            alt=""
                            className="w-48 h-48 max-w-none object-cover"
                          />
                        </picture>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              }
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div>
                <span>Thương hiệu:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.brandName}
                </span>
              </div>
              <div>
                <span>Chiến dịch:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.campaignName}
                </span>
              </div>
              <div>
                <span>Tên địa điểm:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.locationName}
                </span>
              </div>
              <div>
                <span>Địa chỉ:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.address}
                </span>
              </div>
              <div>
                <span>Kênh:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.channelName}
                </span>
              </div>
              <div>
                <span>Vùng:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.areaName}
                </span>
              </div>
              <div>
                <span>Thời gian:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.timecreate}-{historyDetail?.datecreate}
                </span>
              </div>
              <div>
                <span>Trạng thái:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.statusName}
                </span>
              </div>
              <div>
                <span>Ghi chú:</span>
                <span className="font-medium break-words ml-2">
                  {historyDetail?.note}
                </span>
              </div>
              {historyDetail?.typePosm &&
              historyDetail?.typePosm?.length === 1 ? (
                <div>
                  <div>
                    <span>Số lượng đã xử lí: </span>
                    <span className="font-medium">
                      {historyDetail?.typePosm?.[0]?.total}
                    </span>
                  </div>
                </div>
              ) : historyDetail?.typePosm &&
                historyDetail?.typePosm?.length > 1 ? (
                <div>
                  {historyDetail && (
                    <div>
                      <span>Tổng số POSM xử lí: </span>
                      <span className="font-medium">
                        {historyDetail?.typePosm?.reduce(
                          (total: number, currentTotal: any) =>
                            total + currentTotal.total,
                          0
                        )}
                      </span>
                    </div>
                  )}
                  <table className="w-full border-spacing-4 border-collapse border border-slate-400 mt-3">
                    <thead>
                      <tr>
                        <th className="text-center px-2 py-1 w-[40%] border-current border-2">
                          Tên POSM
                        </th>
                        <th className="text-center px-2 py-1 w-[60%] border-current border-2">
                          Số lượng chưa xử lí
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyDetail?.typePosm?.map((item: any) => (
                        <tr key={item.id}>
                          <td className="text-center px-2 py-1 border-current border-2">
                            {item.posmTypeName}
                          </td>
                          <td className="text-center px-2 py-1 border-current border-2">
                            {item.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* <UpdateBrand open={open} onClose={() => setOpen(!open)} detail={detail} />
            <DeleteBrand id={id} open={openDel} onClose={() => setOpenDel(!openDel)} /> */}
    </>
  );
}
