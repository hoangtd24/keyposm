import Layout from "@/components/ui/module/layout";
import FilterDeployCampaign from "@/components/ui/module/filter/deploy/campaign";
import { useAppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import _ from "lodash";
import * as enums from "@/lib/enums";
import {
  NEXT_PUBLIC_API_DROPDOWN_CHANNEL_CAMPAIGN,
  NEXT_PUBLIC_API_DROPDOWN_AREA_CAMPAIGN,
  NEXT_PUBLIC_LIST_ADDRESS_API,
} from "@/config/api";
import { setProvinceLoading, setProvinceData } from "@/lib/store/slices/provinceSlice";
import { setDistrictLoading, setDistrictData } from "@/lib/store/slices/districtSlice";

import { ChannelItem, setDropdownChannelData, setChannelLoading } from "@/lib/store/slices/channelSlice";
import { AreaItem, setAreaDropdownData, setAreaLoading } from "@/lib/store/slices/areaSlice";
import { useToast } from "@/components/ui/use-toast";

export default function DeployCampaign({ campaignId }: { campaignId: string }) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const getListChannelDropdown = async (campaignId: string) => {
      dispatch(setChannelLoading(true));
      axiosWithHeaders("post", NEXT_PUBLIC_API_DROPDOWN_CHANNEL_CAMPAIGN, { campaignId })
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            // console.log(response);
            if (response && response.status === enums.STATUS_RESPONSE_OK) {
              const {
                result,
                status,
                message,
              } = response.data;
              if (status === enums.STATUS_RESPONSE_OK) {
                console.log("channel", result);

                let listChannel: ChannelItem[] = _.cloneDeep(result);
                listChannel.map((item: any) => {
                  item.id = item.id.toString();
                })
                dispatch(setDropdownChannelData(listChannel));
              } else {
                toast({
                  title: "Lỗi",
                  description: message,
                })
              }
            }
          }
        })
        .catch((error: any) => {
          toast({
            title: "Lỗi",
            description: error.toString(),
          })
        })
        .finally(() => {
          dispatch(setChannelLoading(false));
        })
    }

    const getListAreaDropdown = async (campaignId: string) => {
      dispatch(setAreaLoading(true));
      axiosWithHeaders("post", NEXT_PUBLIC_API_DROPDOWN_AREA_CAMPAIGN, { campaignId })
        .then((response: any) => {
          if (response && response.status === enums.STATUS_RESPONSE_OK) {
            const {
              result,
              status,
              message,
            } = response.data;
            if (status === enums.STATUS_RESPONSE_OK) {

              let listArea: AreaItem[] = _.cloneDeep(result);
              listArea.map((item: any) => {
                item.id = item.id.toString();
              })
              dispatch(setAreaDropdownData(listArea));
            } else {
              toast({
                title: "Lỗi",
                description: message,
              })
            }
          }
        })
        .catch((error: any) => {
          toast({
            title: "Lỗi",
            description: error.toString(),
          })
        })
        .finally(() => {
          dispatch(setAreaLoading(false));
        })
    }
    console.count("get address")
    // console.log(campaignId)
    getListAreaDropdown(campaignId);
    getListChannelDropdown(campaignId);

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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout pageInfo={{
      title: "DANH SÁCH LẮP ĐẶT",
      description: "Quản lý danh sách lắp đặt"
    }}>
      <FilterDeployCampaign campaignId={campaignId} />
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const { campaignId } = context.params;

  return {
    props: {
      campaignId,
    }, // will be passed to the page component as props
  };
}
