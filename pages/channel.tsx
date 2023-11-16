import Layout from "@/components/ui/module/layout";
import FilterChannel from "@/components/ui/module/filter/channel";
import { useEffect } from "react";
import * as enums from "@/lib/enums";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import { setBrandLoading, setBrandData } from "@/lib/store/slices/brandSlice";
import { NEXT_PUBLIC_API_DROPDOWN_BRAND } from "@/config/api";
import { useAppDispatch } from "@/lib/store";

export default function Channel() {
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
        console.count("brand load");
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <Layout
            pageInfo={{
                title: "Danh sách kênh",
                description: "Tạo, chỉnh sửa, quản lý kênh của bạn."
            }}
        >
            <FilterChannel />
        </Layout>
    )
}