import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMAGE_URI } from "@/config";
import {
  NEXT_PUBLIC_LIST_LOCATION_IN_COMPAIGN_API,
  NEXT_PUBLIC_LIST_PROVINCE_API,
} from "@/config/api";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { QrInfo } from "@/pages/scanqr";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import {
  FreeMode,
  Navigation,
  Thumbs,
  Controller as Controll,
} from "swiper/modules";

type Location = {
  locationId: number;
  code: string;
  locationName: string;
  province: string;
  district: string;
  ward: string;
  address: string;
};
type formValues = {
  location: Location | null;
  province: string;
  district: string;
};
type Province = {
  code: string;
  provinceName: string;
  provinceNameLatin: string;
};

type District = {
  districtName: string;
  districtNameLatin: string;
  provinceCode: string;
  provinceName: string;
};

type CheckLocationProps = {
  showQrInfo: boolean;
  setShowQrInfo: Dispatch<SetStateAction<boolean>>;
  qrInfo: QrInfo | null;
};
interface Image {
  originalname: string;
  destination: string;
  filename: string;
  path: string;
  filePath: string;
}

const CheckLocation = ({
  qrInfo,
  showQrInfo,
  setShowQrInfo,
}: CheckLocationProps) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [province, setProvince] = useState<string>("");
  const [districts, setDistricts] = useState<District[]>([]);
  const [district, setDistrict] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<formValues>();
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
  }, [qrInfo?.campaignId]);

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
  }, [province, district, qrInfo?.campaignId]);

  //resetData
  useEffect(() => {
    reset({
      province: "",
      district: "",
      location: null,
    });
    setLocations([]);
    setProvince("");
    setDistrict("");
  }, [reset, showQrInfo]);
  // create deploy

  const handleCreateDeploy: SubmitHandler<formValues> = async (
    data: formValues
  ) => {
    if (qrInfo?.campaignId && data?.location?.locationId) {
      router.push(
        `/campaign/${qrInfo?.campaignId}/location/${data?.location?.locationId}`
      );
    }
  };

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
        }}
      >
        <DialogContent className="sm:max-w-[500px] p-0">
          <div className="p-6 relative z-10 overflow-x-hidden max-h-[90vh]">
            <DialogHeader className="relative z-10 mb-10">
              <DialogTitle>Kiểm tra thông tin</DialogTitle>
            </DialogHeader>
            <>
              <div>
                <div>
                  <span>Hình ảnh:</span>
                  <span className="flex gap-2">
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
                  <span>Thương hiệu:</span>
                  <span className="pl-3 font-medium">{qrInfo?.brandName}</span>
                </div>
                <div>
                  <span>Chiến dịch:</span>
                  <span className="pl-3 font-bold">{qrInfo?.campaignName}</span>
                </div>
                <div>
                  <span>Kênh:</span>
                  <span className="pl-3 font-medium">
                    {qrInfo?.channelName}
                  </span>
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
                        <option
                          key={province.code}
                          value={province.provinceName}
                        >
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
                    {errors.district && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.district.message}
                      </p>
                    )}
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
                  </div>
                  {errors.location && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="mx-auto my-8 w-32">
                  Thông tin
                </Button>
              </form>
            </>
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

export default CheckLocation;
