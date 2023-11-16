import Layout from "@/components/ui/module/layout";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect, useState } from "react";

import {
  NEXT_PUBLIC_DETAIL_DEPLOY_API,
  NEXT_PUBLIC_HISTORY_DEPLOY_API,
} from "@/config/api";
import { useRouter } from "next/router";
import {
  Autoplay,
  Controller,
  FreeMode,
  Navigation,
  Thumbs,
} from "swiper/modules";

import { IMAGE_URI } from "@/config";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DeleteDeploy from "@/components/ui/module/deploy/delete";
import UpdateDeploy from "@/components/ui/module/deploy/update";
import DeployHistory from "@/components/ui/module/table/deployHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { setTableData } from "@/lib/store/slices/tableSlice";
import jwtDecode from "jwt-decode";
import _ from "lodash";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { numberWithCommas } from "@/lib/function";

type Image = {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
};

type Total = {
  id: number;
  brandId: number;
  campaignId: number;
  posmTypeName: string;
  posmTypeDescription: string;
  quantity: number;
  total: number;
  active: boolean;
  userCreate: number;
  createdAt: string;
  updatedAt: string;
};

const token_storage: any = process.env
  .NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;
export default function Detail({ param }: { param: { deployId: string } }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [deployDetail, setDeployDetail] = useState<any>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [roleId, setRoleId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const { access_token } = useAppSelector((state: any) => state.auth);
  const { data } = useAppSelector((state: any) => state.table);

  useEffect(() => {
    const token = localStorage.getItem(token_storage)
      ? localStorage.getItem(token_storage)
      : access_token;
    if (token) {
      const decoded: any = jwtDecode(token);
      const info: any = decoded.data;
      const roleId = info.roleId;
      const userId = info.userId;
      setRoleId(roleId);
      setUserId(userId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);
  const onRefreshData = () => {
    setCurrentTime(moment().valueOf());
  };

  useEffect(() => {
    //get detail deploy
    setLoading(true);
    axiosWithHeaders("post", NEXT_PUBLIC_DETAIL_DEPLOY_API, {
      id: router.query.deployId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              setDeployDetail(result);
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

    //get history deploy
    axiosWithHeaders("post", NEXT_PUBLIC_HISTORY_DEPLOY_API, {
      deployId: router.query.deployId,
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
  }, [dispatch, router.query.deployId, currentTime]);

  return (
    <Layout
      pageInfo={{
        title: "CHI TIẾT LẮP ĐẶT",
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
                {deployDetail?.images?.map((image: Image, index: number) => (
                  <SwiperSlide
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="flex justify-center items-center w-full"
                      onClick={() => setShowDialog(true)}
                    >
                      <picture className="w-full flex justify-center items-center">
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
                  <span className=" font-medium break-words ml-2">
                    {deployDetail?.campaignName}
                  </span>
                )}
              </div>
              <div>
                <span>Thương hiệu:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" font-medium break-words ml-2">
                    {deployDetail?.brandName}
                  </span>
                )}
              </div>
              <div>
                <span>Tên địa điểm:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {deployDetail?.locationName}
                  </span>
                )}
              </div>
              <div>
                <span>Địa chỉ:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {deployDetail?.address}-{deployDetail?.ward}-
                    {deployDetail?.district}-{deployDetail?.province}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>Vị trí: </span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <a
                    href={`http://maps.google.com?q=${deployDetail?.location}`}
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
                    {deployDetail?.channelName}
                  </span>
                )}
              </div>
              <div>
                <span>Vùng:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {deployDetail?.areaName}
                  </span>
                )}
              </div>
              <div>
                <span>Người thực hiện:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {deployDetail?.nameusercreate}
                  </span>
                )}
              </div>
              <div>
                <span>Thời gian:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {deployDetail?.timecreate} - {deployDetail?.datecreate}
                  </span>
                )}
              </div>
              {deployDetail?.totals?.length === 1 ? (
                <div>
                  <span>
                    Số lượng POSM {deployDetail?.totals[0]?.posmTypeName} :
                  </span>
                  {loading ? (
                    <Skeleton className="w-44 h-4 inline-block" />
                  ) : (
                    <span className=" break-words font-medium">
                      {deployDetail?.total
                        ? numberWithCommas(deployDetail?.total)
                        : 0}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <div>
                    <span>Số lượng POSM :</span>
                    {loading ? (
                      <Skeleton className="w-44 h-4 inline-block" />
                    ) : (
                      <span className=" break-words font-medium ml-2">
                        {deployDetail?.total
                          ? numberWithCommas(deployDetail?.total)
                          : 0}
                      </span>
                    )}
                  </div>
                  <div>
                    {deployDetail?.totals?.map((total: Total) => (
                      <div key={total?.id} className="flex gap-3">
                        +<span>{total?.posmTypeName}</span>:
                        <span className="font-medium">
                          {total?.total ? numberWithCommas(total?.total) : 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span>Ghi chú:</span>
                {loading ? (
                  <Skeleton className="w-44 h-4 inline-block" />
                ) : (
                  <span className=" break-words font-medium ml-2">
                    {deployDetail?.note}
                  </span>
                )}
              </div>
            </div>
            <iframe
              src={`https://maps.google.com/maps?q=${deployDetail?.location}&z=15&output=embed`}
              width="450"
              height="350"
              className="hidden lg:block"
            ></iframe>
          </div>
          <div className="flex justify-center gap-3 p-4">
            {(roleId === 1 || roleId === 2) && (
              <Button onClick={() => setShowDelete(true)} className="w-32">
                Xóa
              </Button>
            )}
            {(roleId === 1 ||
              roleId === 2 ||
              userId === deployDetail?.userCreate) && (
              <Button onClick={() => setShowUpdate(true)} className="w-32">
                Cập nhật
              </Button>
            )}
          </div>
        </div>
        <br />
        {data.length > 0 && <DeployHistory onRefreshData={onRefreshData} />}
        <br />
      </div>
      <Dialog
        open={showDialog}
        onOpenChange={() => {
          setShowDialog(false);
        }}
      >
        <DialogContent className="sm:max-w-[100vw] p-0 h-[90vh] lg:h-[100vh]">
          <div className="md:block flex items-center py-6 w-screen sm:w-screen ">
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
              {deployDetail?.images?.map((image: Image, index: number) => (
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
                {deployDetail?.images?.map((image: Image, index: number) => (
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
      <UpdateDeploy
        deployId={router.query?.deployId as string}
        setShowUpdate={setShowUpdate}
        showUpdate={showUpdate}
        onRefreshData={onRefreshData}
      />
      <DeleteDeploy
        query={router.query}
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        onRefreshData={onRefreshData}
      />
    </Layout>
  );
}
