import Layout from "@/components/ui/module/layout";
import FilterLocation from "@/components/ui/module/filter/location";
import { useAppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import { setProvinceLoading, setProvinceData } from "@/lib/store/slices/provinceSlice";
import { setDistrictLoading, setDistrictData } from "@/lib/store/slices/districtSlice";
import _ from "lodash"
import * as enums from "@/lib/enums";

import { NEXT_PUBLIC_LIST_ADDRESS_API } from "@/config/api";


export default function Location() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getAddressDropdown = async () => {
            dispatch(setProvinceLoading(true));
            dispatch(setDistrictLoading(true))
            axiosWithHeaders("get", NEXT_PUBLIC_LIST_ADDRESS_API, null)
                .then((response: any) => {
                    if (response && response.status === enums.STATUS_RESPONSE_OK) {
                        const {
                            status,
                            result,
                            message
                        } = response.data;
                        if (status === enums.STATUS_RESPONSE_OK) {
                            // console.log(result)
                            if (result) {
                                const {
                                    provinces,
                                    districts
                                } = result;
                                dispatch(setDistrictData(districts));
                                dispatch(setProvinceData(provinces))
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
                    dispatch(setProvinceLoading(false));
                    dispatch(setDistrictLoading(false))
                });
        }
        getAddressDropdown();
        console.count("get address")
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Layout
            pageInfo={{
                title: "Danh sách địa điểm",
                description: "Tạo, chỉnh sửa, quản lý địa điểm."
            }}
        >
            <FilterLocation />
        </Layout>
    )
}