import { Label } from "@/components/ui/label";
import Layout from "@/components/ui/module/layout";
import TableTicketHistory from "@/components/ui/module/table/campaign/location/tickethistory";
import TableDeployHistory from "@/components/ui/module/table/deploy/deployhistory";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_URI, defaultPaging } from "@/config";
import {
  NEXT_PUBLIC_HISTORY_POSM_LOCATION_API,
  NEXT_PUBLIC_OVERVIEW_LOCATION_IN_CAMPAIGN_API,
} from "@/config/api";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { PagingOptions } from "ka-table/models";
import _ from "lodash";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Autoplay,
  Controller,
  FreeMode,
  Navigation,
  Thumbs,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { numberWithCommas } from "@/lib/function";

type Image = {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
};

const HistoryLocation = () => {
  const router = useRouter();
  const [dataDeploy, setDataDeploy] = useState<any>([]);
  const [dataTicket, setDataTicket] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [paging, setPaging] = useState<PagingOptions>(defaultPaging);
  const [detailLocation, setDetailLocation] = useState<any>();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const onChangeTablePage = () => {};

  const onRefreshData = () => {};
  useEffect(() => {
    setLoading(true);
    axiosWithHeaders("post", NEXT_PUBLIC_OVERVIEW_LOCATION_IN_CAMPAIGN_API, {
      campaignId: router.query?.campaignId,
      locationId: router.query?.locationId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            console.log(result);
            setDetailLocation(result);
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });

    axiosWithHeaders("post", NEXT_PUBLIC_HISTORY_POSM_LOCATION_API, {
      campaignId: router.query?.campaignId,
      locationId: router.query?.locationId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            console.log(result);
            let dataTableDeploys = _.cloneDeep(result.deploys);
            console.log("dataTable", dataTableDeploys);
            dataTableDeploys.map((deploy: any, index: number) => {
              deploy.no = index + 1;
            });
            setDataDeploy(dataTableDeploys);
            let dataTableTickets = _.cloneDeep(result.tickets);
            dataTableTickets.map((ticket: any, index: number) => {
              ticket.no = index + 1;
            });
            setDataTicket(dataTableTickets);
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    setLoading(false);
  }, [router.query?.campaignId, router.query?.locationId]);
  return (
    <Layout
      pageInfo={
        {
          // title: "Danh sách địa điểm",
          // description: "Tạo, chỉnh sửa, quản lý địa điểm của chiến dịch.",
        }
      }
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
          display: none;
        }
        @media (min-width: 1024px) {
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
      {detailLocation?.images?.length > 0 && (
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
                {detailLocation?.images &&
                  detailLocation?.images.length > 0 &&
                  detailLocation?.images?.map((image: Image, index: number) => {
                    if (image && image.filePath) {
                      return (
                        <SwiperSlide key={index}>
                          <div
                            className="flex justify-center items-center w-full"
                            onClick={() => setShowDialog(true)}
                          >
                            <picture className="">
                              <img
                                src={`${IMAGE_URI}/${image.filePath}`}
                                alt=""
                                className="lg:h-[500px] object-contain"
                              />
                            </picture>
                          </div>
                        </SwiperSlide>
                      );
                    }
                    return null;
                  })}
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
      )}
      <div className="bg-[#e5e5e5] p-4 rounded flex flex-col gap-2">
        <div>
          <span>Tên địa điểm:</span>
          {loading ? (
            <Skeleton className="w-44 h-4 inline-block" />
          ) : (
            <span className=" break-words font-medium ml-2">
              {detailLocation?.locationName}
            </span>
          )}
        </div>
        <div>
          <span>Địa chỉ:</span>
          {loading ? (
            <Skeleton className="w-44 h-4 inline-block" />
          ) : (
            <span className=" break-words font-medium ml-2">
              {detailLocation?.address}-{detailLocation?.ward}-
              {detailLocation?.district}-{detailLocation?.province}
            </span>
          )}
        </div>
        <div>
          <span>Chiến dịch:</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-words font-medium ml-2">
              {detailLocation?.campaignName}
            </span>
          )}
        </div>
        <div>
          <span>Thương hiệu:</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-words font-medium ml-2">
              {detailLocation?.brandName}
            </span>
          )}
        </div>
        <div>
          <span>Kênh:</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-all font-medium ml-2">
              {detailLocation?.channelName}
            </span>
          )}
        </div>
        <div>
          <span>Vùng:</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-all font-medium ml-2">
              {detailLocation?.areaName}
            </span>
          )}
        </div>
        <div>
          <span>Số lượng POSM :</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-all font-medium ml-2">
              {detailLocation?.total
                ? numberWithCommas(detailLocation?.total)
                : 0}
            </span>
          )}
        </div>
        <div>
          <span>Số lượng POSM lắp đặt :</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-all font-medium ml-2">
              {detailLocation?.totalDeploy
                ? numberWithCommas(detailLocation?.totalDeploy)
                : 0}
            </span>
          )}
        </div>
        <div>
          <span>Số lượng POSM sự cố :</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-all font-medium ml-2">
              {detailLocation?.totalTicket
                ? numberWithCommas(detailLocation?.totalTicket)
                : 0}
            </span>
          )}
        </div>
        <div>
          <span>Số lần lắp đặt :</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-all font-medium ml-2">
              {detailLocation?.countDeploy
                ? numberWithCommas(detailLocation?.countDeploy)
                : 0}
            </span>
          )}
        </div>
        <div>
          <span>Số lần sự cố :</span>
          {loading ? (
            <Skeleton className="w-44 h-4" />
          ) : (
            <span className=" break-all font-medium ml-2">
              {detailLocation?.countTicket
                ? numberWithCommas(detailLocation?.countTicket)
                : 0}
            </span>
          )}
        </div>
      </div>
      <br />
      <Label className="text-lg lg:text-2xl">Danh sách lắp đặt</Label>
      <br />
      <TableDeployHistory
        data={dataDeploy}
        loading={loading}
        totalRows={totalRows}
        paging={paging}
        onChangeTablePage={() => onChangeTablePage()}
        onRefresh={onRefreshData}
      />
      <br />
      <Label className="text-lg lg:text-2xl">Danh sách sự cố</Label>
      <TableTicketHistory
        data={dataTicket}
        loading={loading}
        totalRows={10}
        paging={paging}
        onChangeTablePage={() => onChangeTablePage()}
        onRefresh={onRefreshData}
      />
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
              {detailLocation?.images &&
                detailLocation?.images.length > 0 &&
                detailLocation?.images?.map((image: Image, index: number) => {
                  if (image && image.filePath) {
                    return (
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
                            src={`${IMAGE_URI}/${image.filePath}`}
                            alt=""
                            className="h-[500px] object-contain"
                          />
                        </picture>
                      </SwiperSlide>
                    );
                  }
                  return null;
                })}
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
                {detailLocation?.images &&
                  detailLocation?.images.length > 0 &&
                  detailLocation?.images?.map((image: Image, index: number) => {
                    if (image && image.filePath) {
                      return (
                        <SwiperSlide
                          key={index}
                          className="mt-4"
                          style={{ width: "fit-content" }}
                        >
                          <picture className="w-full">
                            <img
                              src={`${IMAGE_URI}/${image.filePath}`}
                              alt=""
                              className="w-24 h-24 object-cover"
                            />
                          </picture>
                        </SwiperSlide>
                      );
                    }
                    return null;
                  })}
              </Swiper>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default HistoryLocation;
