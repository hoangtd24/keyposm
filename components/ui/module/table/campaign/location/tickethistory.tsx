"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Label } from "@/components/ui/label";
import Table from "@/components/ui/module/table";
import { cn } from "@/lib/utils";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import { PagingOptions } from "ka-table/models";
import { IRowProps } from "ka-table/props";
import { Card, CardContent } from "@/components/ui/card";

const columns = [
  {
    key: "1",
    field: "no",
    title: "STT",
    width: 60,
  },
  // {
  //   key: "16",
  //   field: "totalNow",
  //   title: "Số lượng đã xử lý",
  //   width: 100
  // },
  // {
  //   key: "17",
  //   field: "totalTransaction",
  //   title: "Số lượng chưa xử lý",
  //   width: 100
  // },
  {
    key: "7",
    field: "datecreate",
    title: "Ngày",
    width: 100,
  },
  {
    key: "8",
    field: "timecreate",
    title: "Thời gian",
    width: 100,
  },
  // {
  //   key: "15",
  //   field: "total",
  //   title: "Số lượng POSM",
  //   width: 100,
  // },
  {
    key: "6",
    field: "statusName",
    title: "Trạng thái",
    width: 100,
  },
  {
    key: "9",
    field: "note",
    title: "Ghi chú",
    width: 200,
  },

  {
    key: "10",
    field: "nameCreate",
    title: "Người tạo",
    width: 200,
  },
  // {
  //   key: "11",
  //   field: "district",
  //   title: "Quận/Huyện",
  //   width: 150,
  // },
  // {
  //   key: "12",
  //   field: "address",
  //   title: "Địa chỉ",
  //   width: 200,
  // },
  // {
  //   key: "13",
  //   field: "brandName",
  //   title: "Thương hiệu",
  //   width: 150,
  // },
  // {
  //   key: "14",
  //   field: "action",
  //   title: "",
  //   width: 80
  // }
];

const token_storage: any = process.env
  .NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type TableTicketProps = {
  loading: boolean;
  data: any | [];
  paging: PagingOptions;
  totalRows: number | null;
  onChangeTablePage: (pageIndex: number, pageSize: number) => void;
  onRefresh: () => void;
};

export default function TableTicketHistory({
  data,
  paging,
  loading,
  totalRows,
  onChangeTablePage,
  onRefresh,
}: TableTicketProps) {
  const { access_token } = useAppSelector((state: any) => state.auth);
  const [roleId, setRoleId] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem(token_storage)
      ? localStorage.getItem(token_storage)
      : access_token;
    // console.log(token);
    if (token) {
      const decoded: any = jwtDecode(token);
      const info: any = decoded.data;

      const roleId = info.roleId;

      setRoleId(roleId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  return (
    <>
      <style jsx global>
        {`
          .ka-table colgroup {
            display: none;
          }

          @media (min-width: 1024px) {
            .ka-table colgroup {
              display: table-column-group;
            }
          }
        `}
      </style>

      <div className="flex justify-between mt-2 items-end">
        {totalRows && totalRows !== 0 ? (
          <Label className="px-0 text-xs lg:text-sm sm: text-muted-foreground h-auto">
            Hiển thị {`${paging.pageSize} trên tổng số ${totalRows}`} dòng.
          </Label>
        ) : (
          <span>{` `}</span>
        )}
      </div>
      <div className="relative mt-2">
        <Table
          columns={columns}
          rowKeyField={"id"}
          data={data}
          loading={loading}
          headRow={{
            content: (props: any) => {
              return (
                <>
                  {props.columns.map((column: any) => (
                    <th
                      key={column.key}
                      className="hidden lg:table-cell ka-thead-cell ka-thead-cell-height ka-thead-fixed bg-foreground z-50"
                      style={{ padding: `0px`, height: 40 }}
                    >
                      <div className="ka-thead-cell-wrapper">
                        <div className="ka-thead-cell-content-wrapper">
                          <div
                            className={cn(
                              "ka-thead-cell-content flex items-center text-background px-2"
                            )}
                          >
                            {column.title}
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </>
              );
            },
          }}
          dataRow={{
            elementAttributes: ({ isSelectedRow }: IRowProps) => {
              return {
                className: cn(
                  `cursor-pointer lg:min-h-[40px] group`,
                  isSelectedRow
                    ? `bg-accent`
                    : `lg:odd:bg-white lg:even:bg-black/5`
                ),
              };
            },
            content: (props: any) => {
              return (
                <>
                  <td
                    colSpan={props.columns.length}
                    className="lg:hidden w-full flex-1 relative"
                  >
                    <Card className="shadow-none">
                      <CardContent className="p-2 w-full flex space-x-1 relative overflow-x-hidden">
                        <Link
                          href={`/ticket/${props.rowData.ticketId}`}
                          className="absolute w-full h-full inline-block top-0 left-0"
                        >
                          &nbsp;
                        </Link>
                        <div className="w-full space-y-0.5">
                          <div className="w-full overflow-x-hidden px-">
                            <p className="text-sm font-bold line-clamp-2 sm:text-lg">
                              {props.rowData.locationName}
                            </p>
                          </div>
                          {/* <div className="w-full">
                            <span className="text-black/60 text-xs sm:text-sm">
                              Chiến dịch:
                            </span>
                            <Label className="font-medium truncate text-xs sm:text-sm">
                              {` ` + props.rowData.campaignName}
                            </Label>
                          </div>
                          <div className="w-full">
                            <span className="text-black/60 text-xs sm:text-sm">
                              Thương hiệu:
                            </span>
                            <Label className="font-medium truncate text-xs sm:text-sm">
                              {` ` + props.rowData.brandName}
                            </Label>
                          </div> */}
                          {/* <div className="grid grid-cols-2">
                            <div className="w-full">
                              <span className="text-black/60 text-xs sm:text-sm">
                                Số lượng POSM:
                              </span>
                              <Label className="font-medium truncate text-xs sm:text-sm">
                                {` ` + props.rowData.total}
                              </Label>
                            </div>
                            <div className="w-full">
                              <span className="text-black/60 text-xs sm:text-sm">
                                Đã xử lý:
                              </span>
                              <Label className="font-medium truncate text-xs sm:text-sm">
                                {` ` + props.rowData.totalNow}
                              </Label>
                            </div>
                          </div> */}
                          <div className="grid">
                            <div className="w-full">
                              <span className="text-black/60 text-xs sm:text-sm">
                                Người tạo:
                              </span>
                              <Label className="font-medium truncate text-xs sm:text-sm">
                                {` ` + props.rowData.nameCreate}
                              </Label>
                            </div>
                          </div>
                          <div className="grid grid-cols-2">
                            {/* <div className="w-full">
                              <span className="text-black/60 text-xs sm:text-sm">
                                Chưa xử lý:
                              </span>
                              <Label className="font-medium truncate text-xs sm:text-sm">
                                {` ` + props.rowData.totalTransaction}
                              </Label>
                            </div> */}
                            <div className="w-full">
                              <span className="text-black/60 text-xs sm:text-sm">
                                Trạng thái:
                              </span>
                              <Label className="font-medium truncate text-xs sm:text-sm">
                                {` ` + props.rowData.statusName}
                              </Label>
                            </div>
                          </div>
                          <div className="grid">
                            <div className="w-full">
                              <span className="text-black/60 text-xs sm:text-sm">
                                Ngày thực hiện:
                              </span>
                              <Label className="font-medium truncate text-xs sm:text-sm">
                                {` ` + props.rowData.datecreate}
                              </Label>
                            </div>
                            <div className="w-full">
                              <span className="text-black/60 text-xs sm:text-sm">
                                Thời gian:
                              </span>
                              <Label className="font-medium truncate text-xs sm:text-sm">
                                {` ` + props.rowData.timecreate}
                              </Label>
                            </div>
                          </div>
                          {props.rowData.note && (
                            <div className="w-full">
                              <span className="text-black/60 text-xs sm:text-sm">
                                Ghi chú:
                              </span>
                              <Label className="font-medium truncate text-xs sm:text-sm">
                                {` ` + props.rowData.note}
                              </Label>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </td>
                  {props.columns.map((column: any) => (
                    <td
                      className="ka-cell hidden lg:table-cell"
                      key={column.key}
                      style={{ height: 40, padding: 0 }}
                    >
                      <div
                        className={cn("ka-cell-text truncate relative h-full")}
                      >
                        {column.field !== "action" ? (
                          <Link
                            href={`/ticket/${props.rowData.ticketId}`}
                            className="inline-flex w-full h-full"
                          >
                            <span className="w-full h-auto inline-block align-middle truncate px-2">
                              {props.rowData[column.field]}
                            </span>
                          </Link>
                        ) : (
                          <>
                            {roleId === 1 && (
                              <div className="hidden bg-transparent lg:group-hover:flex justify-end items-center absolute top-0 right-0 h-full px-3 z-20"></div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  ))}
                </>
              );
            },
          }}
          paging={paging}
          onChangeTablePage={onChangeTablePage}
          tableWrapper={{
            elementAttributes: () => ({
              className:
                "max-h-[calc(100vh-305px)] lg:max-h-[calc(100vh-350px)]",
            }),
          }}
        />
      </div>
    </>
  );
}
