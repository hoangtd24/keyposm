import {
  NEXT_PUBLIC_LIST_STATUS_API,
  NEXT_PUBLIC_LIST_USER_CAMPAIGN_API,
  NEXT_PUBLIC_UPDATE_TICKET_API,
  NEXT_PUBLIC_UPLOAD_MULTIPLE_API,
} from "@/config/api";
import {
  axiosWithHeaders,
  axiosWithHeadersUploadFile,
} from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "react-select";
// Import Swiper styles
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { dataURLtoFile } from "@/utils/dataUrlToFile";
import { Camera } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import MyWebcam from "../../webcam/Webcam";

type Image = {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
};

type User = {
  id: number;
  username: string;
  name: string;
  roleName: string;
};

type Option = {
  value: string;
  label: string;
};
type formValues = {
  status: Option;
  note: string;
  images: Image[];
  listUsers: Option[];
};

type UpdateTicketProps = {
  showUpdate: boolean;
  setShowUpdate: Dispatch<SetStateAction<boolean>>;
  ticketId: string;
  statusId: number;
  campaignId: number;
  onRefreshData: () => void;
};
export default function UpdateProcessing({
  ticketId,
  setShowUpdate,
  showUpdate,
  statusId,
  campaignId,
  onRefreshData,
}: UpdateTicketProps) {
  const [status, setStatus] = useState<any>();
  const [images, setImages] = useState<Image[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [checkImage, setCheckImage] = useState<{
    rule: string;
    message: string;
  }>({
    rule: "",
    message: "",
  });
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<formValues>();
  useEffect(() => {
    //get list status
    axiosWithHeaders("get", NEXT_PUBLIC_LIST_STATUS_API, null)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              const newResult = [result[2]];
              setStatus(newResult);
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });

    axiosWithHeaders("post", NEXT_PUBLIC_LIST_USER_CAMPAIGN_API, {
      search: "",
      offset: 0,
      limit: 100,
      campaignId: campaignId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              setUsers(result);
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [campaignId]);

  useEffect(() => {
    reset({ note: "", status: {}, images: [], listUsers: [] });
    setCheckImage({
      rule: "",
      message: "",
    });
    setImgSrc([]);
  }, [reset, showUpdate]);

  const handleUpdateTicket: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    setLoading(true);
    if (imgSrc.length > 5) {
      setCheckImage({
        rule: "max",
        message: "Vui lòng chọn ít hơn 6 ảnh",
      });
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
      note: data.note,
      images: imgSrc.length > 0 ? res.data : [],
      status: Number(data.status.value),
      id: ticketId,
      listUsers: data.listUsers.map((user) => Number(user.value)),
    };
    if (res.status === enums.STATUS_RESPONSE_OK) {
      axiosWithHeaders("post", NEXT_PUBLIC_UPDATE_TICKET_API, dataCreate)
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            const { status, result, message } = response.data;
            onRefreshData();
            toast({
              title: "Thông báo",
              description: "Cập nhật trạng thái thành công",
            });
            console.log(message);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }

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
              <DialogTitle>Cập nhật trạng thái</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(handleUpdateTicket)}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <label
                    htmlFor="province"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Trạng thái
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Không được để trống dòng này",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        name="status"
                        options={status.map((item: any) => {
                          return {
                            value: String(item.id),
                            label: item.statusName,
                          };
                        })}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isSearchable={true}
                        placeholder="Chọn trạng thái"
                      />
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tài khoản chỉ định
                  </label>
                  <Controller
                    name="listUsers"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Không được để trống dòng này",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        name="location"
                        closeMenuOnSelect={false}
                        blurInputOnSelect={false}
                        isMulti
                        options={users.map((user) => {
                          return {
                            value: String(user.id),
                            label: user.name,
                          };
                        })}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isSearchable={true}
                        placeholder="Chọn tài khoản"
                      />
                    )}
                  />
                  {errors.listUsers && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.listUsers.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 mt-3">
                  <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Hình ảnh
                  </label>
                  <div>
                    <div className="flex items-center justify-between items-center">
                      <span
                        className="flex justify-center w-fit p-3 cursor-pointer"
                        onClick={() => setShowWebcam(true)}
                      >
                        <Camera size={90} />
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
                  </div>
                  {checkImage.rule && (
                    <p className="text-sm font-medium text-destructive">
                      {checkImage.message}
                    </p>
                  )}
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
