import {
  axiosWithHeaders,
  axiosWithHeadersUploadFile,
} from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  NEXT_PUBLIC_LIST_STATUS_API,
  NEXT_PUBLIC_UPDATE_TICKET_API,
  NEXT_PUBLIC_UPLOAD_MULTIPLE_API,
} from "@/config/api";
import { dataURLtoFile } from "@/utils/dataUrlToFile";
import { Camera } from "lucide-react";
import Image from "next/image";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import Select from "react-select";
import MyWebcam from "../../webcam/Webcam";
import { getLocation, position } from "@/utils/getLocation";

type Image = {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
};
type Option = {
  value: string;
  label: string;
};

type TypePosm = {
  id: number;
  ticketId: number;
  typePosmId: number;
  posmTypeName: string;
  posmTypeDescription: string;
  total: number;
};

type formValues = {
  status: Option;
  note: string;
  totals: TypePosm[];
  images: Image[];
};

type UpdateTicketProps = {
  showUpdate: boolean;
  setShowUpdate: Dispatch<SetStateAction<boolean>>;
  ticketId: string;
  listTypePosm: TypePosm[];
  total: number;
  onRefreshData: () => void;
};
export default function UpdateSuccessApart({
  ticketId,
  setShowUpdate,
  showUpdate,
  listTypePosm,
  total,
  onRefreshData,
}: UpdateTicketProps) {
  const [status, setStatus] = useState<any>();
  const [location, setLocation] = useState<any>();
  const [checkTotal, setCheckTotal] = useState<boolean>(false);
  const [checkImage, setCheckImage] = useState<{
    rule: string;
    message: string;
  }>({
    rule: "",
    message: "",
  });
  const [statusChoose, setStatusChoose] = useState<any>(0);
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string[]>([]);
  const { toast } = useToast();

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
    //get list status
    axiosWithHeaders("get", NEXT_PUBLIC_LIST_STATUS_API, null)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              const newResult = [result[3], result[4]];
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
    setValue("totals", listTypePosm);
  }, [listTypePosm, setValue]);

  useEffect(() => {
    reset({ note: "", status: {}, images: [] });
    position({ setLocation });
    setCheckTotal(false);
    setCheckImage({
      rule: "",
      message: "",
    });
    setImgSrc([]);
    setStatusChoose(0);
  }, [reset, showUpdate]);

  const handleUpdateTicket: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    setLoading(true);
    const totalPosm = data.totals.reduce(
      (total, currentTotal) => total + Number(currentTotal.total),
      0
    );
    if (totalPosm === total && statusChoose === "4") {
      setCheckTotal(true);
      setLoading(false);
      return;
    }

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
      id: Number(ticketId),
      note: data.note,
      images: res.data,
      status: Number(data.status.value),
      totals:
        data.status.value === "4"
          ? listTypePosm.map((typePosm, index) => {
              return {
                ...typePosm,
                total: Number(data.totals[index].total),
              };
            })
          : listTypePosm,
      location: `${location?.latitude},${location?.longitude}`,
    };
    if (res.status === enums.STATUS_RESPONSE_OK) {
      axiosWithHeaders("post", NEXT_PUBLIC_UPDATE_TICKET_API, dataCreate)
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            onRefreshData();
            toast({
              title: "Thông báo",
              description: "Cập nhật trạng thái thành công",
            });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
    setShowUpdate(false);
    setLoading(false);
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
            <div className="space-y-2 mb-4">
              <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Số lượng sự cố chưa xử lí
              </label>
              <table className="w-full border-spacing-4 mt-3">
                <thead>
                  <tr>
                    <th className="text-left text-md">Loại Posm</th>
                    <th className="text-left text-md">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => {
                    return (
                      <tr key={field.id}>
                        <td>{field.posmTypeName}</td>
                        <td>{field.total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
                        onChange={(e) => {
                          setStatusChoose(Number(e?.value));
                          setValue("status", {
                            value: e?.value as string,
                            label: e?.label as string,
                          });
                        }}
                      />
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                {statusChoose === 5 ? (
                  <div className="space-y-2">
                    <table className="w-full border-spacing-4 mt-3">
                      <thead>
                        <tr>
                          <th className="text-left w-[50%]">Loại Posm</th>
                          <th className="text-left">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, index) => {
                          return (
                            <tr key={field.id}>
                              <td className="w-[50%]">{field.posmTypeName}</td>
                              <td>
                                <input
                                  placeholder="0"
                                  type="number"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  defaultValue={field.total}
                                  value={field.total}
                                  disabled
                                />
                              </td>
                              {errors?.totals?.[index]?.total?.type ===
                                "min" && (
                                <td className="text-sm font-medium text-destructive">
                                  Vui lòng nhập số lượng lớn hơn 0
                                </td>
                              )}
                              {errors?.totals?.[index]?.total?.type ===
                                "max" && (
                                <td className="text-sm font-medium text-destructive">
                                  Vui lòng nhập số lượng nhỏ hơn{" "}
                                  {field.total + 1}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {checkTotal && statusChoose === 5 && (
                      <p className="text-sm font-medium text-destructive">
                        Tổng số lượng phải nhỏ hơn {total + 1}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <table className="w-full border-spacing-4 mt-3">
                      <thead>
                        <tr>
                          <th className="text-left w-[50%]">Loại Posm</th>
                          <th className="text-left">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, index) => {
                          return (
                            <>
                              <tr key={field.id}>
                                <td className="w-[50%]">
                                  {field.posmTypeName}
                                </td>
                                <td>
                                  <input
                                    placeholder="0"
                                    type="number"
                                    {...register(
                                      `totals.${index}.total` as const,
                                      {
                                        max: {
                                          value: field.total,
                                          message: field.total
                                            ? `Số lượng phải nhỏ hơn ${field.total}`
                                            : "Số lượng phải bằng 0",
                                        },
                                        min: {
                                          value: 0,
                                          message: "Số lượng phải lớn hơn 0",
                                        },
                                        pattern: {
                                          value: /^(?:[1-9]\d*|\d)$/,
                                          message: "Vui lòng nhập vào một số",
                                        },
                                      }
                                    )}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  />
                                </td>
                              </tr>
                              {errors.totals?.[index]?.total?.type ===
                                "pattern" && (
                                <tr className="text-sm font-medium text-destructive">
                                  {errors.totals?.[index]?.total?.message}
                                </tr>
                              )}
                              {errors.totals?.[index]?.total?.type ===
                                "min" && (
                                <tr className="text-sm font-medium text-destructive">
                                  {errors.totals?.[index]?.total?.message}
                                </tr>
                              )}
                              {errors.totals?.[index]?.total?.type ===
                                "max" && (
                                <tr className="text-sm font-medium text-destructive">
                                  {errors.totals?.[index]?.total?.message}
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                    {checkTotal && statusChoose === 4 && (
                      <p className="text-sm font-medium text-destructive">
                        Tổng số lượng phải nhỏ hơn {total + 1}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2 mt-3">
                  <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Hình ảnh
                  </label>
                  <div>
                    <div className="flex items-center justify-between items-center">
                      <div className="flex gap-3">
                        <span
                          className="flex w-fit p-3 cursor-pointer"
                          onClick={() => setShowWebcam(true)}
                        >
                          <Camera size={90} />
                        </span>
                      </div>
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
                                    className="w-32 h-32 object-contain"
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
                                  className="w-32 h-32 object-contain"
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
      <Dialog
        open={showWebcam}
        onOpenChange={() => {
          setShowWebcam(!showWebcam);
        }}
      >
        <DialogContent className="sm:max-w-[500px] p-0 max-h-[90vh]">
          <MyWebcam
            showWebcam={showWebcam}
            setShowWebcam={setShowWebcam}
            setImgSrc={setImgSrc}
            setCheckImage={setCheckImage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
