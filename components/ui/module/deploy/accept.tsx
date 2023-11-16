import { Button } from "@/components/ui/button";
import { IMAGE_URI } from "@/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Autoplay, Controller, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Dialog, DialogContent } from "../../dialog";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import { NEXT_PUBLIC_HISTORY_DEPLOY_ACCEPT_API } from "@/config/api";
import * as enums from "@/lib/enums";
import { useToast } from "@/components/ui/use-toast";
import jwtDecode from "jwt-decode";
import { useAppSelector } from "@/lib/store";
import { numberWithCommas } from "@/lib/function";

type Image = {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
};

type AcceptProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  historyDetail: any;
  onRefreshData: () => void;
};
const token_storage: any = process.env
  .NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;
const Aceept = ({
  open,
  setOpen,
  historyDetail,
  onRefreshData,
}: AcceptProps) => {
  const { toast } = useToast();
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
  const handleAcceptDeploy = async () => {
    axiosWithHeaders("post", NEXT_PUBLIC_HISTORY_DEPLOY_ACCEPT_API, {
      id: historyDetail?.id,
      deployId: historyDetail?.deployId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            onRefreshData();
            toast({
              title: "Thông báo",
              description: message,
            });
          } else {
            toast({
              title: "Thông báo",
              description: message,
            });
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    setOpen(false);
  };
  return (
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
                slidesPerView={1}
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
                          className="w-48 h-48 object-cover"
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
                {historyDetail?.timecreate} - {historyDetail?.datecreate}
              </span>
            </div>
            <div>
              <span>Trạng thái:</span>
              <span className="font-medium break-words ml-2">
                {historyDetail?.statusName}
              </span>
            </div>
            {historyDetail?.totals?.length === 1 ? (
              <div className="flex items-center gap-3">
                <span>
                  Số lượng POSM {historyDetail?.totals[0]?.posmTypeName} :
                </span>
                <span className=" break-words font-medium ml-2">
                  {historyDetail?.total
                    ? numberWithCommas(historyDetail?.total)
                    : 0}
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3">
                  <span>Số lượng POSM :</span>
                  <span className=" break-words font-medium ml-2">
                    {historyDetail?.total
                      ? numberWithCommas(historyDetail?.total)
                      : 0}
                  </span>
                </div>
                <div>
                  {historyDetail?.totals?.map((total: any) => (
                    <div key={total?.id} className="flex gap-3">
                      +<span>{total?.posmTypeName}</span>:
                      <span className="font-medium ml-2">
                        {total?.total ? numberWithCommas(total?.total) : 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span>Ghi chú:</span>
              <span className="font-medium break-words ml-2">
                {historyDetail?.note}
              </span>
            </div>
            {historyDetail?.status === 1 && roleId !== 4 && (
              <div className="flex justify-center mt-3">
                <Button className="w-36" onClick={handleAcceptDeploy}>
                  Duyệt
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Aceept;
