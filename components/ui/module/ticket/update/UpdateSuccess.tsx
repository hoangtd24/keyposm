import {
  axiosWithHeaders,
  axiosWithHeadersUploadFile,
} from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useAppDispatch } from "@/lib/store";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import {
  NEXT_PUBLIC_LIST_STATUS_API,
  NEXT_PUBLIC_UPDATE_TICKET_API,
  NEXT_PUBLIC_UPLOAD_MULTIPLE_API,
} from "@/config/api";
import Image from "next/image";
// Import Swiper styles
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_URI } from "@/config";
import { Camera } from "lucide-react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import Select from "react-select";

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
export default function UpdateSuccess({
  ticketId,
  setShowUpdate,
  showUpdate,
  listTypePosm,
  total,
  onRefreshData,
}: UpdateTicketProps) {
  const [status, setStatus] = useState<any>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState<any>();
  const [checkTotal, setCheckTotal] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const [statusChoose, setStatusChoose] = useState<any>(0);
  const [images, setImages] = useState<Image[]>([]);
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

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
  const position = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (err) => console.log(err)
    );
  };
  useEffect(() => {
    //get list status
    axiosWithHeaders("get", NEXT_PUBLIC_LIST_STATUS_API, null)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              const newResult = [result[4]];
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
    setImages([]);
    reset({ note: "", status: {}, images: [] });
    position();
    setCheckTotal(false);
    setCheck(false);
  }, [reset, showUpdate]);

  const handleUpdateTicket: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    const totalPosm = data.totals.reduce(
      (total, currentTotal) => total + currentTotal.total,
      0
    );
    if (totalPosm === total) {
      setCheckTotal(true);
      return;
    }

    if (!images.length) {
      setCheck(true);
      return;
    }
    const dataCreate = {
      id: Number(ticketId),
      note: data.note,
      images: images,
      status: Number(data.status.value),
      totals: listTypePosm,
      location: `${location?.latitude},${location?.longitude}`,
    };
    axiosWithHeaders("post", NEXT_PUBLIC_UPDATE_TICKET_API, dataCreate)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            setShowUpdate(false);
            onRefreshData();
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handlePreviewImage = async (e: any) => {
    setLoadingImg(true);
    const files = Array.from(e.target.files);
    let formData = new FormData();
    files.forEach((file: any) => formData.append("files", file));
    const res = await axiosWithHeadersUploadFile(
      "post",
      NEXT_PUBLIC_UPLOAD_MULTIPLE_API,
      formData
    );
    if (res.status === enums.STATUS_RESPONSE_OK) {
      setImages((prev) => [...res.data, ...prev]);
    }
    setLoadingImg(false);
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
                            <tr key={field.id}>
                              <td>{field.posmTypeName}</td>
                              <td>
                                <input
                                  placeholder="total"
                                  type="number"
                                  {...register(
                                    `totals.${index}.total` as const,
                                    {
                                      valueAsNumber: true,
                                      min: 0,
                                      max: field.total,
                                    }
                                  )}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  defaultValue={field.total}
                                  disabled
                                />
                              </td>
                            </tr>
                            {errors?.totals?.[index]?.total?.type === "min" && (
                              <p className="text-sm font-medium text-destructive">
                                Vui lòng nhập số lượng lớn hơn 0
                              </p>
                            )}
                            {errors?.totals?.[index]?.total?.type === "max" && (
                              <p className="text-sm font-medium text-destructive">
                                Vui lòng nhập số lượng nhỏ hơn {field.total + 1}
                              </p>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                  {checkTotal && statusChoose === "4" && (
                    <p className="text-sm font-medium text-destructive">
                      Tổng số lượng phải nhỏ hơn {total}
                    </p>
                  )}
                </div>
                <div className="space-y-2 mt-3">
                  <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Hình ảnh
                  </label>
                  <div>
                    <div className="flex items-center justify-between items-center">
                      <div className="flex gap-3">
                        <span
                          className="flex justify-center w-fit p-3 cursor-pointer"
                          onClick={() => inputRef.current?.click()}
                        >
                          <Camera size={90} />
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            multiple
                            ref={inputRef}
                            onChange={(e) => handlePreviewImage(e)}
                          />
                        </span>
                      </div>
                      <div className="flex gap-2 justify-center">
                        {loadingImg && (
                          <Skeleton className="w-36 h-36 bg-zinc-300" />
                        )}
                        {images.slice(0, 2).map((img, index) => {
                          if (index === 1 && images.length > 2) {
                            return (
                              <div key={index} className="relative">
                                <picture>
                                  <img
                                    src={`${IMAGE_URI}/${img.filePath}`}
                                    alt=""
                                    className="w-32 h-32 object-contain"
                                  />
                                </picture>
                                <span className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-[#00000080] text-xl text-[#fff]">
                                  +{images.length - 2}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div key={index} className="relative">
                              <picture>
                                <img
                                  src={`${IMAGE_URI}/${img.filePath}`}
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
                  {check && (
                    <p className="text-sm font-medium text-destructive">
                      Yêu cầu chụp ảnh xác thực
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
              <Button type="submit" className="mx-auto mt-8 mb-6 w-32">
                Gửi
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
