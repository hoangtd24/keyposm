import Layout from "@/components/ui/module/layout";
// import FilterDeploy from "@/components/ui/module/filter/deploy";
import { useAppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import { setBrandLoading, setBrandData } from "@/lib/store/slices/brandSlice";
import _ from "lodash";
import * as enums from "@/lib/enums";
import { 
  NEXT_PUBLIC_API_DROPDOWN_BRAND, 
  NEXT_PUBLIC_LIST_ADDRESS_API,
  NEXT_PUBLIC_LIST_CAMPAIGN_DROPDOWN_API
} from "@/config/api";
import { setProvinceLoading, setProvinceData } from "@/lib/store/slices/provinceSlice";
import { setDistrictLoading, setDistrictData } from "@/lib/store/slices/districtSlice";
import { setCampaignLoading, setCampaignData } from "@/lib/store/slices/campaignSlice";
import FilterDeploy from "@/components/ui/module/filter/deploy";

export default function Deploy() {
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
    console.count("brand load")

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
    console.count("get address");

    const getCampaignDropdown = async () => {
      dispatch(setCampaignLoading(true));
      axiosWithHeaders("get", NEXT_PUBLIC_LIST_CAMPAIGN_DROPDOWN_API, null)
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            const {
              status,
              result,
              message
            } = response.data;
            if (status === enums.STATUS_RESPONSE_OK) {
              dispatch(setCampaignData(result));
            } else {
              console.log(message);
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
        })
        .finally(() => {
          dispatch(setCampaignLoading(false));
        });
    }
    getCampaignDropdown();
    console.count("get campaign")
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout pageInfo={{
      title: "DANH SÁCH LẮP ĐẶT",
      description: "Quản lý danh sách lắp đặt"
    }}>
      <FilterDeploy />
    </Layout>
  );
}
