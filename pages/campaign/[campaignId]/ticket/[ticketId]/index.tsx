import { Label } from "@/components/ui/label";
import Layout from "@/components/ui/module/layout";
import HistoryTable from "@/components/ui/module/table/history";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import _ from "lodash";
import { useEffect, useState } from "react";

import {
  NEXT_PUBLIC_DETAIL_TICKET_API,
  NEXT_PUBLIC_HISTORY_TICKET_API,
} from "@/config/api";
import { setTableData } from "@/lib/store/slices/tableSlice";
import { useRouter } from "next/router";
import {
  Autoplay,
  Controller,
  FreeMode,
  Navigation,
  Thumbs,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UpdateProcessing from "@/components/ui/module/ticket/update/UpdateProcessing";
import UpdateRecieve from "@/components/ui/module/ticket/update/UpdateRecieve";
import UpdateSuccess from "@/components/ui/module/ticket/update/UpdateSuccess";
import UpdateSuccessApart from "@/components/ui/module/ticket/update/UpdateSuccessApart";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_URI } from "@/config";
import jwtDecode from "jwt-decode";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import DeleteTicket from "@/components/ui/module/ticket/deleteTicket";
import { numberWithCommas } from "@/lib/function";

interface Image {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
}
const token_storage: any = process.env
  .NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

export default function Detail({ params }: { params: { ticketId: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ticketDetail, setTicketDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [roleId, setRoleId] = useState<number>(0);
  const { access_token } = useAppSelector((state: any) => state.auth);

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

  const onRefreshData = () => {
    setCurrentTime(moment().valueOf());
  };

  const userAssignTicket = (userId: number) => {
    const existingUser = ticketDetail?.userAssign.find(
      (user: any) => user.id == userId
    );
    if (existingUser) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    //get detail ticket
    setLoading(true);
    axiosWithHeaders("post", NEXT_PUBLIC_DETAIL_TICKET_API, {
      id: router.query.ticketId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              setTicketDetail(result);
              setLoading(false);
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });

    //get history ticket
    axiosWithHeaders("post", NEXT_PUBLIC_HISTORY_TICKET_API, {
      ticketId: router.query.ticketId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              let dataTable = _.cloneDeep(result);
              dataTable.map((item: any, index: number) => {
                item.no = index + 1;
              });
              dispatch(setTableData(dataTable));
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [dispatch, router.query.ticketId, currentTime]);

  return (
    <Layout
      pageInfo={{
        title: "CHI TIẾT BÁO CÁO SỰ CỐ",
      }}
    >
      <style global jsx>{`
        div.swiper-slide-thumb-active {
          border: 2px solid #9aeb0d;
          opacity: 1 !important;
        }
        .swiper-slide-visible {
          width: fit-content !important;
        }
        .prev,
        .next {
          display: flex;
          position: absolute;
          top: 50%;
          background-color: #fff;
          padding: 8px;
          border-radius: 50%;
          border: 1px solid #ccc;
          z-index: 1;
          cursor: pointer;
          color: #333;
          transition: all 0.2s ease;
        }

        .prev {
          left: 8px;
        }

        .next {
          right: 8px;
        }
        .prev:hover,
        .next:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .prev:active,
        .next:active {
          color: var(--color-primary);
          background-color: #fff;
          border-color: var(--color-primary);
        }

        .prev.swiper-button-disabled {
          background-color: rgba(0, 0, 0, 0.05);
          cursor: unset;
          color: #ccc;
        }

        .prev.swiper-button-disabled:active {
          background-color: rgba(0, 0, 0, 0.05);
          cursor: unset;
          border-color: #ccc;
        }

        .next.swiper-button-disabled {
          background-color: rgba(0, 0, 0, 0.05);
          cursor: unset;
          color: #ccc;
        }

        .next.swiper-button-disabled:active {
          background-color: rgba(0, 0, 0, 0.05);
          cursor: unset;
          border-color: #ccc;
        }
      `}</style>
      <div className="w-full relative pt-4">
        <div className="bg-[#e5e5e5] flex justify-center items-center mb-4 relative rounded-md">
          {loading ? (
            <Skeleton className="w-full pt-[40%]" />
          ) : (
            <>
              <Swiper
                // install Swiper modules
                modules={[Autoplay, Navigation, Controller]}
                centeredSlides={true}
                slidesPerView={1}
                style={{ maxHeight: "500px" }}
                navigation={{
                  nextEl: ".next",
                  prevEl: ".prev",
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
              >
                {ticketDetail?.images?.map((image: Image, index: number) => (
                  <SwiperSlide key={index}>
                    <div
                      className="flex justify-center items-center w-full"
                      onClick={() => setShowDialog(true)}
                    >
                      <picture className="">
                        <img
                          src={`${IMAGE_URI}/${image?.filePath}`}
                          alt=""
                          className="h-[350px] lg:h-[500px] object-contain"
                        />
                      </picture>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="prev">
                <ChevronLeft />
              </div>
              <div className="next">
                <ChevronRight />
              </div>
            </>
          )}
        </div>
        <div className="bg-[#e5e5e5] p-4 lg:p-6 rounded flex flex-col gap-2">
          <div className="block lg:flex justify-between items-center gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <div>
                <span>Chiến dịch:</span>
                {loading ? (
                  <Skeleton className="w-52 h-4 inline-block" />
                ) : (
                  <span className=" font-medium break-words">
                    {ticketDetail?.campaignName}
                  </span>
                )}
              </div>
              <div>
                <span>Thương hiệu:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" font-medium break-words ml-2">
                    {ticketDetail?.brandName}
                  </span>
                )}
              </div>
              <div>
                <span>Tên địa điểm:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {ticketDetail?.locationName}
                  </span>
                )}
              </div>
              <div>
                <span>Địa chỉ:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {ticketDetail?.address}-{ticketDetail?.ward}-
                    {ticketDetail?.district}-{ticketDetail?.province}
                  </span>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <span>Vị trí:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <a
                    href={`http://maps.google.com?q=${ticketDetail?.location}`}
                    target="_blank"
                    className="flex w-fit"
                  >
                    <MapPin size={20} />
                  </a>
                )}
              </div>
              <div>
                <span>Kênh:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {ticketDetail?.channelName}
                  </span>
                )}
              </div>
              <div>
                <span>Vùng:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {ticketDetail?.areaName}
                  </span>
                )}
              </div>
              <div>
                <span>Thời gian:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {ticketDetail?.timecreate} - {ticketDetail?.datecreate}
                  </span>
                )}
              </div>
              <div>
                <span>Thời gian cập nhật:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {ticketDetail?.timeupdate} - {ticketDetail?.dateupdate}
                  </span>
                )}
              </div>
              <div>
                <span>Ghi chú:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {ticketDetail?.note}
                  </span>
                )}
              </div>
              <div>
                <span className="min-w-[80px]">Loại POSM:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className="break-words font-medium ml-2">
                    {ticketDetail?.typePosm
                      ?.map((posm: any) => posm.posmTypeName)
                      .toString()}
                  </span>
                )}
              </div>
              <div>
                <span>Trạng thái:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : ticketDetail?.status === 1 ? (
                  <span className="break-all font-mediums bg-[#f87674] text-xs px-2 py-0.5 rounded ml-2 text-white">
                    {ticketDetail?.statusName}
                  </span>
                ) : ticketDetail?.status === 2 ? (
                  <span className="break-all font-mediums bg-[#6ba7ff] text-xs px-2 py-0.5 rounded ml-2 text-white">
                    {ticketDetail?.statusName}
                  </span>
                ) : ticketDetail?.status === 3 ? (
                  <span className="break-all font-mediums bg-[#ffb13f] text-xs px-2 py-0.5 rounded ml-2 text-white">
                    {ticketDetail?.statusName}
                  </span>
                ) : ticketDetail?.status === 4 ? (
                  <span className="break-all font-mediums bg-[#7eff84] text-xs px-2 py-0.5 rounded ml-2 text-white">
                    {ticketDetail?.statusName}
                  </span>
                ) : ticketDetail?.status === 5 ? (
                  <span className="break-all font-mediums bg-[#7eff84] text-xs px-2 py-0.5 rounded ml-2 text-white">
                    {ticketDetail?.statusName}
                  </span>
                ) : ticketDetail?.status === 6 ? (
                  <span className="break-all font-mediums bg-[#ff1d19] text-xs px-2 py-0.5 rounded ml-2 text-white">
                    {ticketDetail?.statusName}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <iframe
              src={`https://maps.google.com/maps?q=${ticketDetail?.location}&z=15&output=embed`}
              width="450"
              height="350"
              className="hidden lg:block"
            ></iframe>
          </div>
          {ticketDetail?.totals?.length === 1 ? (
            <div>
              <div>
                <span>Số lượng sự cố: </span>
                <span className="font-medium">
                  {ticketDetail?.total
                    ? numberWithCommas(ticketDetail?.total)
                    : 0}
                </span>
              </div>
              <div>
                <span>Số lượng đã xử lí: </span>
                <span className="font-medium">
                  {ticketDetail?.total - ticketDetail?.totals?.[0]?.total}
                </span>
              </div>
              <div>
                <span>Số lượng chưa xử lí: </span>
                <span className="font-medium">
                  {ticketDetail?.totals?.[0]?.total
                    ? numberWithCommas(ticketDetail?.totals?.[0]?.total)
                    : 0}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <span>Tổng số POSM sự cố: </span>
                <span className="font-medium">
                  {ticketDetail?.total
                    ? numberWithCommas(ticketDetail?.total)
                    : 0}
                </span>
              </div>
              <div>
                <span>Tổng số POSM xử lí: </span>
                <span className="font-medium">
                  {ticketDetail?.totalNow
                    ? numberWithCommas(ticketDetail?.totalNow)
                    : 0}
                </span>
              </div>
              <div>
                <span>Tổng số POSM chưa xử lí: </span>
                <span className="font-medium">
                  {ticketDetail?.total - ticketDetail?.totalNow
                    ? numberWithCommas(
                        ticketDetail?.total - ticketDetail?.totalNow
                      )
                    : 0}
                </span>
              </div>
              <table className="hidden lg:table w-full border-spacing-4 border-collapse border border-slate-400 mt-3">
                <thead>
                  <tr>
                    <th className="text-center px-2 py-1 w-[25%] border-2 border-current">
                      Tên POSM
                    </th>
                    <th className="text-center px-2 py-1 w-[25%] border-2 border-current">
                      Số lượng
                    </th>
                    <th className="text-center px-2 py-1 w-[25%] border-2 border-current">
                      Số lượng đã xử lí
                    </th>
                    <th className="text-center px-2 py-1 w-[25%] border-2 border-current">
                      Số lượng chưa xử lí
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ticketDetail?.totals?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="text-center px-2 py-1 border-2 border-current">
                        {item.posmTypeName}
                      </td>
                      <td className="text-center px-2 py-1 border-2 border-current">
                        {
                          ticketDetail?.typePosm?.find(
                            (posm: any) => posm.id === item.typePosmId
                          ).total
                        }
                      </td>
                      <td className="text-center px-2 py-1 border-2 border-current">
                        {ticketDetail?.typePosm?.find(
                          (posm: any) => posm.id === item.typePosmId
                        ).total - item.total}
                      </td>
                      <td className="text-center px-2 py-1 border-2 border-current">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="table lg:hidden w-full border-spacing-4 border-collapse border border-slate-400 mt-3">
                {/* <thead>
                  <tr>
                    <th className="text-left">Tên POSM</th>
                    <th className="text-left">Số lượng</th>
                    <th className="text-left">Số lượng đã xử lí</th>
                    <th className="text-left">Số lượng chưa xử lí</th>
                  </tr>
                </thead> */}
                <tbody>
                  {ticketDetail?.totals?.map((item: any) => (
                    <tr key={item.id} className="border border-[#8b8b8b]">
                      <td className="border border-[#8b8b8b]">
                        <div className="p-2">
                          <div>
                            <span>Tên Posm: </span>
                            <span className="font-medium">
                              {item?.posmTypeName}
                            </span>
                          </div>
                          <div>
                            <span>Số lượng: </span>
                            <span className="font-medium">
                              {
                                ticketDetail?.typePosm?.find(
                                  (posm: any) => posm?.id === item?.typePosmId
                                )?.total
                              }
                            </span>
                          </div>
                          <div>
                            <span>Số lượng đã xử lí: </span>
                            <span className="font-medium">
                              {ticketDetail?.typePosm?.find(
                                (posm: any) => posm?.id === item?.typePosmId
                              )?.total - item?.total}
                            </span>
                          </div>
                          <div>
                            <span>Số lượng chưa xử lí: </span>
                            <span className="font-medium">{item?.total}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center gap-3 p-4">
                {(roleId === 1 || roleId === 2) && (
                  <Button onClick={() => setShowDelete(true)} className="w-32">
                    Xóa
                  </Button>
                )}
                {(roleId === 1 || roleId === 2) && (
                  <Button onClick={() => setShowUpdate(true)} className="w-32">
                    Cập nhật
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <br />
        <Label className="text-lg lg:text-2xl">Lịch sử báo cáo sự cố</Label>
        <br />
        <HistoryTable />
      </div>
      <Dialog
        open={showDialog}
        onOpenChange={() => {
          setShowDialog(false);
        }}
      >
        <DialogContent className="sm:max-w-[100vw] p-0 h-[90vh] lg:h-[100vh]">
          <div className="lg:block flex items-center py-6 w-screen sm:w-screen ">
            <Swiper
              slidesPerView={1}
              grabCursor={true}
              navigation={{
                nextEl: ".next",
                prevEl: ".prev",
              }}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Navigation, Thumbs, Controller]}
            >
              {ticketDetail?.images?.map((image: Image, index: number) => (
                <SwiperSlide
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100vw",
                  }}
                >
                  <picture className="flex justify-center items-center my-4">
                    <img
                      src={`${IMAGE_URI}/${image?.filePath}`}
                      alt=""
                      className="h-[500px] object-contain"
                    />
                  </picture>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="hidden lg:block">
              <Swiper
                onSwiper={setThumbsSwiper}
                freeMode={true}
                loop={false}
                spaceBetween={20}
                slidesPerView={8}
                watchSlidesProgress
                touchRatio={0.2}
                slideToClickedSlide={true}
                modules={[Navigation, Thumbs, Controller]}
              >
                {ticketDetail?.images?.map((image: Image, index: number) => (
                  <SwiperSlide
                    key={index}
                    className="mt-4"
                    style={{ width: "fit-content" }}
                  >
                    <picture className="w-full">
                      <img
                        src={`${IMAGE_URI}/${image?.filePath}`}
                        alt=""
                        className="w-24 h-24 object-cover"
                      />
                    </picture>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {ticketDetail?.status === 1 && (
        <UpdateRecieve
          ticketId={router.query.ticketId as string}
          showUpdate={showUpdate}
          setShowUpdate={setShowUpdate}
          statusId={ticketDetail?.status}
          onRefreshData={onRefreshData}
        />
      )}

      {ticketDetail?.status === 2 && (
        <UpdateProcessing
          ticketId={router.query.ticketId as string}
          showUpdate={showUpdate}
          setShowUpdate={setShowUpdate}
          statusId={ticketDetail?.status}
          campaignId={ticketDetail?.campaignId}
          onRefreshData={onRefreshData}
        />
      )}
      {ticketDetail?.status === 3 && (
        <UpdateSuccessApart
          ticketId={router.query.ticketId as string}
          showUpdate={showUpdate}
          setShowUpdate={setShowUpdate}
          listTypePosm={ticketDetail?.totals}
          total={ticketDetail?.total}
          onRefreshData={onRefreshData}
        />
      )}
      {ticketDetail?.status === 4 && (
        <UpdateSuccess
          ticketId={router.query.ticketId as string}
          showUpdate={showUpdate}
          setShowUpdate={setShowUpdate}
          listTypePosm={ticketDetail?.totals}
          total={ticketDetail?.total}
          onRefreshData={onRefreshData}
        />
      )}
      <DeleteTicket
        query={router.query}
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        onRefreshData={onRefreshData}
      />
    </Layout>
  );
}
