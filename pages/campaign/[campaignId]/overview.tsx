import Layout from "@/components/ui/module/layout";
import { Label } from "@/components/ui/label";
import FilterCampaign from "@/components/ui/module/filter/campaign";
import TableCampaign from "@/components/ui/module/table/campaign";
import { CreateCampaign } from "@/components/ui/module/campaign";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import { setBrandLoading, setBrandData } from "@/lib/store/slices/brandSlice";
import _, { set } from "lodash";
import * as enums from "@/lib/enums";
import BarChart from "@/components/ui/module/chart/apexchart/campaign/stackedcolumn";
import BarChartVertical from "@/components/ui/module/chart/apexchart/campaign/barchart";
import DonnutChart from "@/components/ui/module/chart/apexchart/campaign/donut";
import Sparklines from "@/components/ui/module/chart/apexchart/campaign/sparklines";
import { NEXT_PUBLIC_OVERVIEW_CAMPAIGN_API } from "@/config/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";

const token_storage: any = process.env
  .NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

export default function Overview({ campaignId }: { campaignId: string }) {
  const router = useRouter();

  const { access_token } = useAppSelector((state: any) => state.auth);
  const [roleLogin, setRoleLogin] = useState<any>(null);
  const dispatch = useAppDispatch();
  const [detail, setDetail] = useState<any>();
  const [areas, setAreas] = useState<any>();
  const [channels, setChannels] = useState<any>();
  const [totalTicket, setTotalTicket] = useState<any>(0);
  const [totalDeploy, setTotalDeploy] = useState<any>(0);
  const [totalLocation, setTotalLocation] = useState<any>(0);
  const [deploy, setDeploy] = useState<any>();
  const [ticket, setTicket] = useState<any>();
  useEffect(() => {
    const token = localStorage.getItem(token_storage)
      ? localStorage.getItem(token_storage)
      : access_token;
    // console.log(token)
    if (token) {
      const decoded: any = jwtDecode(token);
      const info: any = decoded.data;

      const roleId = info.roleId;

      setRoleLogin(roleId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  useEffect(() => {
    console.log(router.asPath)
  }, [router])

  useEffect(() => {
    // console.log(111111)
    axiosWithHeaders("post", NEXT_PUBLIC_OVERVIEW_CAMPAIGN_API, {
      id: campaignId,
    })
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { status, result, message } = response.data;
          if (status === enums.STATUS_RESPONSE_OK) {
            // console.log(result)
            if (result) {
              const {
                detail,
                areas,
                channels,
                totalTicket,
                totalDeploy,
                totalLocation,
                deploy,
                ticket
              } = result;
              setAreas(areas);
              setChannels(channels);
              setDetail(detail);
              setTotalDeploy(totalDeploy);
              setTotalTicket(totalTicket);
              setTotalLocation(totalLocation);
              setDeploy(deploy)
              setTicket(ticket)
            }
          } else {
            console.log(message);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderChannel = () => {
    let arr = [] as any;
    if (channels != undefined && channels != null && channels.length > 0) {
      channels.map((item: any, idx: any) => {
        arr.push(<DonnutChart key={idx} data={item} className={"w-1/3"} />);
      });
    }
    return arr;
  };

  return (
    <Layout
      pageInfo={{
        title: "Tổng quan chiến dịch"
      }}>
      <div className="w-full p-0">

        <div className="w-full flex flex-wrap justify-center">
          <Label className="text-lg lg:text-2xl text-center">
            {detail?.campaignName}
          </Label>
        </div>
        <div className="w-full grid grid-cols-1 gap-3 lg:grid-cols-2 lg:grid-rows-2 lg:gap-6 p-0 lg:px-8 pb-0 lg:mt-8">
          {channels != undefined &&
            channels != null &&
            channels.length > 0 &&
            <div className="lg:row-span-2 shadow-gray-100 rounded-[30px] bg-white shadow-lg h-auto">
              <BarChartVertical data={channels} campaignId={campaignId} />
            </div>
          }
          {deploy && ticket && (
            <>
              <div className="p-6 shadow-gray-100 rounded-[30px] bg-white shadow-lg">
                <Sparklines subtitle={"Tổng số POSM lắp đặt"} title={deploy?.total ?? "0"} colors={['#008FFB']} className={"w-full"} data={deploy?.data} labels={deploy?.labels} />
              </div>
              <div className="p-6 shadow-gray-100 rounded-[30px] bg-white shadow-lg">
                <Sparklines subtitle={"Tổng số sự cố"} title={ticket?.total.toString()} colors={['#FEB019']} className={"w-full"} data={ticket?.data} labels={ticket?.labels} />
              </div>
            </>

            // <div className="flex flex-wrap mb-8">
            //   <Sparklines subtitle={"Tổng số POSM lắp đặt"} title={deploy?.total} colors={['#008FFB']} className={"w-full p-6 shadow-gray-100 rounded-[30px] bg-white shadow-lg lg:ml-8"} data={deploy?.data} labels={deploy?.labels} />
            //   <Sparklines subtitle={"Tổng số sự cố"} title={ticket?.total.toString()} colors={['#FEB019']} className={"w-full p-6 shadow-gray-100 rounded-[30px] bg-white shadow-lg lg:ml-8 mt-5"} data={ticket?.data} labels={ticket?.labels} />
            // </div>
          )}


          {/* <div className="w-1/2 flex flex-wrap mb-8 shadow-gray-100 rounded-[30px] bg-white shadow-lg">
            {channels != undefined &&
              channels != null &&
              channels.length > 0 &&
              <BarChartVertical data={channels} campaignId={campaignId} />
            }
          </div>
          <div className="w-1/2 flex flex-wrap mb-8">
            {deploy && <Sparklines subtitle={"Tổng số POSM lắp đặt"} title={deploy?.total} colors={['#008FFB']} className={"w-full p-6 shadow-gray-100 rounded-[30px] bg-white shadow-lg ml-8"} data={deploy?.data} labels={deploy?.labels} />}
            {ticket && <Sparklines subtitle={"Tổng số sự cố"} title={ticket?.total.toString()} colors={['#FEB019']} className={"w-full p-6 shadow-gray-100 rounded-[30px] bg-white shadow-lg ml-8 mt-5"} data={ticket?.data} labels={ticket?.labels} />}

          </div> */}
        </div>
        {areas != undefined && areas != null && areas.length > 0 && (
          <div className="w-full grid grid-cols-1 lg:gap-6 p-0 lg:px-8 pb-0 mt-4 mb-6 lg:mt-8">
            <div className="col-span-2 w-full shadow-gray-100 rounded-[30px] bg-white shadow-lg">
              <BarChart data={areas} campaignId={campaignId} />
            </div>
          </div>

        )}

        {/* <div className="w-full flex lg:px-8 pb-0 pt-0">
          <div className="w-full shadow-gray-100 rounded-[30px] bg-white shadow-lg">
            {areas != undefined && areas != null && areas.length > 0 && (
              <BarChart data={areas} campaignId={campaignId} />
            )}
          </div>
        </div> */}

        {/* 
        <div className="w-full flex flex-wrap mb-8">
          <Link href={`/campaign/${campaignId}/ticket`}>
            <Button
              variant={`outline`}
              size={`sm`}
              className="text-foreground"
              onClick={() => {}}
            >
              SỐ LƯỢNG TICKET : {totalTicket}
            </Button>
          </Link>
          <Link href={`/campaign/${campaignId}/deploy`}>
            <Button
              variant={`outline`}
              size={`sm`}
              className="text-foreground"
              onClick={() => {}}
            >
              SỐ LƯỢNG DEPLOY : {totalDeploy}
            </Button>
          </Link>
          <Link href={`/campaign/${campaignId}/location`}>
            <Button
              variant={`outline`}
              size={`sm`}
              className="text-foreground"
              onClick={() => {}}
            >
              SỐ LƯỢNG ĐỊA ĐIỂM : {totalLocation}
            </Button>
          </Link>
        </div> */}
      </div>
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
