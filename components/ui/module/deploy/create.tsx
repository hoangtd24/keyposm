import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  CREATE_DEPLOY_API,
  NEXT_PUBLIC_LIST_LOCATION_IN_COMPAIGN_API,
  NEXT_PUBLIC_LIST_PROVINCE_API,
  NEXT_PUBLIC_LIST_TYPEPOSM_API,
  NEXT_PUBLIC_UPLOAD_MULTIPLE_API,
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
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import Select from "react-select";
import { Skeleton } from "../../skeleton";
import MyWebcam from "../webcam/Webcam";
import { getLocation, position } from "@/utils/getLocation";
import { District, Province, TypePosm, Location } from "./type";

type formValues = {
  province: string;
  district: string;
  location: Location | null;
  totals: TypePosm[];
  note: string;
};

type CreateProps = {
  showQrInfo: boolean;
  setShowQrInfo: Dispatch<SetStateAction<boolean>>;
  qrInfo: QrInfo | null;
};

const Create = ({ qrInfo, showQrInfo, setShowQrInfo }: CreateProps) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [province, setProvince] = useState<string>("");
  const [districts, setDistricts] = useState<District[]>([]);
  const [district, setDistrict] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [typePosms, setTypePosms] = useState<TypePosm[]>([]);
  const [checkImage, setCheckImage] = useState<{
    rule: string;
    message: string;
  }>({
    rule: "",
    message: "",
  });
  const [checkTotal, setCheckTotal] = useState<boolean>(false);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string[]>([]);
  const [location, setLocation] = useState<any>();
  const { toast } = useToast();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<formValues>();

  const { fields } = useFieldArray({
    name: "totals",
    control,
  });
  useEffect(() => {
    reset({
      province: "",
      district: "",
      location: null,
      totals: [],
      note: "",
    });
    setCheckImage({
      rule: "",
      message: "",
    });
    setLocations([]);
    setProvince("");
    setDistrict("");
    position({ setLocation });
    setCheckTotal(false);
    setImgSrc([]);
  }, [reset, showQrInfo]);
  useEffect(() => {
    axiosWithHeaders("get", NEXT_PUBLIC_LIST_PROVINCE_API, null)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              setProvinces(result.provinces);
              setDistricts(result.districts);
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });

    axiosWithHeaders("post", NEXT_PUBLIC_LIST_TYPEPOSM_API, {
      campaignId: Number(qrInfo?.campaignId),
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              setTypePosms(result);
              setValue("totals", result);
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [qrInfo?.campaignId, setValue, showQrInfo]);

  useEffect(() => {
    if (!province) {
      return;
    }
    axiosWithHeaders("post", NEXT_PUBLIC_LIST_LOCATION_IN_COMPAIGN_API, {
      campaignId: Number(qrInfo?.campaignId),
      province: province,
      district: district,
      search: "",
      offset: 0,
      limit: 1000,
      areaId: Number(qrInfo?.areaId),
      channelId: Number(qrInfo?.channelId),
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            if (result) {
              setLocations(result);
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [
    province,
    district,
    qrInfo?.campaignId,
    qrInfo?.areaId,
    qrInfo?.channelId,
  ]);

  // create deploy

  const handleCreateDeploy: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    setLoading(true);
    const totalPosm = data.totals.reduce(
      (total, currentTotal) => total + Number(currentTotal.quantity),
      0
    );
    if (totalPosm === 0) {
      setCheckTotal(totalPosm === 0);
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
      posmId: qrInfo?.posmId,
      campaignId: qrInfo?.campaignId,
      channelId: qrInfo?.channelId,
      areaId: qrInfo?.areaId,
      locationId: data?.location?.locationId,
      note: data.note,
      location: `${location?.latitude},${location?.longitude}`,
      totals: data.totals.map((total) => {
        return {
          id: total.id,
          brandId: total.brandId,
          campaignId: total.campaignId,
          posmTypeName: total.posmTypeName,
          posmTypeDescription: total.posmTypeDescription,
          total: Number(total.quantity),
        };
      }),
      images: res.data,
    };
    if (res.status === enums.STATUS_RESPONSE_OK) {
      axiosWithHeaders("post", CREATE_DEPLOY_API, dataCreate)
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            const { status, result, message } = response.data;
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
        <DialogContent className="sm:max-w-[500px] p-0">
          <div className="p-6 relative z-10 overflow-x-hidden lg:h-[500px] max-h-[90vh]">
            <DialogHeader className="relative z-10 mb-10">
              <DialogTitle>Lắp đặt</DialogTitle>
            </DialogHeader>
            <div>
              <div>
                <span>Thương hiệu:</span>
                <span className="pl-3 font-medium">{qrInfo?.brandName}</span>
              </div>
              <div>
                <span>Chiến dịch:</span>
                <span className="pl-3 font-bold">{qrInfo?.campaignName}</span>
              </div>
              <div>
                <span>Kênh:</span>
                <span className="pl-3 font-medium">{qrInfo?.channelName}</span>
              </div>
              <div>
                <span>Vùng:</span>
                <span className="pl-3 font-medium">{qrInfo?.areaName}</span>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(handleCreateDeploy)}
              className="flex flex-col gap-3"
            >
              <div className="pt-4 flex flex-col gap-2">
                <div className="space-y-2">
                  <label
                    htmlFor="province"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tỉnh/Thành phố
                  </label>
                  <select
                    {...register("province", {
                      required: {
                        value: true,
                        message: "Không được để trống dòng này",
                      },
                      onChange: (e) => {
                        setProvince(e.target.value);
                        setValue("location", null);
                      },
                    })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value={""}>Chọn thành phố</option>
                    {provinces.map((province: Province) => (
                      <option key={province.code} value={province.provinceName}>
                        {province.provinceName}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.province.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="district"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Quận/Huyện
                  </label>
                  <select
                    {...register("district", {
                      onChange: (e) => {
                        setDistrict(e.target.value);
                        setValue("location", null);
                      },
                    })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value={""}>Chọn quận huyện</option>
                    {districts
                      .filter(
                        (district: District) =>
                          district.provinceName === watch().province
                      )
                      .map((district: District) => (
                        <option
                          key={district.districtName}
                          value={district.districtName}
                        >
                          {district.districtName}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Địa điểm
                  </label>
                  <Controller
                    name="location"
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
                        options={locations.map((location) => {
                          return {
                            value: String(location.locationId),
                            label: location.locationName,
                            ...location,
                          };
                        })}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isSearchable={true}
                        placeholder="Chọn địa điểm"
                      />
                    )}
                  />
                  {errors.location && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.location.message}
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
                                  placeholder="0"
                                  type="number"
                                  {...register(
                                    `totals.${index}.quantity` as const,
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
                                />
                              </td>
                            </tr>
                            {errors.totals?.[index]?.quantity?.type ===
                              "pattern" && (
                              <p className="text-sm font-medium text-destructive">
                                {errors.totals?.[index]?.quantity?.message}
                              </p>
                            )}
                            {errors.totals?.[index]?.quantity?.type ===
                              "min" && (
                              <p className="text-sm font-medium text-destructive">
                                {errors.totals?.[index]?.quantity?.message}
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
                </div>
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
    </>
  );
};

export default Create;
