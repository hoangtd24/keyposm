import EmptyAnimation from "@/components/ui/module/animate/empty";
import _ from "lodash";
import dynamic from 'next/dynamic';

import {
    NEXT_PUBLIC_DETAIL_DEPLOY_API,
} from "@/config/api";
import { IMAGE_URI } from "@/config";

import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useState } from "react";
import { Label } from "@/components/ui/label"
import { numberWithCommas } from "@/lib/function";
import Loading from "../loading";
import { Loader2 } from "lucide-react";


const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
)

const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);

const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

type MapLocationProps = {
    data: {
        center: any,
        markers: any[]
    }
}

export default function MapLocation({ data }: MapLocationProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [listImage, setListImage] = useState<any>([]);
    const [detail, setDetail] = useState<any>(null);

    const getDetailDeploy = (id: number) => {
        setLoading(true)
        axiosWithHeaders("post", NEXT_PUBLIC_DETAIL_DEPLOY_API, {
            id,
        })
            .then((response: any) => {
                if (response && response.status === enums.STATUS_RESPONSE_OK) {
                    const { status, result, message } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        if (result) {
                            setDetail(result);
                            console.log(result)
                            if (result.hasOwnProperty("images")) {
                                setListImage(result.images)
                            }
                        }
                    } else {
                        console.log(message);
                    }
                }
            })
            .catch((error: any) => {
                console.log(error);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
            })
    }

    if (data.markers && _.isArray(data.markers) && data.markers.length === 0) {
        return (
            <div className="flex flex-col space-y-1 justify-center items-center h-80 bg-background rounded-md mt-2">
                <EmptyAnimation />
                <p className="text-gray-400">Không có dữ liệu</p>
            </div>
        )
    }

    return (
        <>
            <style jsx global>{`
                .leaflet-default-icon-path {
                    background-image: url(../../assets/marker-icon.png);
                }
                .leaflet-control-layers-toggle {
                    background-image: url(../../assets/layers.png);
                    width: 36px;
                    height: 36px;
                }
                .leaflet-retina .leaflet-control-layers-toggle {
                    background-image: url(../../assets/layers-2x.png);
                    background-size: 26px 26px;
                }
                .leaflet-popup-content{
                    width: 100%!important;
                }
                .leaflet-popup-content p{
                    margin: unset;
                }
            `}</style>
            <div className="w-full h-[calc(100vh-380px)] mt-3 rounded-md">
                <MapContainer className="w-full h-full z-30" center={[20.9807068, 105.8401808]} zoom={12}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        data.markers && data.markers.length > 0 && data.markers.map((item: any, index: number) => {
                            return (
                                <Marker key={index} position={item.position}
                                    eventHandlers={{
                                        click: (e) => {
                                            getDetailDeploy(item.id);
                                            // console.log('marker clicked', item)
                                        },
                                    }}

                                >
                                    <Popup className="w-auto min-w-[600px]">
                                        {detail && (
                                            <div className="px-4 py-3 space-y-0.5">
                                                {loading ? (
                                                    <>
                                                        <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
                                                            <Loader2 className="animate-spin w-12 h-12" />
                                                            <Label>Đang tải dữ liệu</Label>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-full">
                                                            <p className="text-sm font-bold">{detail.locationName}</p>
                                                        </div>
                                                        <div className="w-full">
                                                            <p className="text-sm font-bold line-clamp-2 m-0"> <span className="text-black/60 font-normal sm:text-sm">Địa chỉ:</span>{detail.address}</p>
                                                        </div>
                                                        <div className="w-full">
                                                            <span className="text-black/60 text-xs sm:text-sm">Chiến dịch:</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{` ` + detail.campaignName}</Label>
                                                        </div>
                                                        <div className="grid grid-cols-5">
                                                            <div className="col-span-3">
                                                                <div className="w-full">
                                                                    <span className="text-black/60 text-xs sm:text-sm">Thương hiệu:</span>
                                                                    <Label className="font-medium truncate text-xs sm:text-sm">{` ` + detail.brandName}</Label>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <div className="w-full">
                                                                    <span className="text-black/60 text-xs sm:text-sm">Số lượng:</span>
                                                                    <Label className="font-medium truncate text-xs sm:text-sm">{detail.hasOwnProperty("total") && detail.total ? ` ` + numberWithCommas(detail.total) : ` ` + 0}</Label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-5">
                                                            <div className="col-span-3">
                                                                <div className="w-full">
                                                                    <span className="text-black/60 text-xs sm:text-sm">Vùng:</span>
                                                                    <Label className="font-medium truncate text-xs sm:text-sm">{` ` + detail.areaName}</Label>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <div className="w-full">
                                                                    <span className="text-black/60 text-xs sm:text-sm">Kênh:</span>
                                                                    <Label className="font-medium truncate text-xs sm:text-sm">{` ` + detail.channelName}</Label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full">
                                                            <span className="text-black/60 text-xs sm:text-sm">Thời gian thực hiện:</span>
                                                            <Label className="font-medium truncate text-xs sm:text-sm">{` ` + detail.datecreate + ` ` + detail.timecreate}</Label>
                                                        </div>
                                                        <div className="grid grid-col-5 w-full gap-3 p-4">
                                                            {listImage.length > 0 && listImage.map((item: any, index: number) => {
                                                                return (
                                                                    <div key={index}>
                                                                        <picture>
                                                                            <img src={`${IMAGE_URI}/${item.filePath}`} alt="" className="h-48 object-contain" />
                                                                        </picture>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* {loading ? (
                                            <></>
                                        ) : <div className="grid grid-col-5 w-full gap-3">
                                            {listImage.length > 0 && listImage.map((item: any, index: number) => {
                                                return (
                                                    <div key={index}>
                                                        <picture>
                                                            <source srcSet={`${IMAGE_URI}/${item.filePath}`} />
                                                            <img src={`${IMAGE_URI}/${item.filePath}`} alt="" className="h-48 object-contain" />
                                                        </picture>
                                                    </div>
                                                )
                                            })}
                                        </div>} */}
                                    </Popup>
                                </Marker>
                            )
                        })
                    }
                </MapContainer>
            </div>
        </>
    )
}