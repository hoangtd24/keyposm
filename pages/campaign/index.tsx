import Layout from "@/components/ui/module/layout";
import FilterCampaign from "@/components/ui/module/filter/campaign";
import { useAppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import { setBrandLoading, setBrandData } from "@/lib/store/slices/brandSlice";
import { setPosmLoading, setPosmDropdownData } from "@/lib/store/slices/typeDefaultSlice";
import { setCampaignLoading, setCampaignTypeData } from "@/lib/store/slices/campaignSlice";

import _ from "lodash";
import * as enums from "@/lib/enums";
import {
    NEXT_PUBLIC_API_DROPDOWN_BRAND,
    NEXT_PUBLIC_CAMPAIGN_TYPE_API,
    NEXT_PUBLIC_LIST_TYPE_POSM_DROPDOWN
} from "@/config/api";
import { TypeDefaultItem } from "@/lib/store/slices/typeDefaultSlice";

export default function Campaign() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const getListBrandDropdown = async () => {
            dispatch(setBrandLoading(true));
            axiosWithHeaders("get", NEXT_PUBLIC_API_DROPDOWN_BRAND, null)
                .then((response: any) => {
                    if (response && response.status === enums.STATUS_RESPONSE_OK) {
                        const {
                            status,
                            result,
                            message
                        } = response.data;
                        if (status === enums.STATUS_RESPONSE_OK) {
                            dispatch(setBrandData(result));
                        } else {
                            console.log(message);
                        }
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
                .finally(() => {
                    dispatch(setBrandLoading(false));
                });
        }
        getListBrandDropdown();

        const getListCampaignType = async () => {
            dispatch(setCampaignLoading(true));
            axiosWithHeaders("get", NEXT_PUBLIC_CAMPAIGN_TYPE_API, null)
                .then((response: any) => {
                    if (response && response.status === enums.STATUS_RESPONSE_OK) {
                        const {
                            status,
                            result,
                            message
                        } = response.data;
                        if (status === enums.STATUS_RESPONSE_OK) {
                            dispatch(setCampaignTypeData(result));
                        } else {
                            console.log(message);
                        }
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
                .finally(() => {
                    dispatch(setBrandLoading(false));
                });
        }
        getListCampaignType();

        const getListTypeDefault = async () => {
            dispatch(setPosmLoading(true));
            axiosWithHeaders("post", NEXT_PUBLIC_LIST_TYPE_POSM_DROPDOWN, null)
                .then((response: any) => {
                    if (response && response.status === enums.STATUS_RESPONSE_OK) {
                        const {
                            result,
                            status,
                            message,
                        } = response.data;
                        if (status === enums.STATUS_RESPONSE_OK) {
                            const list: TypeDefaultItem[] = _.cloneDeep(result);
                            list.map((item: TypeDefaultItem, index: number) => {
                                item.tempId = index + 1;
                            })

                            // list.push({
                            //     tempId: 0,
                            //     posmTypeName: "Khác",
                            //     posmTypeDescription: "Khác",
                            //     images: [],
                            // })

                            dispatch(setPosmDropdownData(list))
                        } else {
                            console.log(message)
                        }
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
                .finally(() => {
                    dispatch(setPosmLoading(false));
                    // setLoading(false);
                })
        }
        getListTypeDefault();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout pageInfo={{
            title: "Danh sách chiến dịch",
            description: "Tạo, chỉnh sửa, quản lý chiến dịch của bạn."
        }}>
            <FilterCampaign />
        </Layout>
    )
}