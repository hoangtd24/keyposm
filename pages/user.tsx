import Layout from "@/components/ui/module/layout";
import FilterUser from "@/components/ui/module/filter/user";
import { useAppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { setRoleData, setRoleLoading } from "@/lib/store/slices/roleSlice";
import { setBrandData, setBrandLoading } from "@/lib/store/slices/brandSlice";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash";
import {
    NEXT_PUBLIC_API_DROPDOWN_ROLE,
    NEXT_PUBLIC_API_DROPDOWN_BRAND
} from "@/config/api";
import { BrandItem } from "@/components/ui/module/dropdown/brand";
import { RoleItem } from "@/components/ui/module/dropdown/role";

export default function Users() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getListRoleDropdown = async () => {
            dispatch(setRoleLoading(true));
            axiosWithHeaders("get", NEXT_PUBLIC_API_DROPDOWN_ROLE, null)
                .then((response: any) => {
                    if (response && response.status === enums.STATUS_RESPONSE_OK) {
                        const {
                            status,
                            result,
                            message
                        } = response.data;
                        if (status === enums.STATUS_RESPONSE_OK) {
                            let list: any = _.cloneDeep(result);
                            list.map((item: any) => {
                                item.id = item.id.toString();
                            })

                            list.push({
                                id: "0",
                                roleName: "Chọn quyền truy cập",
                                disabled: true
                            })

                            list = _.sortBy(list, ["id"]);

                            dispatch(setRoleData(list));
                        } else {
                            console.log(message);
                        }
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
                .finally(() => {
                    dispatch(setRoleLoading(false));
                });
        }
        getListRoleDropdown();

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
                            let list: BrandItem[] = _.cloneDeep(result);
                            list.map((item: any) => {
                                item.id = item.id.toString();
                            })

                            list.push({
                                id: "0",
                                brandName: "Chọn thương hiệu",
                                brandLogo: "",
                                disabled: true
                            })

                            list = _.sortBy(list, ["id"]);
                            // console.log(list)
                            dispatch(setBrandData(list));
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
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout pageInfo={{
            title: "Danh sách nhân viên",
            description: "Tạo, chỉnh sửa, quản lý nhân viên của bạn."
        }}>
            <FilterUser />
        </Layout>
    )
}