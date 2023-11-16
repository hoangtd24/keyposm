import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  NEXT_PUBLIC_DETAIL_DEPLOY_API,
  NEXT_PUBLIC_UPLOAD_MULTIPLE_API,
  UPDATE_DEPLOY_API,
} from "@/config/api";
import {
  axiosWithHeaders,
  axiosWithHeadersUploadFile,
} from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useAppDispatch } from "@/lib/store";
import { dataURLtoFile } from "@/utils/dataUrlToFile";
import { Camera } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Skeleton } from "../../skeleton";
import { useToast } from "../../use-toast";
import MyWebcam from "../webcam/Webcam";
import { getLocation, position } from "@/utils/getLocation";

type Total = {
  id: number;
  brandId: number;
  campaignId: number;
  posmTypeName: string;
  posmTypeDescription: string;
  total: number;
  active: boolean;
  userCreate: number;
  createdAt: string;
  updatedAt: string;
};

type formValues = {
  totals: Total[];
  note: string;
};

type UpdateDeployProps = {
  showUpdate: boolean;
  setShowUpdate: Dispatch<SetStateAction<boolean>>;
  deployId: string;
  onRefreshData: () => void;
};
export default function UpdateDeploy({
  deployId,
  setShowUpdate,
  showUpdate,
  onRefreshData,
}: UpdateDeployProps) {
  const dispatch = useAppDispatch();
  const [deployDetail, setDeployDetail] = useState<any>(null);
  const [showDetailImage, setShowDetailImage] = useState<boolean>(false);
  const [checkImage, setCheckImage] = useState<{
    rule: string;
    message: string;
  }>({
    rule: "",
    message: "",
  });
  const [checkTotal, setCheckTotal] = useState<boolean>(false);
  const { toast } = useToast();
  const [location, setLocation] = useState<any>();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<formValues>();

  const { fields } = useFieldArray({
    name: "totals",
    control,
  });

  useEffect(() => {
    //get detail deploy
    axiosWithHeaders("post", NEXT_PUBLIC_DETAIL_DEPLOY_API, {
      id: deployId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              console.log(result);
              setDeployDetail(result);
              setValue("totals", result.totals);
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
  }, [dispatch, deployId, setValue]);

  useEffect(() => {
    reset({ note: "", totals: deployDetail?.totals });
    position({ setLocation });
    setImgSrc([]);
  }, [deployDetail?.totals, reset, showUpdate]);

  const handleUpdateDeploy: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    setLoading(true);
    const totalPosm = data.totals.reduce(
      (total, currentTotal) => total + Number(currentTotal.total),
      0
    );
    if (totalPosm === 0) {
      setCheckTotal(totalPosm === 0);
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
    const dataUpdate = {
      ...deployDetail,
      totals: data.totals.map((item) => {
        return {
          ...item,
          total: Number(item.total),
        };
      }),
      note: data.note,
      images: imgSrc.length > 0 ? res.data : [],
      location: `${location?.latitude},${location?.longitude}`,
    };
    axiosWithHeaders("post", UPDATE_DEPLOY_API, dataUpdate)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            toast({
              title: "Thông báo",
              description: "Gửi yêu cầu thành công",
            });
            onRefreshData();
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
    setShowUpdate(false);
  };
  return (
    <div>
      <Dialog
        open={showUpdate}
        onOpenChange={() => {
          setShowUpdate(false);
        }}
      >
        <DialogContent className="sm:max-w-[500px] p-0">
          <div className="p-6 relative z-10 overflow-x-hidden max-h-[90vh]">
            <DialogHeader className="relative z-10 mb-6">
              <DialogTitle>Cập nhật số lượng</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(handleUpdateDeploy)}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <table className="w-full border-spacing-4 mt-3">
                    <thead>
                      <tr>
                        <th className="text-left">Loại Posm</th>
                        <th className="text-left">Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => {
                        return (
                          <>
                            <tr key={field.id} className="py-3">
                              <td>
                                <input
                                  placeholder="name"
                                  {...register(
                                    `totals.${index}.posmTypeName` as const,
                                    {
                                      required: true,
                                      min: 0,
                                    }
                                  )}
                                  defaultValue={field.id}
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  placeholder="quantity"
                                  type="number"
                                  {...register(
                                    `totals.${index}.total` as const,
                                    {
                                      min: {
                                        value: 0,
                                        message:
                                          "Vui lòng nhập số lượng lớn hơn 0",
                                      },
                                      pattern: {
                                        value: /^(?:[1-9]\d*|\d)$/,
                                        message: "Vui lòng nhập vào một số",
                                      },
                                    }
                                  )}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  defaultValue={field.total}
                                />
                              </td>
                            </tr>
                            {errors.totals?.[index]?.total?.type ===
                              "pattern" && (
                              <p className="text-sm font-medium text-destructive">
                                {errors.totals?.[index]?.total?.message}
                              </p>
                            )}
                            {errors.totals?.[index]?.total?.type === "min" && (
                              <p className="text-sm font-medium text-destructive">
                                {errors.totals?.[index]?.total?.message}
                              </p>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                  {checkTotal && (
                    <p className="text-sm font-medium text-destructive">
                      Tổng số lượng phải lớn hơn 0
                    </p>
                  )}
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
                              <div
                                key={index}
                                className="relative"
                                onClick={() => setShowDetailImage(true)}
                              >
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
                            <div
                              key={index}
                              className="relative"
                              onClick={() => setShowDetailImage(true)}
                            >
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
      {showWebcam && (
        <MyWebcam
          showWebcam={showWebcam}
          setShowWebcam={setShowWebcam}
          setImgSrc={setImgSrc}
          setCheckImage={setCheckImage}
        />
      )}
    </div>
  );
}
