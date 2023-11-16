import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  NEXT_PUBLIC_UPLOAD_MULTIPLE_API,
  SALE_CREATE_DEPLOY_API,
} from "@/config/api";
import {
  axiosWithHeaders,
  axiosWithHeadersUploadFile,
} from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { QrInfo } from "@/pages/scanqr";
import { dataURLtoFile } from "@/utils/dataUrlToFile";
import { Camera } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Skeleton } from "../../skeleton";
import MyWebcam from "../webcam/Webcam";
import SaleUpdateDeploy from "./SaleUpdate";
import { getLocation, position } from "@/utils/getLocation";

type formValues = {
  note: string;
};

type CreateProps = {
  showQrInfo: boolean;
  setShowQrInfo: Dispatch<SetStateAction<boolean>>;
  qrInfo: QrInfo | null;
  alert: boolean;
  setAlert: Dispatch<SetStateAction<boolean>>;
};

const SaleCreate = ({
  qrInfo,
  showQrInfo,
  setShowQrInfo,
  alert,
  setAlert,
}: CreateProps) => {
  const [checkImage, setCheckImage] = useState<{
    rule: string;
    message: string;
  }>({
    rule: "",
    message: "",
  });
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string[]>([]);
  const [location, setLocation] = useState<any>();
  const { toast } = useToast();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formValues>();

  useEffect(() => {
    reset({
      note: "",
    });
    setCheckImage({
      rule: "",
      message: "",
    });
    position({ setLocation });
    setImgSrc([]);
  }, [reset, showQrInfo]);

  const handleCreateDeploy: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    setLoading(true);
    if (!imgSrc.length) {
      setCheckImage({
        rule: "min",
        message: "Vui lòng chụp ảnh xác thực",
      });
      setLoading(false);
      return;
    }
    if (imgSrc.length > 5) {
      setCheckImage({
        rule: "max",
        message: "Vui lòng chọn ít hơn 6 ảnh",
      });
      setLoading(false);
      return;
    }
    if (!location?.latitude || !location?.longitude) {
      getLocation({ setLocation, toast });
      setLoading(false);
      return;
    }
    let formData = new FormData();
    imgSrc.forEach(async (img) => {
      const file = dataURLtoFile(img, "uploaded_file.jpg");
      formData.append("files", file);
    });
    const res = await axiosWithHeadersUploadFile(
      "post",
      NEXT_PUBLIC_UPLOAD_MULTIPLE_API,
      formData
    );
    const dataCreate = {
      posmId: Number(qrInfo?.posmId),
      campaignId: Number(qrInfo?.campaignId),
      note: data.note,
      location: `${location?.latitude},${location?.longitude}`,
      images: res.data,
    };
    if (res.status === enums.STATUS_RESPONSE_OK) {
      axiosWithHeaders("post", SALE_CREATE_DEPLOY_API, dataCreate)
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            const { status, message } = response.data;
            if (status === enums.STATUS_RESPONSE_OK) {
              setShowQrInfo(false);
              toast({
                title: "Thông báo",
                description: "Tạo lắp đặt thành công",
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
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog
        open={showQrInfo}
        onOpenChange={() => {
          setShowQrInfo(!showQrInfo);
        }}
      >
        <DialogContent
          className="sm:max-w-[500px] p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-6 relative z-10 overflow-x-hidden lg:h-[500px] max-h-[90vh]">
            <DialogHeader className="relative z-10 mb-8">
              <DialogTitle>Lắp đặt</DialogTitle>
            </DialogHeader>
            <div>
              <div>
                <span>Chiến dịch:</span>
                <span className="pl-3 font-bold">{qrInfo?.campaignName}</span>
              </div>
              <div>
                <span>Thương hiệu:</span>
                <span className="pl-3 font-medium">{qrInfo?.brandName}</span>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(handleCreateDeploy)}
              className="flex flex-col gap-3"
            >
              <div className="pt-4 flex flex-col gap-2">
                <div className="space-y-2 mt-3">
                  <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Hình ảnh
                  </label>
                  <div className="flex items-center justify-between items-center">
                    <span
                      className="flex justify-center w-fit p-3 cursor-pointer"
                      onClick={() => setShowWebcam(true)}
                    >
                      <Camera size={100} />
                    </span>
                    <div className="flex gap-2 justify-center">
                      {loadingImg && (
                        <Skeleton className="w-36 h-36 bg-zinc-300" />
                      )}
                      {imgSrc.slice(0, 2).map((img, index) => {
                        if (index === 1 && imgSrc.length > 2) {
                          return (
                            <div key={index} className="relative">
                              <picture>
                                <img
                                  src={img}
                                  alt=""
                                  className="w-32 object-contain"
                                />
                              </picture>
                              <span className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-[#00000080] text-xl text-[#fff]">
                                +{imgSrc.length - 2}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div key={index} className="relative">
                            <picture>
                              <img
                                src={img}
                                alt=""
                                className="w-32 object-contain"
                              />
                            </picture>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {checkImage.rule && (
                    <p className="text-sm font-medium text-destructive">
                      {checkImage.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ghi chú
                  </label>
                  <textarea
                    {...register("note")}
                    className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="mx-auto my-8 w-40"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>{" "}
                    <span>Đang gửi ...</span>
                  </div>
                ) : (
                  "Gửi"
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showWebcam}
        onOpenChange={() => {
          setShowWebcam(!showWebcam);
        }}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
          <MyWebcam
            showWebcam={showWebcam}
            setShowWebcam={setShowWebcam}
            setImgSrc={setImgSrc}
            setCheckImage={setCheckImage}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={alert}
        onOpenChange={() => {
          setAlert(!alert);
        }}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
          <p className="mt-3">
            Mã QR đã được lắp đặt rồi . Thông tin gửi lên sẽ cần được kiểm tra
            lại từ quản trị viên của hệ thống
          </p>
          <DialogHeader className="relative z-10 mb-10">
            <DialogTitle className="text-center">
              Bạn có muốn tiếp tục không ?
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center gap-5">
            <Button className="w-32" onClick={() => setAlert(false)}>
              Không
            </Button>
            <Button className="w-32" onClick={() => setShowUpdate(true)}>
              Có
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SaleUpdateDeploy
        showUpdate={showUpdate}
        setShowUpdate={setShowUpdate}
        deployId={qrInfo?.deployId as number}
        setAlert={setAlert}
      />
    </>
  );
};

export default SaleCreate;
