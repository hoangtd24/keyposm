import Layout from "@/components/ui/module/layout";
import { useAppDispatch } from "@/lib/store";
import { useEffect } from "react";
import * as enums from "@/lib/enums";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import { setProvinceLoading, setProvinceData } from "@/lib/store/slices/provinceSlice";
import { setDistrictLoading, setDistrictData } from "@/lib/store/slices/districtSlice";
import { setCampaignLoading, setCampaignData } from "@/lib/store/slices/campaignSlice";
import { setBrandLoading, setBrandData } from "@/lib/store/slices/brandSlice";
import { setTicketStatusLoading, setTicketStatusData } from "@/lib/store/slices/ticketStatusSlice";
import { 
  NEXT_PUBLIC_LIST_ADDRESS_API, 
  NEXT_PUBLIC_API_DROPDOWN_BRAND, 
  NEXT_PUBLIC_LIST_CAMPAIGN_DROPDOWN_API,
  NEXT_PUBLIC_LIST_STATUS_API 
} from "@/config/api";
import _ from "lodash";
import FilterTicket from "@/components/ui/module/filter/ticket";

export default function Ticket() {
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
              // console.log(result)
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

    const getListTicketStatusDropdown = async () => {
      dispatch(setTicketStatusLoading(true));
      axiosWithHeaders("get", NEXT_PUBLIC_LIST_STATUS_API, null)
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            const {
              status,
              result,
              message
            } = response.data;
            if (status === enums.STATUS_RESPONSE_OK) {
              dispatch(setTicketStatusData(result));
            } else {
              console.log(message);
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
        })
        .finally(() => {
          dispatch(setTicketStatusLoading(false));
        });
    }
    getListTicketStatusDropdown();
    console.count("ticket status load");
    //eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  return (
    <Layout pageInfo={{
      title: "DANH SÁCH SỰ CỐ",
      description: "Quản lý danh sách sự cố",
    }}>
      <FilterTicket />
    </Layout>
  );
}
