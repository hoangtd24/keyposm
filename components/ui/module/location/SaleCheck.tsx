import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMAGE_URI } from "@/config";
import { QrInfo } from "@/pages/scanqr";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import {
  Controller as Controll,
  FreeMode,
  Navigation,
  Thumbs,
} from "swiper/modules";

type CheckLocationProps = {
  showQrInfo: boolean;
  setShowQrInfo: Dispatch<SetStateAction<boolean>>;
  qrInfo: QrInfo | null;
  setSaleCheck: Dispatch<SetStateAction<boolean>>;
};
interface Image {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
}

const SaleCheck = ({
  qrInfo,
  showQrInfo,
  setShowQrInfo,
  setSaleCheck,
}: CheckLocationProps) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  console.log(qrInfo);
  return (
    <>
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
      <Dialog
        open={showQrInfo}
        onOpenChange={() => {
          setShowQrInfo(!showQrInfo);
          setSaleCheck(false);
        }}
      >
        <DialogContent className="sm:max-w-[500px] p-0">
          <div className="p-6 relative z-10 overflow-x-hidden max-h-[90vh]">
            <DialogHeader className="relative z-10 mb-10">
              <DialogTitle>Kiểm tra thông tin</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <div>
                <span>Hình ảnh:</span>
                <span className="flex gap-2 my-3">
                  {qrInfo?.images?.slice(0, 2).map((img, index) => {
                    if (index === 1 && qrInfo?.images?.length > 2) {
                      return (
                        <div
                          key={index}
                          className="relative"
                          onClick={() => setShowDialog(true)}
                        >
                          <picture>
                            <img
                              src={`${IMAGE_URI}/${img?.filePath}`}
                              alt=""
                              className="w-32 h-32 object-cover"
                            />
                          </picture>
                          <span className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-[#00000080] text-xl text-[#fff]">
                            +{qrInfo?.images?.length - 2}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={index}
                        className="relative"
                        onClick={() => setShowDialog(true)}
                      >
                        <picture>
                          <img
                            src={`${IMAGE_URI}/${img?.filePath}`}
                            alt=""
                            className="w-32 h-32 object-cover"
                          />
                        </picture>
                      </div>
                    );
                  })}
                </span>
              </div>
              <div>
                <span>Chiến dịch:</span>
                <span className="pl-3 font-bold">{qrInfo?.campaignName}</span>
              </div>
              <div>
                <span>Thương hiệu:</span>
                <span className="pl-3 font-medium">{qrInfo?.brandName}</span>
              </div>
              <div>
                <span>Người tạo:</span>
                <span className="pl-3 font-medium">
                  {qrInfo?.nameusercreate}
                </span>
              </div>
              <div>
                <span>Thời gian:</span>
                <span className="pl-3 font-medium">{`${qrInfo?.timecreate} - ${qrInfo?.datecreate}`}</span>
              </div>
              <div>
                <span>Địa điểm:</span>
                <span className="pl-3 font-medium">{qrInfo?.locationName}</span>
              </div>
              <div>
                <span>Kênh:</span>
                <span className="pl-3 font-medium">{qrInfo?.channelName}</span>
              </div>
              <div>
                <span>Vùng:</span>
                <span className="pl-3 font-medium">{qrInfo?.areaName}</span>
              </div>
              <div>
                <span>Ghi chú:</span>
                <span className="pl-3 font-medium">{qrInfo?.note}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
              modules={[FreeMode, Navigation, Thumbs, Controll]}
            >
              {qrInfo?.images?.map((image: Image, index: number) => (
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
                modules={[Navigation, Thumbs, Controll]}
              >
                {qrInfo?.images?.map((image: Image, index: number) => (
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
    </>
  );
};

export default SaleCheck;
